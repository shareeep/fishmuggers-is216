<template>
  <div class="home-container"> <!-- Use a wrapper for flex layout -->
    <Navbar />
    <main> <!-- Wrap content in a main tag -->
      <PetpostAdd />
    </main>
  </div>
</template>

<script setup>
// Any Home page-specific logic
import Navbar from '@/components/Protected/Navbar.vue';
import PetpostAdd from '@/components/Protected/PetPostAdd.vue';
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
