const express = require("express");
const router = express.Router();
const { db } = require("../services/firebase"); // Import Firestore instance
const admin = require("firebase-admin"); // Import Firebase Admin SDK

// --------------------
// Routes
// --------------------

// @route   GET /api/pets
// @desc    Get all pets
// @access  Public
router.get("/", async (req, res) => {
  try {
    const petsSnapshot = await db.collection("pets").get();
    const pets = [];
    petsSnapshot.forEach((doc) => {
      pets.push({ petId: doc.id, ...doc.data() });
    });
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ error: "Failed to fetch pets" });
  }
});

// @route   GET /api/pets/owner/:ownerId
// @desc    Get all pets by a specific ownerId
// @access  Public
router.get("/owner/:ownerId", async (req, res) => {
    const ownerId = req.params.ownerId;

    try {
      const petsSnapshot = await db.collection("pets").where("ownerId", "==", ownerId).get();
      
      if (petsSnapshot.empty) {
        return res.status(404).json({ message: "No pets found for this owner." });
      }
  
      const pets = [];
      petsSnapshot.forEach((doc) => {
        pets.push({ petId: doc.id, ...doc.data() });
      });
  
      res.status(200).json(pets);
    } catch (error) {
      console.error(`Error fetching pets for ownerId ${ownerId}:`, error);
      res.status(500).json({ error: "Failed to fetch pets" });
    }
});

// @route   POST /api/pets
// @desc    Create a new pet
// @access  Public
router.post("/", async (req, res) => {
    const { ownerId, petBreed, petName, petType } = req.body;

    if (!ownerId || !petBreed || !petName || !petType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const petRef = db.collection("pets").doc(); // Auto-generate a unique document ID
      const petId = petRef.id; // Get the auto-generated ID

      const newPet = {
        ownerId,
        petId,
        petBreed,
        petName,
        petType,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await petRef.set(newPet);

      console.log(`New pet added with ID: ${petId}`);
      res.status(201).json({ message: "Pet created successfully", pet: newPet });
    } catch (error) {
      console.error("Error creating pet:", error);
      res.status(500).json({ error: "Failed to create pet" });
    }
});

// @route   PUT /api/pets/:id
// @desc    Update an existing pet by ID
// @access  Public
router.put("/:id", async (req, res) => {
  const petId = req.params.id;
  const { petBreed, petName, petType } = req.body;

  if (!petBreed || !petName || !petType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const petRef = db.collection("pets").doc(petId);
    const petDoc = await petRef.get();

    if (!petDoc.exists) {
      return res.status(404).json({ error: "Pet not found" });
    }

    await petRef.update({
      petBreed,
      petName,
      petType,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Pet updated successfully" });
  } catch (error) {
    console.error(`Error updating pet with ID ${petId}:`, error);
    res.status(500).json({ error: "Failed to update pet" });
  }
});

// @route   DELETE /api/pets/:id
// @desc    Delete a pet by ID
// @access  Public
router.delete("/:id", async (req, res) => {
  const petId = req.params.id;

  try {
    const petRef = db.collection("pets").doc(petId);
    const petDoc = await petRef.get();

    if (!petDoc.exists) {
      return res.status(404).json({ error: "Pet not found" });
    }

    await petRef.delete();
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error(`Error deleting pet with ID ${petId}:`, error);
    res.status(500).json({ error: "Failed to delete pet" });
  }
});

module.exports = router;
