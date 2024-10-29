<template>
  <div class="home-container">
    <Navbar />
    <main id="scrollable-element">
      <h1 class="heading">Connect with Friends</h1>
      <SearchBar />
      <div style="align-items: center;">
        <FriendRequests />
        <FriendsList />
        <RequestsSent />
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Protected/Navbar.vue';
import SearchBar from '@/components/Protected/Friends/Searchbar.vue';
import FriendRequests from '@/components/Protected/Friends/FriendRequests.vue';
import FriendsList from '@/components/Protected/Friends/FriendsList.vue';
import RequestsSent from '@/components/Protected/Friends/RequestsSent.vue';

import { onMounted } from 'vue';
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
        effect: 'bounce', // or 'glow' for Android-style glow effect
        damping: 0.2, // Adjust damping for smoother bounce
        maxOverscroll: 150, // Maximum overscroll distance
      },
    },
  });
});
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  /* Full viewport height */
  overflow: hidden;
  /* Prevent scrolling in the container */
}

.navbar {
  width: 250px;
  /* Fixed width for the navbar */
  height: 100vh;
  /* Full height of the viewport */
  position: fixed;
  /* Keeps navbar fixed on the left */
  top: 0;
  left: 0;
  background-color: #ffffff;
  /* Background for navbar */
  z-index: 1;
  /* Ensures navbar stays above other content */
}

main {
  margin-left: 250px;
  /* Offset to the right of the navbar */
  flex-grow: 1;
  padding: 5%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: #FCEFB4;
  height: 100vh;
  /* Full viewport height */
  overflow: hidden;
  /* Hide native scrollbars */
}

#scrollable-element {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  /* Enable scrolling on y-axis */
}

h3 {
  margin: 0;
  font-weight: bold;
}

.heading {

  font-size: 2rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}
</style>
