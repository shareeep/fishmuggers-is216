<template>
  <div class="home-container">
    <Navbar />
    <main id="scrollable-element">
      <ProfileMain 
        :userData="userData" 
        :pets="pets" 
        :isOwnProfile="isOwnProfile" 
        :createdEvents="createdEvents"
        :joinedEvents="joinedEvents"
        @edit-event="openEditEventModal" 
        @event-updated="fetchEvents" 
        @open-post="openPostModal" 
      />
    </main>
    <EditEventModal v-if="showEditModal" :eventData="editEventData" @close="closeEditEventModal"
      @event-updated="handleEventUpdated" />
    <PostModal v-if="showPostModal" :post="selectedPost" :userData="userData" :selectedPostIndex="selectedPostIndex"
      :totalPosts="userData.posts.length" @close="closePostModal" @prev="goToPrevPost" @next="goToNextPost" />
  </div> 
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import Navbar from '@/components/Protected/Navbar.vue';
import ProfileMain from '@/components/Protected/Profile/ProfileMain.vue';
import EditEventModal from '@/components/Protected/EventsAdmin/EditEventModal.vue';
import PostModal from '@/components/Protected/Profile/PostModal.vue';

const route = useRoute();
const auth = getAuth();

const showEditModal = ref(false);
const editEventData = ref(null);
const showPostModal = ref(false);
const selectedPost = ref(null);
const selectedPostIndex = ref(0);

const userData = ref({
  profileImage: '',
  username: '',
  posts: [],
  joinedEvents: [],
  friends: [],
});
const pets = ref([]);
const isOwnProfile = ref(false);
const loading = ref(true);
const createdEvents = ref([]);
const joinedEvents = ref([]);

const fetchUserProfile = async () => {
  loading.value = true;
  const uid = route.params.uid || auth.currentUser?.uid;
  if (!uid) return;

  isOwnProfile.value = (uid === auth.currentUser?.uid);

  try {
    // Fetch user data
    const userResponse = await axios.get(`/api/users/${uid}`);
    userData.value = userResponse.data;

    // Fetch user's posts
    const postsResponse = await axios.get(`/api/posts/user/${uid}/posts`);
    userData.value.posts = postsResponse.data;

    // Fetch user's pets
    const petsResponse = await axios.get(`/api/pets/user/${uid}`);
    pets.value = petsResponse.data;

    // Fetch created and joined events
    const createdEventsResponse = await axios.get(`/api/events/created/${uid}`);
    createdEvents.value = createdEventsResponse.data;

    const joinedEventsResponse = await axios.get(`/api/events/joined/${uid}`);
    joinedEvents.value = joinedEventsResponse.data;

  } catch (error) {
    console.error("Error fetching user data or events:", error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => route.params.uid,
  async (newUid, oldUid) => {
    if (newUid !== oldUid) {
      await fetchUserProfile();
    }
  }
);

onMounted(fetchUserProfile);

const openEditEventModal = (event) => {
  editEventData.value = event;
  showEditModal.value = true;
};

const closeEditEventModal = () => {
  showEditModal.value = false;
  editEventData.value = null;
};

const openPostModal = (post) => {
  selectedPost.value = post;
  selectedPostIndex.value = userData.value.posts.findIndex((p) => p.postId === post.postId);
  showPostModal.value = true;
};

const closePostModal = () => {
  showPostModal.value = false;
  selectedPost.value = null;
};

const goToPrevPost = () => {
  if (selectedPostIndex.value > 0) {
    selectedPostIndex.value--;
  } else {
    selectedPostIndex.value = userData.value.posts.length - 1;
  }
  selectedPost.value = userData.value.posts[selectedPostIndex.value];
};

const goToNextPost = () => {
  if (selectedPostIndex.value < userData.value.posts.length - 1) {
    selectedPostIndex.value++;
  } else {
    selectedPostIndex.value = 0;
  }
  selectedPost.value = userData.value.posts[selectedPostIndex.value];
};

// Scrollbar setup (same as before)
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

.navbar {
  width: 250px;
  height: 100vh;
  position: fixed;
}

.home-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

main {
  align-items: center;
  margin-left: 250px;
  flex-grow: 1;
  flex-direction: column;
  gap: 5px;
  background-color: #FCEFB4;
  height: 100vh;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
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
    overflow-y: auto;
  }
}
</style>
