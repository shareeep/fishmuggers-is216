<template>
  <div class="home-container">
    <Navbar />
    <main>
      <h1 class="heading">Connect with Friends</h1>
      <SearchBar />
      <FriendRequests />
      <FriendsList />
      <RequestsSent />
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Protected/Navbar.vue';
import SearchBar from '@/components/Protected/Friends/Searchbar.vue';
import FriendRequests from '@/components/Protected/Friends/FriendRequests.vue';
import FriendsList from '@/components/Protected/Friends/FriendsList.vue';
import RequestsSent from '@/components/Protected/Friends/RequestsSent.vue';
</script>

<style scoped>
.navbar {
  width: 250px; /* Width of the navbar */
  height: 100vh; /* Full height of the viewport */
}

.home-container {
  display: flex; /* Set flexbox layout for the container */
  height: 100vh; /* Full height of the viewport */
  overflow: hidden; /* Prevent overflow */
}

main {
  flex-grow: 1;
  padding: 5%;
  display: flex;
  flex-direction: column; /* Stack children vertically */
  gap: 5px; /* Add spacing between the components */
  background-color:  #FCEFB4;
  overflow: scroll; /* Prevent scrolling */
}

main > * {
  flex: 0 1 auto; /* Ensure components don't grow disproportionately */
  display: flex;
  flex-direction: column; /* Stack headers and content vertically */
  align-items: center; /* Align content to the left */
  box-sizing: border-box; /* Ensure padding and borders are included in the width/height calculations */
  width: 100%; /* Take full width of the container */
  gap: 10px; /* Add spacing between header and content */
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
  align-items: center;
}

</style>
