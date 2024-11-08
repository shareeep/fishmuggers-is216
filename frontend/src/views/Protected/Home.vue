<template>
  <div class="home-container">
    <Navbar />
    <main id="scrollable-element">
      <Petpost @trigger-share-popup="openSharePopup" />
    </main>
    <router-link to="/addpost">
      <button class="floating-btn">🐾</button>
    </router-link>

    <!-- HomeSharePopup component here -->
    <HomeSharePopup
      v-if="currentPost && showPopup"
      :friends="friends"
      :shareContent="`../posts/${currentPost.postId}`"
      :postId="currentPost.postId"
      :userId="userId"
      @close="closeSharePopup"
    />
  </div> 
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import Navbar from '@/components/Protected/Navbar.vue';
import Petpost from '@/components/Protected/PetPosts/Petpost.vue';
import HomeSharePopup from '@/components/Protected/PetPosts/PetpostShare.vue';
import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';

// Define reactive properties for popup
const showPopup = ref(false);
const currentPost = ref(null);
const friends = ref([]);
const userId = ref(null);

// Method to open the popup
function openSharePopup(post) {
  if (!userId.value) {
    alert("Please log in to share posts.");
    return;
  }
  showPopup.value = true;
  currentPost.value = post;
}

// Method to close the popup
function closeSharePopup() {
  showPopup.value = false;
}

Scrollbar.use(OverscrollPlugin);  // To store the scrollbar instance


onMounted(() => {
  const auth = getAuth();
  userId.value = auth.currentUser ? auth.currentUser.uid : null;

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

  scrollbar.track.xAxis.element.style.opacity = '0';
  scrollbar.track.yAxis.element.style.opacity = '0';
});
</script>


<style scoped>
#scrollable-element {
  width: 100%;
  height: 100%;
  overflow-y: scroll;

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
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}

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
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.floating-btn:hover {
  background-color: #e6c200;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}


.floating-btn:active {
  transform: scale(0.98);


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

  .floating-btn {
    width: 50px;
    height: 50px;
    font-size: 30px;
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
    /* Account for navbar height on mobile */
    overflow-y: auto;
  }

  .floating-btn {
    bottom: 60px;
    /* Place above mobile navbar */
    right: 20px;
    width: 50px;
    height: 50px;
    font-size: 30px;
  }
}
</style>
