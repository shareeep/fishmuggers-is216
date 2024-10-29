<template>
  <div class="home-container">
    <Navbar />
    <main>
      <ProfileMain />
      <PetsProfile />
    </main>
  </div>
</template>

<script setup>
// Any Home page-specific logic
import Navbar from '@/components/Protected/Navbar.vue';
import PetsProfile from '@/components/Protected/Profile/PetsProfile.vue';
</script>

<style scoped>
.navbar {
  width: 250px; /* Width of the navbar */
  height: 100vh; /* Full height of the viewport */
  position: sticky; /* Make the navbar sticky */
  top: 0; /* Stick to the top of the page */
}
.home-container {
  display: flex; /* Set flexbox layout for the container */
}


/* can change */
main {
  flex-grow: 1; /* Allow main to take the remaining width */
  padding: 20px; /* Add padding for spacing */
  /* Optional styling */
  background-color: #FCEFB4; /* Example background color */
  overflow-y: auto; /* Allow scrolling if content overflows */
}
</style>
