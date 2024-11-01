<template>
  <div class="home-container"> <!-- Wrapper for flex layout -->
    <Navbar /> <!-- Sidebar Navbar -->
    <main> <!-- Main content area -->
      <Allchats /> <!-- Allchats component -->
    </main>
  </div>
</template>

<script setup>
// Import Navbar and Allchats components
import Navbar from '@/components/Protected/Navbar.vue';
import Allchats from '@/components/Protected/Chats/Allchats.vue';
</script>

<style scoped>
/* Main container layout */
.home-container {
  display: flex;
  height: 100vh; /* Full viewport height */
  overflow: hidden; /* Prevent unwanted overflow */
}

/* Navbar styling for desktop and larger screens */
.navbar {
  width: 250px; /* Sidebar width */
  height: 100vh; /* Full height */
}

/* Main content area */
main {
  flex-grow: 1; /* Take remaining space */
  overflow-y: auto; /* Allow scrolling if content overflows */
}

/* Responsive Adjustments */
@media (max-width: 991px) {
  .navbar {
    width: 80px; /* Narrower sidebar for md screens */
  }
}

@media (max-width: 767px) {
  .home-container {
    flex-direction: column; /* Stack navbar and main vertically */
  }

  .navbar {
    width: 100%;
    height: 50px; /* Adjusted height for bottom navbar */
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #f9f9f9;
    z-index: 10; /* Ensure navbar is above content */
  }

  main {
    flex-grow: 1;
    overflow-y: auto; /* Allow main to scroll if content overflows */
  }
}
</style>
