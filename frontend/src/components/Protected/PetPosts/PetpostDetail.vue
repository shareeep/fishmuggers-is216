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
  props: ['postId'], // Accept referrer as a prop

  data() {
    return {
      post: null, // Initialize post as null
    };
  },
  async mounted() {
    try {
      console.log('Post id:', this.postId);
      const response = await axios.get(`https://fishmuggers-is216-express.onrender.com/api/posts/single/${this.postId}`);
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
        const response = await axios.post(`https://fishmuggers-is216-express.onrender.com/api/posts/${post.postId}/like`, { userId });

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
.feed-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 600px;
  padding: 20px;
}

.post {
  width: 100%;
  /* max-width: 500px; */
  /* Set a max-width to keep a consistent layout */
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  scroll-snap-align: center;
  scroll-behavior: smooth;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name {
  font-size: 16px;
  margin: 0;
}

.post-image {
  width: 100%;
  height: 450px;
  /* Set a fixed height for images */
  /* object-fit: cover; */
  /* Ensures image covers the area while maintaining aspect ratio */
}

.post-footer {
  padding: 10px;
}

.likes {
  font-weight: bold;
}

.menu-container {
  position: relative;
  align-items: center;
}

.menu-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
}

.menu {
  position: absolute;
  top: 30px;
  right: 0;
  background-color: white;
  border: 1px solid #dbdbdb;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  z-index: 1000;
}

.menu button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid #dbdbdb;
}

.menu button:last-child {
  border-bottom: none;
}

.menu button:hover {
  background-color: #f4f4f4;
}



.like-button {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  color: black;
  background: none;
  border: none;
  cursor: pointer;
}

.like-button:hover {
  transform: scale(1.05);
}

.like-button:active {
  transform: scale(0.98);
}

.thumbs-up-icon {
  color: grey;
  /* Outline color */
  transition: color 0.2s ease;
  cursor: pointer;
}

.fas.fa-thumbs-up {
  color: black;
  /* Filled color */
}
</style>