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

export default {
  props: ['postId'],
  data() {
    return {
      post: [],
    };
  },
  async mounted() {
    try {
      const response = await axios.get(`http://localhost:3000/api/posts/${this.postId}`);
      this.post = response.data;
    } catch (error) {
      console.error("Failed to load post:", error);
    }
  },
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
