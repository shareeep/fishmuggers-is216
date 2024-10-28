const express = require("express");
const router = express.Router();
const { db } = require("../services/firebase"); // Import Firestore instance
const admin = require("firebase-admin"); // Import Firebase Admin SDK

// --------------------
// Routes
// --------------------

// Send a friend request
router.post("/request", async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: "Missing senderId or receiverId" });
  }

  try {
    // Check if a friend request already exists
    const existingRequest = await db.collection("friendRequests")
      .where("senderId", "==", senderId)
      .where("receiverId", "==", receiverId)
      .where("status", "==", "pending")
      .get();

    if (!existingRequest.empty) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    // Add senderId to receiver's pendingFriends array
    await db.collection("users").doc(receiverId).update({
      pendingFriends: admin.firestore.FieldValue.arrayUnion(senderId)
    });

    // Create a new friend request document
    const requestRef = db.collection("friendRequests").doc();
    const newRequest = {
      requestId: requestRef.id,
      senderId,
      receiverId,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await requestRef.set(newRequest);
    res.status(201).json({ message: "Friend request sent successfully", request: newRequest });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Failed to send friend request" });
  }
});

// Accept a friend request
router.put("/request/accept/:requestId", async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const requestRef = db.collection("friendRequests").doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists || requestDoc.data().status !== "pending") {
      return res.status(404).json({ error: "Pending friend request not found" });
    }

    const { senderId, receiverId } = requestDoc.data();

    // Update friend lists
    await db.collection("users").doc(receiverId).update({
      friends: admin.firestore.FieldValue.arrayUnion(senderId),
      pendingFriends: admin.firestore.FieldValue.arrayRemove(senderId)
    });
    await db.collection("users").doc(senderId).update({
      friends: admin.firestore.FieldValue.arrayUnion(receiverId)
    });

    // Update friend request status
    await requestRef.update({ status: "accepted" });
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: "Failed to accept friend request" });
  }
});

// Reject a friend request
router.put("/request/reject/:requestId", async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const requestRef = db.collection("friendRequests").doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists || requestDoc.data().status !== "pending") {
      return res.status(404).json({ error: "Pending friend request not found" });
    }

    const { senderId, receiverId } = requestDoc.data();

    // Remove senderId from receiver's pendingFriends array
    await db.collection("users").doc(receiverId).update({
      pendingFriends: admin.firestore.FieldValue.arrayRemove(senderId)
    });

    // Update friend request status
    await requestRef.update({ status: "rejected" });
    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ error: "Failed to reject friend request" });
  }
});

// Get pending friend requests for a user
router.get("/requests/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const requestsSnapshot = await db.collection("friendRequests")
      .where("receiverId", "==", userId)
      .where("status", "==", "pending")
      .get();

    const requests = [];
    requestsSnapshot.forEach((doc) => {
      requests.push(doc.data());
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error(`Error fetching friend requests for userId ${userId}:`, error);
    res.status(500).json({ error: "Failed to fetch friend requests" });
  }
});

// Get all friends for a user
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const friends = userDoc.data().friends || [];
    res.status(200).json(friends);
  } catch (error) {
    console.error(`Error fetching friends for userId ${userId}:`, error);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
});

// Remove a friend
router.delete("/:userId/remove/:friendId", async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    // Remove each other from friends array
    await db.collection("users").doc(userId).update({
      friends: admin.firestore.FieldValue.arrayRemove(friendId)
    });
    await db.collection("users").doc(friendId).update({
      friends: admin.firestore.FieldValue.arrayRemove(userId)
    });

    // Remove any existing friend request record
    const requestsSnapshot = await db.collection("friendRequests")
      .where("status", "==", "accepted")
      .where("senderId", "in", [userId, friendId])
      .where("receiverId", "in", [userId, friendId])
      .get();

    const batch = db.batch();
    requestsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error(`Error removing friend for userId ${userId}:`, error);
    res.status(500).json({ error: "Failed to remove friend" });
  }
});

// View a friend's details
router.get("/:userId/view/:friendId", async (req, res) => {
  const { friendId } = req.params;

  try {
    const friendDoc = await db.collection("users").doc(friendId).get();

    if (!friendDoc.exists) {
      return res.status(404).json({ error: "Friend not found" });
    }

    res.status(200).json(friendDoc.data());
  } catch (error) {
    console.error(`Error fetching friend details for friendId ${friendId}:`, error);
    res.status(500).json({ error: "Failed to fetch friend details" });
  }
});

module.exports = router;