<template>
  <div class="home-container"> <!-- Use a wrapper for flex layout -->
    <Navbar />
    <main>
      <!-- <h1>EVENTS</h1> -->
      <search_filter />
      <carousel />
    </main>

  </div>
</template>

<script setup>
// Any Home page-specific logic 
import Navbar from '@/components/Protected/Navbar.vue';
import search_filter from '@/components/Protected/SearchandFilter.vue';
import carousel from '@/components/Protected/Carousel.vue';

</script>

<style scoped>
.navbar {
  width: 250px;
  /* Width of the navbar */
  height: 100vh;
  /* Full height of the viewport */
  position: sticky;
  top: 0;
}

.search_filter {
  background-color: #FCEFB4;
  padding-left: 30px;
}


.home-container {
  display: flex;
  /* Set flexbox layout for the container */
}


/* can change */
main {
  flex-grow: 1;
  /* Allow main to take the remaining width */
  padding: 20px;
  /* Add padding for spacing */
  /* Optional styling */
  background-color: #FCEFB4;
  /* Example background color */
  overflow-y: auto;
  /* Allow scrolling if content overflows */
  display: flex;
  flex-direction: column; /* Ensure content stacks vertically */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
   /* Make the main take full viewport height */
}
</style>