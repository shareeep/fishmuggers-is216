// controllers/userController.js
const { db, bucket, auth } = require("../services/firebase");
const path = require("path");

// Helper function to sanitize inputs (optional but recommended)
const sanitize = (input) => {
  return input.replace(/[^a-zA-Z0-9_]/g, "");
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const { uid } = req.params;
  const { email, userID, points, joinedEvents } = req.body;
  let profileImageURL = null;

  try {
    // Fetch the current user document
    const userDocRef = db.collection("users").doc(uid);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found." });
    }

    const updateData = {};

    // Update Email if provided
    if (email) {
      // Check if the new email is already in use by another user
      const emailQuery = await db
        .collection("users")
        .where("email", "==", email)
        .get();
      if (!emailQuery.empty && emailQuery.docs[0].id !== uid) {
        return res
          .status(400)
          .json({ message: "This email is already in use." });
      }
      updateData.email = email;
    }

    // Update userID if provided
    if (userID) {
      const sanitizedUserID = sanitize(userID);
      // Check if the new userID is already taken by another user
      const userIDQuery = await db
        .collection("users")
        .where("userID", "==", sanitizedUserID)
        .get();
      if (!userIDQuery.empty && userIDQuery.docs[0].id !== uid) {
        return res
          .status(400)
          .json({ message: "This userID is already taken." });
      }
      updateData.userID = sanitizedUserID;
    }

    // Update points if provided
    if (points !== undefined) {
      if (typeof points !== "number" || points < 0) {
        return res
          .status(400)
          .json({ message: "Points must be a non-negative number." });
      }
      updateData.points = points;
    }

    // Update joinedEvents if provided
    if (joinedEvents) {
      if (!Array.isArray(joinedEvents)) {
        return res
          .status(400)
          .json({ message: "joinedEvents must be an array of event IDs." });
      }
      updateData.joinedEvents = joinedEvents;
    }

    // Handle profile image upload if a file is provided
    if (req.file) {
      const fileName = `profileImages/${uid}/${Date.now()}_${path.basename(
        req.file.originalname
      )}`;
      const file = bucket.file(fileName);

      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      stream.on("error", (error) => {
        console.error("Error uploading file to Firebase Storage:", error);
        return res
          .status(500)
          .json({ message: "Failed to upload profile image." });
      });

      stream.on("finish", async () => {
        // Make the file public (optional)
        await file.makePublic();

        // Get the public URL
        profileImageURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        updateData.profileImage = profileImageURL;

        // Update the user document in Firestore
        await userDocRef.update(updateData);

        res
          .status(200)
          .json({ message: "Profile updated successfully.", data: updateData });
      });

      stream.end(req.file.buffer);
    } else {
      // If no image to upload, just update other fields
      await userDocRef.update(updateData);
      res
        .status(200)
        .json({ message: "Profile updated successfully.", data: updateData });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get User by userID
exports.getUserByUserID = async (req, res) => {
  const { userID } = req.params;

  try {
    const userQuery = await db
      .collection("users")
      .where("userID", "==", userID)
      .get();
    if (userQuery.empty) {
      return res.status(404).json({ message: "User not found." });
    }

    const userData = userQuery.docs[0].data();
    res.status(200).json({
      uid: userQuery.docs[0].id,
      email: userData.email,
      userID: userData.userID,
      profileImage: userData.profileImage || null,
      points: userData.points || 0,
      pets: userData.pets || [],
      joinedEvents: userData.joinedEvents || [],
    });
  } catch (error) {
    console.error("Error fetching user by userID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Add a Pet to User's Profile
exports.addPetToUser = async (req, res) => {
  const { uid } = req.params;
  const { petID } = req.body;

  if (!petID) {
    return res.status(400).json({ message: "petID is required." });
  }

  try {
    const userDocRef = db.collection("users").doc(uid);
    await userDocRef.update({
      pets: admin.firestore.FieldValue.arrayUnion(petID),
    });

    res.status(200).json({ message: "Pet added to profile successfully." });
  } catch (error) {
    console.error("Error adding pet to user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update Email
exports.updateEmail = async (req, res) => {
  const { uid } = req.params;
  const { email } = req.body;

  try {
    const userDocRef = db.collection("users").doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the new email is already in use
    const emailQuery = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (!emailQuery.empty && emailQuery.docs[0].id !== uid) {
      return res.status(400).json({ message: "This email is already in use." });
    }

    // Update Firebase Auth email
    await auth.updateUser(uid, { email });

    // Update Firestore email
    await userDocRef.update({ email });

    res.status(200).json({ message: "Email updated successfully." });
  } catch (error) {
    console.error("Error updating email:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
