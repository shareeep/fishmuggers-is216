<template>
  <div class="home-container">
    <Navbar />
    <main>
      <div>
        <UserProfile :userId="userId" :username="username" :avatar="avatar" />
      </div>
    </main>
  </div>
</template>
 
<script setup>
import { useRoute } from 'vue-router';
import Navbar from '@/components/Protected/Navbar.vue';
import UserProfile from '@/components/Protected/Profile/UserProfile.vue';

const route = useRoute();
const userId = route.params.id;
console.log('userId:', userId);

const username = route.query.username;
console.log('username:', username);

const avatar = route.query.avatar;
console.log('avatar:', avatar);
</script>

<style scoped>
.navbar {
  width: 250px;
  /* Width of the navbar */
  height: 100vh;
  /* Full height of the viewport */
}

.home-container {
  display: flex;
  /* Set flexbox layout for the container */
  height: 100vh;
  /* Full height of the viewport */
  overflow: hidden;
  /* Prevent overflow */
}

main {
  align-items: center;
  /* Center components horizontally */
  flex-grow: 1;
  padding: 5%;
  display: flex;
  flex-direction: column;
  /* Stack children vertically */
  gap: 5px;
  /* Add spacing between the components */
  background-color: #FCEFB4;
  overflow: scroll;
  /* Prevent scrolling */
}

main>* {
  flex: 0 1 auto;
  /* Ensure components don't grow disproportionately */
  display: flex;
  flex-direction: column;
  /* Stack headers and content vertically */
  box-sizing: border-box;
  /* Ensure padding and borders are included in the width/height calculations */
  width: 100%;
  /* Take full width of the container */
  gap: 10px;
  /* Add spacing between header and content */
}
</style>