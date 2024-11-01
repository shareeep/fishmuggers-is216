<template>
  <div class="home-container">
    <Navbar />
    <main>
      <div>
        sample
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Protected/Navbar.vue';
</script>

<style scoped>
/* Main container for layout */
.home-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Navbar styling for large and medium screens */
.navbar {
  width: 250px;
  height: 100vh;
}

/* Main content area */
main {
  flex-grow: 1;
  padding: 5%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: #FCEFB4;
  overflow: auto;
}

/* Ensure main content elements are responsive */
main > * {
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  gap: 10px;
}

/* Responsive Adjustments */

/* Medium screens - reduce width of navbar */
@media (max-width: 991px) and (min-width: 768px) {
  .navbar {
    width: 80px;
  }

  .home-container {
    display: flex;
  }
}

/* Small screens - navbar moves to the bottom, main content fills height */
@media (max-width: 767px) {
  .home-container {
    flex-direction: column;
  }

  .navbar {
    width: 100%;
    height: auto;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1; /* Ensure navbar is on top */
  }

  main {
    flex-grow: 1;
    padding-bottom: 60px; /* Space for the bottom navbar */
    overflow-y: auto; /* Allow scrolling if needed */
  }
}
</style>
