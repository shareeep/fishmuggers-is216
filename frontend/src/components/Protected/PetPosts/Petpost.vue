<template>
  <div class="feed-container">
    <!-- Show "Loading..." text with animation when loading is true -->
    <div v-if="loading" class="loading-container">
      <p class="loading-text">
        <img src="../../../assets/images/loading1.gif" alt="Loading" class="loadinggif" />
        Loading posts<span class="dots"></span>
      </p>
    </div>
    <div v-else>
      <div v-for="post in posts" :key="post.postId" class="post">
        <div class="post-header">
          <div class="user-info">
            <img :src="post.user.avatar" alt="User Avatar" class="avatar" />
            <h3 class="user-name">
              <a :href="`/friendprofile/${post.user.uid}`">{{ post.user.name }}</a>
            </h3>
          </div>
          <div class="menu-container">
            <button @click="toggleMenu(post.postId)" class="menu-btn" hidden>•••</button>
            <div v-if="post.postId === activeMenu" class="menu">
              <button @click="editPost(post)">Edit</button>
              <button @click="deletePost(post.postId)">Delete</button>
            </div>
          </div>
        </div>
        <img :src="post.image" alt="Post Image" class="post-image" />
        <div class="post-footer">
          <p>{{ post.caption }}</p>
          <p class="likes">{{ post.likes ? post.likes.length : 0 }} likes</p>

          <!-- Like Button -->
          <button @click="likePost(post)" class="like-button" style="display: inline-block; margin-right: 10px;">
            <i :class="post.hasLiked ? 'fas fa-thumbs-up thumbs-up-icon' : 'far fa-thumbs-up thumbs-up-icon'"></i> Like
          </button>

          <!-- Share Button -->
          <button @click="openSharePopup(post)" class="like-button" style="display: inline-block;">
            <i class="fas fa-share"></i> Share
          </button>

        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { getAuth } from "firebase/auth"; // Use getAuth directly here
import api from '@/services/api';

// import HomeSharePopup from './PetpostShare.vue';

export default {
  data() {
    return {
      activeMenu: null,
      posts: [],
      friends: [],
      userId: null,
      loading: true,
    };
  },
  methods: {
    async fetchPosts() {
      this.loading = true;
      const auth = getAuth();
      const userId = auth.currentUser ? auth.currentUser.uid : null;

      try {
        const response = await api.get("/api/posts/feed");
        this.posts = response.data.map(post => ({
          ...post,
          hasLiked: post.likes && post.likes.includes(userId),
          showPopup: false,
        }));
        this.userId = userId;
      } catch (error) {
        console.error("Failed to load posts:", error);
        alert("Failed to load posts.");
      } finally {
        this.loading = false;
      }
    },
    openSharePopup(post) {
      if (!this.userId) {
        alert("Please log in to share posts.");
        return;
      }
      // Emit the post data to trigger popup in Home.vue
      this.$emit('trigger-share-popup', post);
    },
    toggleMenu(postId) {
      this.activeMenu = this.activeMenu === postId ? null : postId;
    },
    editPost(post) {
      this.$router.push("/editpost");
    },
    deletePost(postId) {
      this.posts = this.posts.filter(post => post.postId !== postId);
    },

    async likePost(post) {
      const auth = getAuth();
      const userId = auth.currentUser ? auth.currentUser.uid : null;

      if (!userId) {
        alert("Please log in to like posts.");
        return;
      }

      try {
        // Send the like request to the backend
        const response = await api.post(`/api/posts/${post.postId}/like`, { userId });

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

  },
  mounted() {
    const auth = getAuth();
    this.userId = auth.currentUser ? auth.currentUser.uid : null;
    this.fetchPosts();
  },
};
</script>


<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  /* Ensures it takes full height of the viewport */
}

.loading-text {
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 10px;
}

.loadinggif {
  margin-right: -30px;
  width: 200px;
  /* Adjust the width as desired */
}

.dots::after {
  content: '';
  display: inline-block;
  width: 1em;
  animation: ellipsis 1.5s infinite;
}

@keyframes ellipsis {
  0% {
    content: '';
  }

  33% {
    content: '.';
  }

  66% {
    content: '..';
  }

  100% {
    content: '...';
  }
}

.feed-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 600px;
  padding: 20px;
}

.post {
  width: 100%;
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
  height: auto;
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
