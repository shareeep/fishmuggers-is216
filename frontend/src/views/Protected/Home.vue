<template>
  <div class="home-container"> <!-- Use a wrapper for flex layout -->
    <Navbar />
    <main id="scrollable-element"> <!-- Wrap content in a main tag -->
      <Petpost />
    </main>
    <!--Go to Add Post Page-->
    <router-link to="/addpost">
      <button class="floating-btn">🐾</button>
    </router-link>
  </div>
</template> 

<script setup>
// Any Home page-specific logic
import { ref, onMounted } from 'vue';

import Navbar from '@/components/Protected/Navbar.vue';
import Petpost from '@/components/Protected/PetPosts/Petpost.vue';
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
  overflow-y: auto;

}

.home-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
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

main {
  align-items: center;
  /* Center horizontally */
  margin-left: 250px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: #FCEFB4;
  height: 100vh;
  overflow: hidden;
}
/* Floating Button */
.floating-btn {
  position: fixed !important;
  bottom: 20px;
  right: 20px;
  background-color: gold;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 30px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.floating-btn:hover {
  background-color: rgb(238, 207, 30);
}
</style>
