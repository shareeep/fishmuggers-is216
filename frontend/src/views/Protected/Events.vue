<template>
    <div class="home-container"> <!-- Use a wrapper for flex layout -->
      <Navbar />
      <main> <!-- Wrap content in a main tag -->
        <h1>EVENTS</h1>
        <h2>testing</h2>
      </main>
    </div>
  </template>
  
  <script setup>
  // Any Home page-specific logic
  import Navbar from '@/components/Protected/Navbar.vue';
  </script>
  
  <style scoped>
  .navbar {
    width: 250px; /* Width of the navbar */
    height: 100vh; /* Full height of the viewport */
  }
  .home-container {
    display: flex; /* Set flexbox layout for the container */
  }
  
  
  /* can change */
  main {
    flex-grow: 1; /* Allow main to take the remaining width */
    padding: 20px; /* Add padding for spacing */
    /* Optional styling */
    background-color: goldenrod; /* Example background color */
    overflow-y: auto; /* Allow scrolling if content overflows */
  }
  
  h1 {
    text-align: center; /* Center text in the main area */
  }
  </style>
  