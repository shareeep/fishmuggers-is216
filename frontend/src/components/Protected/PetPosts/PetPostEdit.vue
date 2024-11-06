<template>
  <router-link to="/" class="back-button">
    <img src="../../../assets/images/back_arrow.png" alt="back" width="40px" />
  </router-link>
  <div class="edit-post-container">
    <h2>Edit Pet Post</h2>
    <form @submit.prevent="submitPost">
      
      <!-- User name input (for testing, can be removed if not necessary) -->
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" v-model="editedPost.name" placeholder="User Details (for test)" required /> 
      </div>

      <div class="form-group">
        <label for="image">Upload Image:</label>
        <input type="file" @change="handleFileUpload" accept="image/*" />
      </div>

      <!-- Display the image preview if available -->
      <div v-if="editedPost.image" class="image-preview">
        <img :src="editedPost.image" alt="Image Preview" />
      </div>

      <div class="form-group">
        <label for="caption">Caption:</label>
        <input type="text" v-model="editedPost.caption" placeholder="Write a caption" required />
      </div>

      <button type="submit" class="submit-btn">Update Post</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    postId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editedPost: {
        // Change to correct variables after backend is done
        name: '',
        image: '',
        caption: '',
      },
      imageFile: null, // Holds the selected image file
    };
  },
  created() {
    // Fetch the existing post data using postId and populate editedPost
    this.fetchPostData(this.postId);
  },
  methods: {
    fetchPostData(postId) {
      // Replace with actual API call or data-fetching logic
      // Simulating an API response for the example
      const postData = {
        name: 'User Test',
        image: 'https://via.placeholder.com/600',
        caption: 'Original caption of the post',
      };
      this.editedPost = { ...postData };
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        this.uploadImage(file);
      }
    },
    uploadImage(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.editedPost.image = e.target.result; // Set image URL for preview
      };
      reader.readAsDataURL(file);
    },
    submitPost() {
      // Ensure an image is uploaded or the original image URL is retained
      if (!this.editedPost.image) {
        alert('Please upload an image.');
        return;
      }

      // Perform the update logic (e.g., API call to update the post)
      console.log('Post updated:', this.editedPost);

      // Redirect to homepage after updating the post
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 20px;
  font-weight: bold;
  color: rgb(46, 46, 46);
  text-align: center;
}

.edit-post-container {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  box-sizing: border-box;
}

.image-preview {
  margin-top: 15px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.submit-btn {
  background-color: gold;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:hover {
  background-color: rgb(238, 207, 30);
}
</style>
