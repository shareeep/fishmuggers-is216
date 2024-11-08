<template>
  <router-link to="/" class="back-button">
    <img src="../../assets/images/back_arrow.png" alt="back" width="40px" @click="goBack" />
  </router-link>
  <div class="add-post-container">
    <h2>Add a New Pet Post</h2>
    <form @submit.prevent="submitPost">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" v-model="newPost.name" placeholder="Enter your name" required />
      </div>

      <div class="form-group">
        <label for="image">Upload Image:</label>
        <input type="file" @change="handleFileUpload" accept="image/*" required />
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
      imageFile: null, // Hold the selected image file
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        // You can use a service like Firebase, AWS S3, or your own backend to handle image uploading
        // For example, you can upload the file here and get the URL to store in this.newPost.image
        this.uploadImage(file);
      }
    },
    uploadImage(file) {
      // Example logic for image upload (e.g., using Firebase, AWS S3, or a custom API)
      // Once the image is uploaded, set the image URL in newPost.image
      // For now, assume a placeholder URL after uploading
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newPost.image = e.target.result; // For now, using base64 data URL
      };
      reader.readAsDataURL(file);
    },
    submitPost() {
      if (!this.imageFile) {
        alert('Please upload an image.');
        return;
      }
      // Your submit logic to handle the new post (e.g., send to API)
      console.log('Post submitted:', this.newPost);
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
