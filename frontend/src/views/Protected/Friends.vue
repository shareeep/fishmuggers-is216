<template>
  <div class="home-container">
    <!-- Navbar component -->
    <Navbar />

    <!-- Main content area with components -->
    <main id="scrollable-element">
      <h1 class="heading">Connect with Friends</h1>
      <SearchBar />
      <div style="align-items: center;">
        <FriendRequests />

        <!-- FriendsList component with popup toggle function passed down -->
        <FriendsList @popup-toggle="togglePopup" :friends="friends" />

        <RequestsSent />
      </div>
    </main>

    <!-- AllFriendsPopup component, visible only when showPopup is true -->
    <AllFriendsPopup v-if="showPopup" :friends="friends" @close="togglePopup(false)" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Protected/Navbar.vue';
import SearchBar from '@/components/Protected/Friends/Searchbar.vue';
import FriendRequests from '@/components/Protected/Friends/FriendRequests.vue';
import FriendsList from '@/components/Protected/Friends/FriendsList.vue';
import RequestsSent from '@/components/Protected/Friends/RequestsSent.vue';
import AllFriendsPopup from '@/components/Protected/Friends/AllFriendsPopup.vue';

import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';

// Initialize Smooth Scrollbar for main content
Scrollbar.use(OverscrollPlugin);

const showPopup = ref(false);
const friends = ref([
  { id: 1, name: "Jerome", username: "jerome-with-a-j", avatar: "https://randomuser.me/api/portraits/men/10.jpg" },
  { id: 2, name: "Becky Gianani", username: "becky-gee", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
  { id: 3, name: "Lauren Moore", username: "lauren-moore", avatar: "https://randomuser.me/api/portraits/women/18.jpg" },
  { id: 4, name: "Brad Garner", username: "bradgarner", avatar: "https://randomuser.me/api/portraits/men/17.jpg" },
  { id: 5, name: "Zafira Bee", username: "zafira-bee", avatar: "https://randomuser.me/api/portraits/men/14.jpg" },
  { id: 6, name: "Tim Double-U", username: "tim-double-u", avatar: "https://randomuser.me/api/portraits/men/19.jpg" },
  { id: 7, name: "Georgia Plué", username: "gee-plue", avatar: "https://randomuser.me/api/portraits/women/20.jpg" },
  { id: 8, name: "Alex Johnson", username: "alex-j", avatar: "https://randomuser.me/api/portraits/men/23.jpg" },
  { id: 9, name: "Samantha Rose", username: "sam-rose", avatar: "https://randomuser.me/api/portraits/women/25.jpg" },
  { id: 10, name: "Chris Lee", username: "chris-lee", avatar: "https://randomuser.me/api/portraits/men/29.jpg" },
  { id: 11, name: "Emily Nguyen", username: "em-nguyen", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: 12, name: "Michael Tan", username: "mike-tan", avatar: "https://randomuser.me/api/portraits/men/35.jpg" },
  // ... Add other friends here
]);

// Function to toggle popup visibility
function togglePopup(value) {
  showPopup.value = value;
}

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

/* Responsive Adjustments */
@media (max-width: 991px) {
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
    padding-bottom:45px;
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