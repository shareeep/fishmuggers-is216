// routes/users.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middleware/auth");
const upload = require("../middleware/upload");

// Route to update user profile (including userID, email, profileImage, points, joinedEvents)
router.put(
  "/:uid",
  authenticate,
  upload.single("profileImage"),
  userController.updateUserProfile
);

// Route to get user details by userID
router.get("/byUserID/:userID", authenticate, userController.getUserByUserID);

// Route to add a pet to user's profile
router.post("/:uid/add-pet", authenticate, userController.addPetToUser);

// Optional: Route to update email separately if needed
router.put("/:uid/update-email", authenticate, userController.updateEmail);

// Additional routes can be added here for handling points, joinedEvents, etc.

module.exports = router;
