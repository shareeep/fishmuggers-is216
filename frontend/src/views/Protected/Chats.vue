<template>
    <div class="home-container"> <!-- Use a wrapper for flex layout -->
      <Navbar /> <!-- Sidebar Navbar -->
      <main> <!-- Wrap content in a main tag -->
        <!-- Add the Allchats component here -->
        <Allchats />
      </main>
    </div>
  </template>
  
  <script setup>
  // Import Navbar and Allchats components
  import Navbar from '@/components/Protected/Navbar.vue';
  import Allchats from '@/components/Protected/Allchats.vue';
  </script>
  
  <style scoped>
  .navbar {
    width: 250px; /* Width of the navbar */
    height: 100vh; /* Full height of the viewport */
  }
  .home-container {
    display: flex; /* Set flexbox layout for the container */
  }
  /* Adjust the main layout to allow it to take the remaining space */
  main {
    flex-grow: 1; /* Allow main to take the remaining width */
    
    background-color: goldenrod; /* Example background color */
    overflow-y: auto; /* Allow scrolling if content overflows */
  }
  h1 {
    text-align: center; /* Center text in the main area */
  }
  </style>