<template>
  <router-link to="/" class="back-button"> 
    <img src="../../../assets/images/back_arrow.png" alt="back" width="40px" />
  </router-link>
  <div class="add-post-container">
    <h2>Add a New Pet Post</h2>
    <form @submit.prevent="submitPost">
      
      <!-- Placeholder for testing user data (can be removed later) -->
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" v-model="newPost.name" placeholder="User Details (for test)" required /> 
      </div>

      <div class="form-group">
        <label for="image">Upload Image:</label>
        <input type="file" @change="handleFileUpload" accept="image/*" required />
      </div>

      <!-- Display the image preview if available -->
      <div v-if="newPost.image" class="image-preview">
        <img :src="newPost.image" alt="Image Preview" />
      </div>

      <div class="form-group">
        <label for="caption">Caption:</label>
        <input type="text" v-model="newPost.caption" placeholder="Write a caption" required />
      </div>

      <button type="submit" class="submit-btn">Post</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newPost: {
        name: '',
        image: '',
        caption: '',
      },
      imageFile: null, // Holds the selected image file
    };
  },
  methods: {
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
        this.newPost.image = e.target.result; // Set image URL for preview
      };
      reader.readAsDataURL(file);
    },
    submitPost() {
      if (!this.imageFile) {
        alert('Please upload an image.');
        return;
      }
      // Submit the new post (e.g., send to an API or save to store)
      console.log('Post submitted:', this.newPost);

      // Redirect user to homepage after submission
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

.add-post-container {
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
input[type="url"],
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
