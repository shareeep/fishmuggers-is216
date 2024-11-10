<template>
  <div class="home-container"> <!-- Use a wrapper for flex layout -->
    <Navbar />
    <main> <!-- Wrap content in a main tag -->
      <router-link to="/chats" class="back-button">
        <img src="../../assets/images/back_arrow.png" alt="back" width="40px" />
      </router-link>
      <PetpostDetail :postId="postId" />
    </main>
  </div>
</template>

<script setup>
// Any Home page-specific logic
import { useRoute } from 'vue-router';  // Import useRouter
import { onMounted, ref } from 'vue';
import api from '@/services/api';
import Navbar from '@/components/Protected/Navbar.vue';
import PetpostDetail from '@/components/Protected/PetPosts/PetpostDetail.vue';

const route = useRoute();
const postId = route.params.postId;

</script>

<style scoped>
/* Back Button Styling */
.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s ease;
}

.back-button:hover {
  transform: scale(1.1);
}

.home-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.navbar {
  width: 250px;
  height: 100vh;
  position: fixed;
}

main {
  position: relative;
  align-items: center;
  margin-left: 250px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: #FCEFB4;
  height: 100vh;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}

/* Responsive Adjustments */
@media (max-width: 991px) {
  .navbar {
    width: 80px;
  }

  main {
    margin-left: 80px;
    padding: 15px;
  }
}

@media (max-width: 767px) {
  .home-container {
    flex-direction: column;
  }

  .navbar {
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #f9f9f9;
    z-index: 10;
  }

  main {
    margin-left: 0;
    margin-top: 0;
    padding: 15px;
    margin-top: 15px;
    margin-bottom: 35px;
    height: calc(100vh - 50px);
    /* Account for navbar height on mobile */
    overflow-y: auto;
  }

  .floating-btn {
    bottom: 60px;
    /* Place above mobile navbar */
    right: 20px;
    width: 50px;
    height: 50px;
    font-size: 30px;
  }
}
</style>
