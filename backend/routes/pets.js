// routes/pets.js

const express = require("express");
const router = express.Router();
const { admin, db, auth, bucket } = require("../services/firebase");
const authenticate = require("../middleware/auth");
const upload = require("../middleware/upload");

// POST /api/pets - Create a new pet
router.post('/', authenticate, upload.single('profileImage'), async (req, res) => {
  const { name, type, breed, age } = req.body;

  // Validate required fields
  if (!name || !type || !breed || age === undefined) {
    return res.status(400).json({ message: 'Name, type, breed, and age are required.' });
  }

  try {
    // Generate a new document reference with an auto-generated ID
    const petRef = db.collection('pets').doc();
    const petId = petRef.id; // Unique Pet ID

    // Prepare new pet data with petId
    const newPet = {
      petId, // Assign the unique Pet ID
      ownerId: req.user.uid,
      name,
      type,
      breed,
      age: parseInt(age),
      posts: [],
      profileImage: '' // Will be updated if an image is uploaded
    };

    // Handle profile image upload if provided
    if (req.file) {
      const fileName = `petImages/${req.user.uid}_${Date.now()}_${req.file.originalname}`;
      const file = bucket.file(fileName);

      // Save the file to Firebase Storage
      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype
        }
      });

      // Make the file public (optional, based on your requirements)
      await file.makePublic();

      // Get the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      newPet.profileImage = publicUrl;
    } else {
      // Assign a default placeholder image if no image is uploaded
      newPet.profileImage = 'https://via.placeholder.com/150?text=No+Image';
    }

    // Add the pet to Firestore with the unique Pet ID
    await petRef.set(newPet);

    // Add the pet reference to the user's document
    await db.collection('users').doc(req.user.uid).update({
      pets: admin.firestore.FieldValue.arrayUnion(petId)
    });

    res.status(201).json({ message: 'Pet created successfully.', petId: petId });
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// GET /api/pets/:petId - Get pet details
router.get("/:petId", authenticate, async (req, res) => {
  const { petId } = req.params;

  try {
    const petDoc = await db.collection("pets").doc(petId).get();

    if (!petDoc.exists) {
      return res.status(404).json({ message: "Pet not found." });
    }

    const petData = petDoc.data();

    // Ensure the requesting user is the owner
    if (petData.ownerId !== req.user.uid) {
      return res.status(403).json({ message: "Forbidden. Access denied." });
    }

    res.status(200).json(petData);
  } catch (error) {
    console.error("Error fetching pet data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// PUT /api/pets/:petId - Update pet details
router.put(
  "/:petId",
  authenticate,
  upload.single("profileImage"),
  async (req, res) => {
    const { petId } = req.params;
    const { name, type, breed, age } = req.body;

    try {
      const petRef = db.collection("pets").doc(petId);
      const petDoc = await petRef.get();

      if (!petDoc.exists) {
        return res.status(404).json({ message: "Pet not found." });
      }

      const petData = petDoc.data();

      // Ensure the requesting user is the owner
      if (petData.ownerId !== req.user.uid) {
        return res.status(403).json({ message: "Forbidden. Access denied." });
      }

      // Prepare updated data
      const updatedData = {};
      if (name) updatedData.name = name;
      if (type) updatedData.type = type;
      if (breed) updatedData.breed = breed;
      if (age) updatedData.age = parseInt(age);

      // Handle profile image upload if provided
      if (req.file) {
        const fileName = `petImages/${req.user.uid}_${Date.now()}_${
          req.file.originalname
        }`;
        const file = bucket.file(fileName);

        await file.save(req.file.buffer, {
          metadata: {
            contentType: req.file.mimetype,
          },
        });

        // Make the file public
        await file.makePublic();

        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        updatedData.profileImage = publicUrl;
      }

      await petRef.update(updatedData);

      res.status(200).json({ message: "Pet updated successfully." });
    } catch (error) {
      console.error("Error updating pet:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// DELETE /api/pets/:petId - Delete a pet and associated data
router.delete('/:petId', authenticate, async (req, res) => {
  const { petId } = req.params;

  try {
    const petRef = db.collection('pets').doc(petId);
    const userRef = db.collection('users').doc(req.user.uid);

    await db.runTransaction(async (transaction) => {
      const petDoc = await transaction.get(petRef);
      const userDoc = await transaction.get(userRef);

      if (!petDoc.exists) {
        throw new Error('Pet not found.');
      }

      const petData = petDoc.data();

      // Verify ownership
      if (petData.ownerId !== req.user.uid) {
        throw new Error('Forbidden. Access denied.');
      }

      // Delete associated posts (optional)
      const postsSnapshot = await db.collection('posts').where('petId', '==', petId).get();
      postsSnapshot.forEach((doc) => {
        transaction.delete(doc.ref);
      });

      // Delete the pet document
      transaction.delete(petRef);

      // Remove petId from user's pets array
      transaction.update(userRef, {
        pets: admin.firestore.FieldValue.arrayRemove(petId),
      });
    });

    res.status(200).json({ message: 'Pet and associated posts deleted successfully.' });
  } catch (error) {
    console.error('Error deleting pet:', error);
    if (error.message === 'Pet not found.') {
      return res.status(404).json({ message: error.message });
    } else if (error.message === 'Forbidden. Access denied.') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// GET /api/pets/user/:uid - Get all pets for a user
router.get("/user/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const petsSnapshot = await db.collection("pets")
      .where("ownerId", "==", uid)
      .get();

    const pets = petsSnapshot.docs.map(doc => doc.data());

    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching pets for user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


module.exports = router;
