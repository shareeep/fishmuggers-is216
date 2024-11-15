// routes/posts.js
const express = require("express");
const router = express.Router();
const { db, bucket, admin } = require("../services/firebase");
const upload = require("../middleware/upload"); // Ensure your multer middleware is here
const authenticate = require("../middleware/auth"); // Ensure your authentication middleware is here

// Route to upload a new post
router.post("/upload", authenticate, upload.single("image"), async (req, res) => {
  const { caption } = req.body;

  if (!req.file || !caption) {
    return res.status(400).json({ error: "Missing required fields: image and caption" });
  }

  try {
    // Set up a reference to Firebase Storage
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(`eventImages/${fileName}`);

    // Upload the image file to Firebase Storage
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("finish", async () => {
      // Make the file publicly accessible
      await file.makePublic();

      // Get the public URL for the image
      const imageUrl = file.publicUrl();

      // Save post details in Firestore
      const newPost = {
        caption,
        image: imageUrl,
        userId: req.user.uid, // From the authenticated user
        userName: req.user.name || "", // Optional, you can fetch the username if available
        createdAt: new Date(),
        likes: [],
      };

      const postRef = await db.collection("posts").add(newPost);

      res.status(200).json({
        message: "Post uploaded successfully!",
        postId: postRef.id,
        imageUrl,
      });
    });

    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload post" });
  }
});

// Route to fetch all posts
router.get("/feed", async (req, res) => {
  console.log("Feed endpoint called");

  try {
    // Fetch all posts from the 'posts' collection, ordered by createdAt descending
    console.log("Fetching posts from Firestore...");
    const postsSnapshot = await db.collection("posts")
      .orderBy("createdAt", "desc") // Add orderBy clause here
      .get();

    // Check if there are any posts
    if (postsSnapshot.empty) {
      console.log("No posts found");
      return res.status(200).json([]);
    }

    const posts = [];
    for (const doc of postsSnapshot.docs) {
      const postData = doc.data();
      console.log(`Processing post with ID: ${doc.id}`);

      // Fetch user details for each post's userId
      const userSnapshot = await db.collection("users").doc(postData.userId).get();
      
      if (!userSnapshot.exists) {
        console.log(`User with ID ${postData.userId} not found`);
        continue; // Skip this post if user not found
      }

      const userData = userSnapshot.data();
      const post = {
        postId: doc.id,
        ...postData,
        user: {
          uid: postData.userId,
          name: userData.username || "Unknown User",
          avatar: userData.profileImage || "https://via.placeholder.com/50",
        },
      };
      posts.push(post);
    }

    console.log(`Successfully retrieved ${posts.length} posts`);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
});




router.post("/:postId/like", authenticate, async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  console.log("Received request to like post:", postId);
  console.log("User ID:", userId);

  if (!userId) {
    console.warn("User ID not provided");
    return res.status(400).json({ error: "User ID is required to like a post." });
  }

  try {
    const postRef = db.collection("posts").doc(postId);
    console.log("Updating likes array in Firestore for post:", postId);

    // Use arrayUnion to add userId to likes if not already present
    await postRef.update({
      likes: admin.firestore.FieldValue.arrayUnion(userId),
    });

    console.log("Post liked successfully!");
    res.status(200).json({ message: "Post liked successfully!" });
  } catch (error) {
    console.error("Error updating likes array in Firestore:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
});

// Route to share a post with a friend
router.post("/:postId/share", authenticate, async (req, res) => {
  const { postId } = req.params;
  const { receiverUid, messageText } = req.body;

  if (!receiverUid || !messageText) {
    return res.status(400).json({ error: "Missing required fields: receiverUid and messageText" });
  }

  try {
    const senderUid = req.user.uid; // Get the sender's UID from the authenticated user

    // Save the share message in the 'messages' collection or as a sub-collection
    const messageData = {
      senderUid,
      receiverUid,
      postId,
      messageText,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("messages").add(messageData);

    res.status(200).json({ message: "Post shared successfully!" });
  } catch (error) {
    console.error("Error sharing post:", error);
    res.status(500).json({ error: "Failed to share post" });
  }
});

// Route to fetch all posts by a specific user ID
router.get("/user/:uid/posts", async (req, res) => {
  const { uid } = req.params;

  if (!uid) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const postsSnapshot = await db.collection("posts")
      .where("userId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const posts = postsSnapshot.docs.map(doc => ({
      postId: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error retrieving posts for user:", error);
    res.status(500).json({ error: "Failed to retrieve posts for user" });
  }
});



// Route to fetch a single post by its ID
router.get("/single/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    console.log("Fetching post with ID:", postId);
    
    // Fetch post from Firestore
    const postDoc = await db.collection("posts").doc(postId).get();
    
    if (!postDoc.exists) {
      console.log("Post not found");
      return res.status(404).json({ error: "Post not found" });
    }
    
    const postData = postDoc.data();
    
    // Fetch user details for the post
    const userSnapshot = await db.collection("users").doc(postData.userId).get();
    
    if (!userSnapshot.exists) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    
    const userData = userSnapshot.data();
    const post = {
      postId: postDoc.id,
      ...postData,
      user: {
        uid: postData.userId,
        name: userData.username || "Unknown User",
        avatar: userData.profileImage || "https://via.placeholder.com/50",
      },
    };
    
    console.log("Post retrieved successfully");
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to retrieve post" });
  }
});

// Route to delete all posts for a specific userId without authentication
router.delete("/deleteUserPosts/:userId", async (req, res) => {
  const { userId } = req.params;

  // Ensure userId is provided
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const batchSize = 500; // Firestore batch limit
    let totalDeleted = 0;

    // Define the query to select posts by the user
    const query = db.collection("posts").where("userId", "==", userId);

    // Function to delete documents in batches
    async function deletePostsBatch(query) {
      const snapshot = await query.limit(batchSize).get();

      // If there are no documents, we're done
      if (snapshot.size === 0) {
        return;
      }

      // Begin a new batch
      const batch = db.batch();

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Commit the batch
      await batch.commit();

      totalDeleted += snapshot.size;
      console.log(`Deleted ${snapshot.size} posts. Total deleted: ${totalDeleted}`);

      // Recurse to delete the next batch
      await deletePostsBatch(query);
    }

    // Start the deletion process
    await deletePostsBatch(query);

    res.status(200).json({ message: `Successfully deleted ${totalDeleted} posts for user ${userId}` });
  } catch (error) {
    console.error("Error deleting posts:", error);
    res.status(500).json({ error: "Failed to delete posts" });
  }
});

module.exports = router;
