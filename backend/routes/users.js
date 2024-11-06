const express = require("express");
const router = express.Router();
const { db, auth, bucket } = require("../services/firebase");
const authenticate = require("../middleware/auth");
const upload = require("../middleware/upload");
const { body, validationResult } = require("express-validator");

// Helper function to validate user data on update
const validateUserData = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address."),
  body("username")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long."),
  body("points")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Points must be a non-negative integer."),
  body("joinedEvents")
    .optional()
    .customSanitizer((value) => JSON.parse(value || "[]"))
    .isArray()
    .withMessage("joinedEvents must be an array of event IDs."),
  body("hostingEvents")
    .optional()
    .customSanitizer((value) => JSON.parse(value || "[]"))
    .isArray()
    .withMessage("hostingEvents must be an array of event IDs."),
  body("pets")
    .optional()
    .customSanitizer((value) => JSON.parse(value || "[]"))
    .isArray()
    .withMessage("pets must be an array of pet IDs."),
  body("friends")
    .optional()
    .customSanitizer((value) => JSON.parse(value || "[]"))
    .isArray()
    .withMessage("friends must be an array of user UIDs."),
  body("pendingFriends")
    .optional()
    .customSanitizer((value) => JSON.parse(value || "[]"))
    .isArray()
    .withMessage("pendingFriends must be an array of user UIDs."),
];

// Routes

// 1. Check if a username is available
router.get("/checkUsername", authenticate, async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Username query parameter is required." });
  }

  try {
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef
      .where("username", "==", username)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return res.status(200).json({ isTaken: false });
    }

    const user = querySnapshot.docs[0].data();
    res.status(200).json({ isTaken: user.uid !== req.user.uid });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// 2. Fetch user profile data
router.get("/:uid", authenticate, async (req, res) => {
  const { uid } = req.params;

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

// 3. Update user profile data
router.put(
  "/:uid",
  authenticate,
  upload.single("profileImage"),
  validateUserData,
  async (req, res) => {
    const { uid } = req.params;

    if (req.user.uid !== uid) {
      return res.status(403).json({ message: "Forbidden. Access denied." });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      username,
      points,
      joinedEvents,
      hostingEvents,
      pets,
      friends,
      pendingFriends,
    } = req.body;

    try {
      if (username) {
        const usernameQuery = await db
          .collection("users")
          .where("username", "==", username)
          .limit(1)
          .get();
        if (!usernameQuery.empty && usernameQuery.docs[0].data().uid !== uid) {
          return res
            .status(400)
            .json({ message: "Username is already taken." });
        }
      }

      const updatedData = {
        email,
        username,
        points: points ? parseInt(points, 10) : 0,
        joinedEvents: joinedEvents || [],
        hostingEvents: hostingEvents || [],
        pets: pets || [],
        friends: friends || [],
        pendingFriends: pendingFriends || [],
      };

      if (req.file) {
        const fileName = `profileImages/${uid}_${Date.now()}_${
          req.file.originalname
        }`;
        const file = bucket.file(fileName);

        await file.save(req.file.buffer, {
          metadata: { contentType: req.file.mimetype },
        });
        await file.makePublic();

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        updatedData.profileImage = publicUrl;
      }

      if (email && email !== req.user.email) {
        await auth.updateUser(uid, { email });
      }

      await db.collection("users").doc(uid).update(updatedData);
      res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// 4. Fetch all users
router.get("/", authenticate, async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = [];

    usersSnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 5. Fetch profile data of any user by UID
router.get("/profile/:uid", authenticate, async (req, res) => {
  const { uid } = req.params;

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

module.exports = router;