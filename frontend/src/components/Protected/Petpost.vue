<template>
    <div class="feed-container">
        <div v-for="post in posts" :key="post.id" class="post">
            <div class="post-header">
                <img :src="post.user.avatar" alt="User Avatar" class="avatar" />
                <h3>{{ post.user.name }}</h3>
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
        align-items: center;
        padding: 10px;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
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
</style>