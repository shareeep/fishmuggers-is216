// routes/users.js

const express = require("express");
const router = express.Router();
const { db, auth, bucket } = require("../services/firebase");
const authenticate = require("../middleware/auth");
const upload = require("../middleware/upload");
const { body, validationResult } = require("express-validator");

// --------------------
// Helper Functions
// --------------------

// Function to validate user data using express-validator
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
    .customSanitizer(async (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (e) {
          throw new Error("joinedEvents must be a valid JSON array.");
        }
      }
      return value;
    })
    .isArray()
    .withMessage("joinedEvents must be an array of event IDs.")
    .custom(async (joinedEvents) => {
      // Check if each eventId exists in the events collection
      for (const eventId of joinedEvents) {
        if (typeof eventId !== "string" || eventId.trim() === "") {
          throw new Error(`Invalid event ID: ${eventId}`);
        }
        const eventDoc = await db.collection("events").doc(eventId).get();
        if (!eventDoc.exists) {
          throw new Error(`Event ID does not exist: ${eventId}`);
        }
      }
      return true;
    }),
  
  body("hostingEvents")
    .optional()
    .customSanitizer((value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
      return value;
    })
    .isArray()
    .withMessage("hostingEvents must be an array of event IDs."),
  
  body("pets")
    .optional()
    .customSanitizer((value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
      return value;
    })
    .isArray()
    .withMessage("pets must be an array of pet IDs."),
  
  body("friends")
    .optional()
    .customSanitizer((value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
      return value;
    })
    .isArray()
    .withMessage("friends must be an array of user UIDs."),
  
  body("pendingFriends")
    .optional()
    .customSanitizer((value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
      return value;
    })
    .isArray()
    .withMessage("pendingFriends must be an array of user UIDs."),
];

// --------------------
// Routes
// --------------------

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
  validateUserData,
  async (req, res) => {
    const { uid } = req.params;

    // Ensure the requesting user is updating their own data
    if (req.user.uid !== uid) {
      return res.status(403).json({ message: "Forbidden. Access denied." });
    }

    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      username,
      password,
      points,
      joinedEvents,
      hostingEvents,
      pets,
      friends,
      pendingFriends,
    } = req.body;

    try {
      // Check if the desired username is already taken by another user
      if (username) {
        const usernameQuery = await db
          .collection("users")
          .where("username", "==", username)
          .limit(1)
          .get();

        if (!usernameQuery.empty) {
          const existingUser = usernameQuery.docs[0].data();
          if (existingUser.uid !== uid) {
            return res
              .status(400)
              .json({ message: "Username is already taken." });
          }
        }
      }

      // Prepare updated data
      const updatedData = {};

      if (email) updatedData.email = email;
      if (username) updatedData.username = username;
      if (points !== undefined)
        updatedData.points = parseInt(points, 10) || 0;
      if (joinedEvents)
        updatedData.joinedEvents = Array.isArray(joinedEvents)
          ? joinedEvents
          : JSON.parse(joinedEvents);
      if (hostingEvents)
        updatedData.hostingEvents = Array.isArray(hostingEvents)
          ? hostingEvents
          : JSON.parse(hostingEvents);
      if (pets)
        updatedData.pets = Array.isArray(pets) ? pets : JSON.parse(pets);
      if (friends)
        updatedData.friends = Array.isArray(friends)
          ? friends
          : JSON.parse(friends);
      if (pendingFriends)
        updatedData.pendingFriends = Array.isArray(pendingFriends)
          ? pendingFriends
          : JSON.parse(pendingFriends);

      // Handle profile image upload if provided
      if (req.file) {
        const fileName = `profileImages/${uid}_${Date.now()}_${req.file.originalname}`;
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
      if (email && email !== req.user.email) {
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

// GET /api/users/:userId/view/:friendId - View a friend's details
router.get("/:userId/view/:friendId", authenticate, async (req, res) => {
  const { friendId } = req.params;

  // Ensure the user has access to view friend's data
  // You might want to add additional checks for friendship status
  try {
    const friendDoc = await db.collection("users").doc(friendId).get();

    if (!friendDoc.exists) {
      return res.status(404).json({ error: "Friend not found." });
    }

    res.status(200).json(friendDoc.data());
  } catch (error) {
    console.error(`Error fetching friend details for friendId ${friendId}:`, error);
    res.status(500).json({ error: "Failed to fetch friend details" });
  }
});

// GET /api/users - Fetch all users
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

// GET /api/users/profile/:uid - Fetch profile data of any user by UID
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
