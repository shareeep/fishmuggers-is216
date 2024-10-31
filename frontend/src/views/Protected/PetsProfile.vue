<template>
  <div class="home-container">
    <Navbar />
    <router-link to="/profile" class="back-button">
      <img src="../../assets/images/back_arrow.png" alt="back" width="40px" />
    </router-link>
    <main id="scrollable-element">
      <PetsProfile />
    </main>
  </div>
</template>

<script setup>
// Any Home page-specific logic
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Protected/Navbar.vue';
import PetsProfile from '@/components/Protected/Profile/PetsProfile.vue';
import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
Scrollbar.use(OverscrollPlugin);

onMounted(() => {
  Scrollbar.init(document.querySelector('#scrollable-element'), {
    damping: 0.05,
    renderByPixels: true,
    alwaysShowTracks: false,
    continuousScrolling: true,
    plugins: {
      overscroll: {
        effect: 'bounce',
        damping: 0.2,
        maxOverscroll: 70,
      },
    },
  });
})
</script>

<style scoped>
#scrollable-element {
  width: 100%;
  height: 100%;
}

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
  display: flex;
  height: 100vh;
  overflow: hidden;
}

main {
  align-items: center;
  /* Center horizontally */
  margin-left: 250px;
  flex-grow: 1;
  display: flex;
  padding: 3%;
  flex-direction: column;
  gap: 5px;
  background-color: #FCEFB4;
  height: 100vh;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 280px;
  /* Adjust to appear beside the Navbar */
  z-index: 10;
  padding: 5px;
  transition: transform 0.2s ease;
}

.back-button:hover {
  transform: scale(1.1);
}
</style>
