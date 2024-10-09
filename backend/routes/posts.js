const express = require("express");
const router = express.Router();
const { db } = require("../services/firebase"); // Import Firestore instance
const admin = require("firebase-admin"); // Import Firebase Admin SDK

// --------------------
// Routes
// --------------------

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get("/", async (req, res) => {
  try {
    const postsSnapshot = await db.collection("posts").get();
    const posts = [];
    postsSnapshot.forEach((doc) => {
      posts.push({ postId: doc.id, ...doc.data() });
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// @route   GET /api/posts/user/:userId
// @desc    Get all posts by a specific userId
// @access  Public
router.get("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const postsSnapshot = await db.collection("posts").where("userId", "==", userId).get();
      
      if (postsSnapshot.empty) {
        return res.status(404).json({ message: "No posts found for this user." });
      }
  
      const posts = [];
      postsSnapshot.forEach((doc) => {
        posts.push({ postId: doc.id, ...doc.data() });
      });
  
      res.status(200).json(posts);
    } catch (error) {
      console.error(`Error fetching posts for userId ${userId}:`, error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
});
  

// @route   POST /api/posts
// @desc    Create a new post
// @access  Public
router.post("/", async (req, res) => {
    const { userId, caption } = req.body;
  
    if (!userId || !caption) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const postRef = db.collection("posts").doc(); // Auto-generate a unique document ID
      const postId = postRef.id; // Get the auto-generated ID
  
      const newPost = {
        userId,
        postId,
        caption,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
  
      await postRef.set(newPost);
  
      console.log(`New post added with ID: ${postId}`);
      res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
});

// @route   PUT /api/posts/:id
// @desc    Update an existing post by ID
// @access  Public
router.put("/:id", async (req, res) => {
  const postId = req.params.id;
  const { caption } = req.body;

  if (!caption) {
    return res.status(400).json({ error: "Missing caption field" });
  }

  try {
    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    await postRef.update({
      caption,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error(`Error updating post with ID ${postId}:`, error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post by ID
// @access  Public
router.delete("/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    await postRef.delete();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(`Error deleting post with ID ${postId}:`, error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;