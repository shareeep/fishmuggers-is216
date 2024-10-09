<template>
  <div class="home-container">
    <Navbar />
    <main>
      <SearchBar />
      <FriendRequests />
      <FriendsList />
      <RequestsSent />
      <InviteFriends />
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Protected/Navbar.vue';
import SearchBar from '@/components/Protected/Friends/Searchbar.vue';
import FriendRequests from '@/components/Protected/Friends/FriendRequests.vue';
import FriendsList from '@/components/Protected/Friends/FriendsList.vue';
import RequestsSent from '@/components/Protected/Friends/RequestsSent.vue';
import InviteFriends from '@/components/Protected/Friends/InviteFriends.vue';
</script>

<style scoped>
.navbar {
  width: 250px; /* Width of the navbar */
  height: 100vh; /* Full height of the viewport */
}

.home-container {
  display: flex; /* Set flexbox layout for the container */
}

main {
  flex-grow: 1;
  padding: 5%;
  display: flex;
  flex-direction: column;
  gap: 20px; /* This adds spacing between the components */
  background-color: goldenrod;
  overflow-y: auto; /* Allow scrolling if content overflows */
}

h1 {
  text-align: center; /* Center text in the main area */
}
</style>
