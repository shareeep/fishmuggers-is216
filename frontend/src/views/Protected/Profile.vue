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
import ProfileMain from '@/components/Protected/Profile/ProfileMain.vue';
</script>

<style scoped>
.navbar {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #ffffff;
  z-index: 1;
}

.home-container {
  display: flex; /* Set flexbox layout for the container */
}

/* can change */
main {
  align-items: center;
  margin-left: 250px;

  flex-grow: 1; /* Allow main to take the remaining width */
  padding: 20px; /* Add padding for spacing */
  /* Optional styling */
  background-color: #FCEFB4; /* Example background color */
  overflow-y: auto; /* Allow scrolling if content overflows */
}
</style>
