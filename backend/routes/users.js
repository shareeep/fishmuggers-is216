// routes/users.js

const express = require("express");
const router = express.Router();
const { db, auth, bucket } = require("../services/firebase");
const authenticate = require("../middleware/auth");
const upload = require("../middleware/upload");

// 1. Static Routes - Define these first
// GET /api/users/checkUsername - Check username availability
router.get("/checkUsername", authenticate, async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res
      .status(400)
      .json({ message: "Username query parameter is required." });
  }

  try {
    const usersRef = db.collection("users");
    const q = usersRef.where("username", "==", username).limit(1);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      res.status(200).json({ isTaken: false });
    } else {
      const user = querySnapshot.docs[0].data();
      if (user.uid === req.user.uid) {
        res.status(200).json({ isTaken: false });
      } else {
        res.status(200).json({ isTaken: true });
      }
    }
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// 2. Dynamic Routes - Define these after static routes
// GET /api/users/:uid - Fetch user data
router.get("/:uid", authenticate, async (req, res) => {
  const { uid } = req.params;

  // Ensure the requesting user is accessing their own data
  if (req.user.uid !== uid) {
    return res.status(403).json({ message: "Forbidden. Access denied." });
  }

  try {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// PUT /api/users/:uid - Update user data
router.put(
  "/:uid",
  authenticate,
  upload.single("profileImage"),
  async (req, res) => {
    const { uid } = req.params;

    // Ensure the requesting user is updating their own data
    if (req.user.uid !== uid) {
      return res.status(403).json({ message: "Forbidden. Access denied." });
    }

    const { email, username, password, points, joinedEvents, pets } = req.body;

    // Basic validation
    if (!email || !username) {
      return res
        .status(400)
        .json({ message: "Email and username are required." });
    }

    try {
      // Check if the desired username is already taken by another user
      const usernameQuery = await db
        .collection("users")
        .where("username", "==", username)
        .get();
      if (!usernameQuery.empty) {
        const existingUser = usernameQuery.docs[0].data();
        if (existingUser.uid !== uid) {
          return res
            .status(400)
            .json({ message: "Username is already taken." });
        }
      }

      // Prepare updated data
      const updatedData = {
        email,
        username,
        points: points ? parseInt(points) : 0,
        joinedEvents: joinedEvents ? JSON.parse(joinedEvents) : [],
        pets: pets ? JSON.parse(pets) : [],
      };

      // Handle profile image upload if provided
      if (req.file) {
        const fileName = `profileImages/${uid}_${Date.now()}_${
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

      // Update Firebase Auth email and password if changed
      if (email !== req.user.email) {
        await auth.updateUser(uid, { email });
      }

      if (password) {
        await auth.updateUser(uid, { password });
      }

      // Update Firestore document
      await db.collection("users").doc(uid).update(updatedData);

      res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

module.exports = router;
