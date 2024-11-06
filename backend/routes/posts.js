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
        likes: 0,
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


module.exports = router;
