const express = require("express");
const router = express.Router();
const { db } = require("../services/firebase");
const admin = require("firebase-admin");

// --------------------
// Routes
// --------------------

// 1. Send a friend request
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

// 2. Accept a friend request
router.put("/request/accept/:requestId", async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const requestRef = db.collection("friendRequests").doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists || requestDoc.data().status !== "pending") {
      return res.status(404).json({ error: "Pending friend request not found" });
    }

    const { senderId, receiverId } = requestDoc.data();

    // Update the users' friend lists
    await db.collection("users").doc(receiverId).update({
      pendingFriends: admin.firestore.FieldValue.arrayRemove(senderId),
      friends: admin.firestore.FieldValue.arrayUnion(senderId),
    });
    await db.collection("users").doc(senderId).update({
      friends: admin.firestore.FieldValue.arrayUnion(receiverId),
    });

    // Update the friend request status to accepted
    await requestRef.update({ status: "accepted" });

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: "Failed to accept friend request" });
  }
});

// 3. Reject a friend request
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
      pendingFriends: admin.firestore.FieldValue.arrayRemove(senderId),
    });

    // Update the friend request status to rejected
    await requestRef.update({ status: "rejected" });
    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ error: "Failed to reject friend request" });
  }
});

// 4. Get received friend requests for a user (with mutual friend calculation)
router.get("/requests/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const requestsSnapshot = await db
      .collection("friendRequests")
      .where("receiverId", "==", userId)
      .where("status", "==", "pending")
      .get();

    const userDoc = await db.collection("users").doc(userId).get();
    const userFriends = new Set(userDoc.data().friends || []);

    const requests = [];
    for (const doc of requestsSnapshot.docs) {
      const requestData = doc.data();
      const senderId = requestData.senderId;

      const senderDoc = await db.collection("users").doc(senderId).get();
      const senderData = senderDoc.data() || {};
      const senderFriends = new Set(senderData.friends || []);

      const mutualFriendsCount = [...userFriends].filter(friendId => senderFriends.has(friendId)).length;

      // Add sender's details to the request data
      requests.push({
        ...requestData,
        requestId: doc.id,
        mutualFriends: mutualFriendsCount,
        name: senderData.name || 'Unknown',  // Sender's name
        username: senderData.username || '',  // Sender's username
        avatar: senderData.profileImage || 'default-avatar.jpg',  // Sender's avatar
      });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error(`Error fetching friend requests for userId ${userId}:`, error);
    res.status(500).json({ error: "Failed to fetch friend requests" });
  }
});

// 5. Get sent friend requests for a user
router.get("/requests/sent/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const sentRequestsSnapshot = await db
      .collection("friendRequests")
      .where("senderId", "==", userId)
      .where("status", "==", "pending")
      .get();

    const sentRequests = [];
    for (const doc of sentRequestsSnapshot.docs) {
      const requestData = doc.data();
      const receiverId = requestData.receiverId;

      const receiverDoc = await db.collection("users").doc(receiverId).get();
      const receiverData = receiverDoc.exists ? receiverDoc.data() : {};

      sentRequests.push({
        id: doc.id,
        ...requestData,
        receiverName: receiverData.name || 'Unknown',
        receiverUsername: receiverData.username || 'Unknown',
      });
    }

    res.status(200).json(sentRequests);
  } catch (error) {
    console.error(`Error fetching sent friend requests for userId ${userId}:`, error);
    res.status(500).json({ error: "Failed to fetch sent friend requests" });
  }
});

// 6. Get all friends for a user
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const friendsIds = userDoc.data().friends || [];
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

    res.status(200).json(friendsData);
  } catch (error) {
    console.error(`Error fetching friends for userId ${userId}:`, error);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
});

// 7. Remove a friend
router.delete("/:userId/remove/:friendId", async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    await db.collection("users").doc(userId).update({
      friends: admin.firestore.FieldValue.arrayRemove(friendId),
    });
    await db.collection("users").doc(friendId).update({
      friends: admin.firestore.FieldValue.arrayRemove(userId),
    });

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

// 8. Cancel a sent friend request
router.delete("/request/:requestId", async (req, res) => {
  const { requestId } = req.params;

  try {
    const requestRef = db.collection("friendRequests").doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    const { senderId, receiverId, status } = requestDoc.data();

    if (status !== "pending") {
      return res.status(400).json({ error: "Only pending requests can be canceled" });
    }

    // Remove the senderId from the receiver's pendingFriends array
    await db.collection("users").doc(receiverId).update({
      pendingFriends: admin.firestore.FieldValue.arrayRemove(senderId),
    });

    // Delete the friend request document
    await requestRef.delete();

    res.status(200).json({ message: "Friend request canceled successfully" });
  } catch (error) {
    console.error("Error canceling friend request:", error);
    res.status(500).json({ error: "Failed to cancel friend request" });
  }
});

router.get("/requests/check-status", async (req, res) => {
  const { senderId, receiverId } = req.query;

  try {
    const requestSnapshot = await db
      .collection("friendRequests")
      .where("senderId", "==", senderId)
      .where("receiverId", "==", receiverId)
      .limit(1)
      .get();

    if (requestSnapshot.empty) {
      return res.status(200).json({ status: "none" });
    }

    const requestData = requestSnapshot.docs[0].data();
    res.status(200).json({ status: requestData.status });
  } catch (error) {
    console.error("Error fetching request status:", error);
    res.status(500).json({ error: "Failed to fetch request status" });
  }
});

module.exports = router;