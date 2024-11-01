<template>
  <div class="feed-container">
    <div v-for="post in posts" :key="post.postId" class="post">
      <div class="post-header">
        <div class="user-info">
          <img :src="post.user.avatar" alt="User Avatar" class="avatar" />
          <h3 class="user-name">{{ post.user.name }}</h3>
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
        <button @click="likePost(post)" class="like-button"><i
            :class="post.hasLiked ? 'fas fa-thumbs-up thumbs-up-icon' : 'far fa-thumbs-up thumbs-up-icon'"></i>Like</button>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import { auth } from "../../../../firebase"; // Firebase auth for user ID

export default {
  data() {
    return {
      activeMenu: null,
      posts: [],
    };
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get("http://localhost:3000/api/posts/feed");

        // Add `hasLiked` for each post based on if the current user has liked it
        const userId = auth.currentUser ? auth.currentUser.uid : null;
        this.posts = response.data.map(post => ({
          ...post,
          hasLiked: post.likes && post.likes.includes(userId),
        }));
      } catch (error) {
        console.error("Failed to load posts:", error);
        alert("Failed to load posts.");
      }
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
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (!userId) {
        alert("Please log in to like posts.");
        return;
      }

      const hasLiked = post.hasLiked;

      // Optimistically toggle `hasLiked` on the frontend
      post.hasLiked = !hasLiked;
      if (hasLiked) {
        post.likes = post.likes.filter(id => id !== userId);
      } else {
        post.likes = post.likes ? [...post.likes, userId] : [userId];
      }

      try {
        // Update the like state in the backend
        const token = await auth.currentUser.getIdToken();
        await axios.post(
          `http://localhost:3000/api/posts/${post.postId}/like`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error toggling like:", error);
        alert("Failed to toggle like. Please try again.");

        // Rollback the optimistic update on error
        post.hasLiked = hasLiked;
        if (hasLiked) {
          post.likes.push(userId);
        } else {
          post.likes = post.likes.filter(id => id !== userId);
        }
      }
    },
  },
  mounted() {
    this.fetchPosts();
  },
};

</script>



<style scoped>
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
