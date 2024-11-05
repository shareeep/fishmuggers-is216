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
    const existingRequest = await db
      .collection("friendRequests")
      .where("senderId", "==", senderId)
      .where("receiverId", "==", receiverId)
      .where("status", "==", "pending")
      .get();

    if (!existingRequest.empty) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    // Add senderId to receiver's pendingFriends array
    await db
      .collection("users")
      .doc(receiverId)
      .update({
        pendingFriends: admin.firestore.FieldValue.arrayUnion(senderId),
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
    res.status(201).json({
      message: "Friend request sent successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Failed to send friend request" });
  }
});

// Accept a friend request
router.put("/request/accept/:requestId", async (req, res) => {
  const requestId = req.params.requestId;

  try {
    // Fetch the friend request document
    const requestRef = db.collection("friendRequests").doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists || requestDoc.data().status !== "pending") {
      return res.status(404).json({ error: "Pending friend request not found" });
    }

    const { senderId, receiverId } = requestDoc.data();
    const receiverRef = db.collection("users").doc(receiverId);

    // Remove senderId from receiver's pendingFriends and add to friends
    await receiverRef.update({
      pendingFriends: admin.firestore.FieldValue.arrayRemove(senderId),
      friends: admin.firestore.FieldValue.arrayUnion(senderId)
    });

    // Add receiverId to sender's friends list
    const senderRef = db.collection("users").doc(senderId);
    await senderRef.update({
      friends: admin.firestore.FieldValue.arrayUnion(receiverId)
    });

    // Update the friend request document status to accepted
    await requestRef.update({ status: "accepted" });

    res.status(200).json({ message: "Friend request accepted successfully" });
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
      return res
        .status(404)
        .json({ error: "Pending friend request not found" });
    }

    const { senderId, receiverId } = requestDoc.data();

    // Remove senderId from receiver's pendingFriends array
    await db
      .collection("users")
      .doc(receiverId)
      .update({
        pendingFriends: admin.firestore.FieldValue.arrayRemove(senderId),
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
    const requestsSnapshot = await db
      .collection("friendRequests")
      .where("receiverId", "==", userId)
      .where("status", "==", "pending")
      .get();

    const requests = [];
    requestsSnapshot.forEach((doc) => {
      requests.push(doc.data());
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error(
      `Error fetching friend requests for userId ${userId}:`,
      error
    );
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

    const friendsIds = userDoc.data().friends || []; // Get friend IDs from user's document
    const friendsData = [];

    for (const friendId of friendsIds) {
      const friendDoc = await db.collection("users").doc(friendId).get();
      if (friendDoc.exists) {
        friendsData.push({
          id: friendDoc.id,
          name: friendDoc.data().name,
          username: friendDoc.data().username,
          profileImage: friendDoc.data().profileImage || "default-avatar.jpg",
        });
      }
    }

    res.status(200).json(friendsData); // Return an array of friend objects
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
    await db
      .collection("users")
      .doc(userId)
      .update({
        friends: admin.firestore.FieldValue.arrayRemove(friendId),
      });
    await db
      .collection("users")
      .doc(friendId)
      .update({
        friends: admin.firestore.FieldValue.arrayRemove(userId),
      });

    // Remove any existing friend request record
    const requestsSnapshot = await db
      .collection("friendRequests")
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
    console.error(
      `Error fetching friend details for friendId ${friendId}:`,
      error
    );
    res.status(500).json({ error: "Failed to fetch friend details" });
  }
});

// Get sent friend requests for a user
router.get("/requests/sent/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const sentRequestsSnapshot = await db
      .collection("friendRequests")
      .where("senderId", "==", userId)
      .where("status", "==", "pending")
      .get();

    const sentRequests = [];
    sentRequestsSnapshot.forEach((doc) => {
      sentRequests.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(sentRequests);
  } catch (error) {
    console.error(
      `Error fetching sent friend requests for userId ${userId}:`,
      error
    );
    res.status(500).json({ error: "Failed to fetch sent friend requests" });
  }
});

// Delete a sent friend request
router.delete("/request/:requestId", async (req, res) => {
  const { requestId } = req.params;

  try {
    // Delete the friend request document
    await db.collection("friendRequests").doc(requestId).delete();
    res.status(200).json({ message: "Friend request canceled successfully" });
  } catch (error) {
    console.error("Error canceling friend request:", error);
    res.status(500).json({ error: "Failed to cancel friend request" });
  }
});

module.exports = router;
