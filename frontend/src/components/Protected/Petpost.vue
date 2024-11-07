<template>
  <div class="feed-container">
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="post-header">
        <div class="user-info">
          <img :src="post.user.avatar" alt="User Avatar" class="avatar" />
          <h3 class="user-name">{{ post.user.name }}</h3>
        </div>
        <div class="menu-container">
          <button @click="toggleMenu(post.id)" class="menu-btn">...</button> <!-- Horizontal three dots -->
          <div v-if="post.id === activeMenu" class="menu">
            <button @click="editPost(post)">Edit</button>
            <button @click="deletePost(post.id)">Delete</button>
          </div>
        </div>
      </div>
      <img :src="post.image" alt="Post Image" class="post-image" />
      <div class="post-footer">
        <p>{{ post.caption }}</p>
        <p class="likes">{{ post.likes }} likes</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: null, // Track which post has the menu open
      posts: [
        {
          id: 1,
          user: {
            name: 'User 1',
            avatar: 'https://via.placeholder.com/50',
          },
          image: 'https://via.placeholder.com/600',
          caption: 'Loving my pet!',
          likes: 150,
        },
        {
          id: 2,
          user: {
            name: 'User 2',
            avatar: 'https://via.placeholder.com/50',
          },
          image: 'https://via.placeholder.com/600',
          caption: 'Such a cute moment!',
          likes: 200,
        },
        // Add more posts here
      ],
    };
  },
  methods: {
    toggleMenu(postId) {
      this.activeMenu = this.activeMenu === postId ? null : postId;
    },
    editPost(post) {
      // Logic for editing the post
      console.log('Editing post:', post);
    },
    deletePost(postId) {
      // Logic for deleting the post
      console.log('Deleting post:', postId);
      this.posts = this.posts.filter(post => post.id !== postId);
    },
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
</style>
