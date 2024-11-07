<template>
  <div class="home-container">
    <Navbar />
    <router-link to="/profile" class="back-button">
      <img src="../../assets/images/back_arrow.png" alt="back" width="40px" />
    </router-link>
    <main id="scrollable-element">
      <ProfileUpdate />
    </main>
  </div>
</template>

<script setup>
// Any Home page-specific logic
import { ref, onMounted } from 'vue';

import Navbar from '@/components/Protected/Navbar.vue';
import ProfileUpdate from '@/components/Protected/Profile/ProfileUpdate.vue';
import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
Scrollbar.use(OverscrollPlugin);

onMounted(() => {
  const scrollbar = Scrollbar.init(document.querySelector('#scrollable-element'), {
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

  // Hide the scrollbar track by setting its opacity to 0
  scrollbar.track.xAxis.element.style.opacity = '0';
  scrollbar.track.yAxis.element.style.opacity = '0';
});
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.navbar {
  width: 250px;
  height: 100vh;
  position: fixed;
}

main {
  align-items: center;
  margin-left: 250px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: #FCEFB4;
  height: 100vh;
  overflow: scroll;
  padding: 20px;
  box-sizing: border-box;
}

#scrollable-element {
  width: 100%;
  height: 100%;
  overflow-y: scroll;

}

.heading {
  font-size: 2rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
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

/* Responsive Adjustments */
@media (max-width: 991px) {
  .back-button {
    position:fixed;
    top: 15px;
    left: 95px;
  }
  .navbar {
    width: 80px;
    position: fixed
  }

  main {
    margin-left: 80px;
    padding: 15px;
  }
}

@media (max-width: 767px) {
  .back-button {
    position:fixed;
    top: 15px;
    left: 0px;
  }
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
    padding-top:30px;
    padding-bottom:75px;
    height: calc(100vh - 50px);
    overflow-y: auto;
  }

  .friends-container {
    flex-direction: column;
    align-items: center;
  }

  .heading {
    font-size: 1.5rem;
  }
}

</style>
