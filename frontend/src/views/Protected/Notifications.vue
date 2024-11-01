<template>
  <div class="home-container"> <!-- Use a wrapper for flex layout -->
    <Navbar />
    <main> <!-- Wrap content in a main tag -->
      <Notifs /> <!-- Include the Notifications component -->
    </main>
  </div>
</template>

<script setup>
// Any Home page-specific logic
import Navbar from '@/components/Protected/Navbar.vue';
import Notifs from '@/components/Protected/Notifications.vue';
</script>

<style scoped>
.navbar {
  width: 250px;
  height: 100vh;
  position: fixed;
}

.home-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

main {
  align-items: center;
  margin-left: 250px;
  flex-grow: 1;
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
    height: calc(100vh - 50px);
    overflow-y: auto;
  }
}
</style>