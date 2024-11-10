<template>

  <div class="add-post-container">
    <h2>Add a New Pet Post</h2>
    <form @submit.prevent="submitPost">
      <div class="form-group">
        <label for="image">Upload Image:</label>
        <input type="file" @change="handleFileUpload" accept="image/*" required />
      </div>

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
import axios from "axios";
import { auth } from "../../../../firebase"; // Import Firebase auth

export default {
  data() {
    return {
      newPost: {
        image: "",
        caption: "",
      },
      imageFile: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        this.previewImage(file);
      }
    },
    previewImage(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newPost.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async submitPost() {
      if (!this.imageFile || !this.newPost.caption) {
        alert("Please provide a caption and upload an image.");
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("caption", this.newPost.caption);
      formData.append("image", this.imageFile);

      try {
        // Get the ID token of the authenticated user
        const currentUser = auth.currentUser;
        if (!currentUser) {
          alert("User is not authenticated");
          return;
        }

        const token = await currentUser.getIdToken();

        // Send request to backend
        await axios.post("https://fishmuggers-is216-express.onrender.com/api/posts/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        this.$router.push("/"); // Redirect after submission
      } catch {
        alert("Failed to upload post.");
      }
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
  color: black;
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
