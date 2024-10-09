<template>
  <div class="home-container"> <!-- Use a wrapper for flex layout -->
    <Navbar />
    <main>
      <!-- <h1>EVENTS</h1> -->
      <search_filter/>
      <carousel/>

    </main>
    
  </div>
</template>

<script setup>
// Any Home page-specific logic 
import search_filter from '@/components/Protected/Search&Filter.vue';
import carousel from '@/components/Protected/Carousel.vue';
import Navbar from '@/components/Protected/Navbar.vue';
</script>

<style scoped>
.navbar {
  width: 250px;
  /* Width of the navbar */
  height: 100vh;
  /* Full height of the viewport */
}

.search_filter{
  background-color: white;
  padding-left: 30px;
}

.carousel{
  padding-left: 50px;
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
  background-color: white;
  /* Example background color */
  overflow-y: auto;
  /* Allow scrolling if content overflows */
}

h1 {
  text-align: center;
  /* Center text in the main area */
}
</style>