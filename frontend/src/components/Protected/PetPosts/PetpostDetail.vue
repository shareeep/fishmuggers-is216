<template>
  <div class="post-detail-container">
    <div v-if="post" class="post">
      <div class="post-header">
        <div class="user-info" v-if="post.user">
          <img :src="post.user.avatar" alt="User Avatar" class="avatar" />
          <h3 class="user-name">{{ post.user.name }}</h3>
        </div>
      </div>
      <img :src="post.image" alt="Post Image" class="post-image" />
      <div class="post-footer">
        <p>{{ post.caption }}</p>
        <p class="likes">{{ post.likes ? post.likes.length : 0 }} likes</p>
        <button @click="likePost(post)" class="like-button">
          <i :class="post.hasLiked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'"></i> Like
        </button>
      </div>
    </div>
    <div v-else>
      <p>Loading post...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getAuth } from "firebase/auth"; // Use getAuth directly here

export default {
  props: ['postId'],
  data() {
    return {
      post: null, // Initialize post as null
    };
  },
  async mounted() {
    try {
      console.log('Post id:', this.postId);
      const response = await axios.get(`http://localhost:3000/api/posts/single/${this.postId}`);
      this.post = response.data;
    } catch (error) {
      console.error("Failed to load post:", error);
    }
  },
  methods: {
  async likePost(post) {
    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (!userId) {
      alert("Please log in to like posts.");
      return;
    }

    try {
      // Send the like request to the backend
      const response = await axios.post(`http://localhost:3000/api/posts/${post.postId}/like`, { userId });

      // If the post was liked successfully, update the local post state
      if (response.status === 200) {
        post.hasLiked = !post.hasLiked; // Toggle like state
        if (post.hasLiked) {
          post.likes.push(userId); // Add userId to likes if liked
        } else {
          post.likes = post.likes.filter(id => id !== userId); // Remove userId from likes if unliked
        }
      }
    } catch (error) {
      console.error("Failed to like post:", error);
      alert("Failed to like post.");
    }
  },
}
};
</script>

<style scoped>
/* Basic styling similar to your feed */
.post-detail-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}
.post {
  width: 100%;
  max-width: 600px;
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  background-color: #fff;
  padding: 10px;
}
</style>
