<template>
  <div class="home-container"> <!-- Use a wrapper for flex layout -->
    <Navbar />
    <main id="scrollable-element">
      <Petpost @open-share-popup="handleOpenSharePopup" />
    </main>
    <!--Go to Add Post Page-->
    <router-link to="/addpost">
      <button class="floating-btn">🐾</button>
    </router-link>
    <HomeSharePopup v-if="post.showPopup" :friends="friends"
      :shareContent="`http://localhost:5173/posts/${post.postId}/${post.userId}`" :postId="post.postId" :userId="post.userId"
      @close="post.showPopup = false" />
  </div>
</template>

<script setup>
// Any Home page-specific logic
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import Navbar from '@/components/Protected/Navbar.vue';
import Petpost from '@/components/Protected/PetPosts/Petpost.vue';
import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
import HomeSharePopup from '@/components/Protected/PetPosts/PetpostShare.vue';

const auth = getAuth(); // Initialize auth
const post = ref({ showPopup: false, postId: null, userId: null }); // Track which post's popup is open

function handleOpenSharePopup(postId) {
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  post.value = { showPopup: true, postId, userId }; // Make sure userId is defined here
}

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
