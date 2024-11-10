<template>
  <div class="home-container">
    <Navbar />
    <main id="scrollable-element">
      <div>
        <UserProfile :userData="userData" :createdEvents="userData.createdEvents" :joinedEvents="userData.joinedEvents"
          :pets="pets" :isOwnProfile="false" @open-post="openModal" />
      </div>
    </main>

    <!-- Post Modal for viewing and interacting with posts -->
    <PostModal v-if="showPostModal" :post="selectedPost" :userData="userData" :selectedPostIndex="selectedPostIndex"
      :totalPosts="userData.posts.length" @close="closePostModal" @prev="goToPrevPost" @next="goToNextPost"
      @like-toggle="handleLikeToggle" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import Navbar from '@/components/Protected/Navbar.vue';
import UserProfile from '@/components/Protected/Profile/UserProfile.vue';
import PostModal from '@/components/Protected/Profile/PostModal.vue';

const route = useRoute();
const auth = getAuth();

const userId = route.params.id;
const showPostModal = ref(false);
const selectedPost = ref(null);
const selectedPostIndex = ref(0);

const userData = ref({
  username: '',
  profileImage: '',
  posts: [],
  joinedEvents: [],
  createdEvents: [],
});

const pets = ref([]);
const createdEvents = ref([]);
const joinedEvents = ref([]);
const isRequested = ref(false);
const isFriend = ref(false);

// Fetch user data and populate profile information
const fetchUserData = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };

    const [
      userResponse,
      postsResponse,
      createdEventsResponse,
      joinedEventsResponse,
      petsResponse,
    ] = await Promise.all([
      axios.get(`/api/users/${userId}`, { headers }),
      axios.get(`/api/posts/user/${userId}/posts`, { headers }),
      axios.get(`/api/events/created/${userId}`, { headers }),
      axios.get(`/api/events/joined/${userId}`, { headers }),
      axios.get(`/api/pets/user/${userId}`, { headers }),
    ]);

    userData.value = { ...userData.value, ...userResponse.data };
    userData.value.posts = (postsResponse.data || []).map(post => ({
      ...post,
      isLiked: post.likes.includes(auth.currentUser.uid),
    }));
    userData.value.createdEvents = createdEventsResponse.data || [];
    userData.value.joinedEvents = joinedEventsResponse.data || [];
    pets.value = petsResponse.data || [];
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// Check friendship status
const checkFriendStatus = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    const friendsResponse = await axios.get(`/api/friends/${auth.currentUser.uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    isFriend.value = friendsResponse.data.some(friend => friend.id === userId);

    if (!isFriend.value) {
      const requestsResponse = await axios.get(`/api/friends/requests/${auth.currentUser.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      isRequested.value = requestsResponse.data.some(request =>
        request.senderId === auth.currentUser.uid &&
        request.receiverId === userId &&
        request.status === "pending"
      );
    }
  } catch (error) {
    console.error("Error checking friend status:", error);
  }
};

// Open post modal
const openModal = (post) => {
  selectedPost.value = post;
  selectedPostIndex.value = userData.value.posts.findIndex(p => p.postId === post.postId);
  showPostModal.value = true;
};

// Close post modal
const closePostModal = () => {
  showPostModal.value = false;
  selectedPost.value = null;
};

// Navigate to previous and next posts
const goToPrevPost = () => {
  if (selectedPostIndex.value > 0) {
    selectedPostIndex.value--;
    selectedPost.value = userData.value.posts[selectedPostIndex.value];
  }
};

const goToNextPost = () => {
  if (selectedPostIndex.value < userData.value.posts.length - 1) {
    selectedPostIndex.value++;
    selectedPost.value = userData.value.posts[selectedPostIndex.value];
  }
};

// Toggle post like
const handleLikeToggle = async ({ postId, isLiked }) => {
  try {
    const token = await auth.currentUser.getIdToken();
    await axios.post(
      `/api/posts/${postId}/like`,
      { like: isLiked, userId: auth.currentUser.uid },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const postIndex = userData.value.posts.findIndex(post => post.postId === postId);
    if (postIndex !== -1) {
      if (isLiked) {
        userData.value.posts[postIndex].likes.push(auth.currentUser.uid);
      } else {
        const index = userData.value.posts[postIndex].likes.indexOf(auth.currentUser.uid);
        if (index !== -1) userData.value.posts[postIndex].likes.splice(index, 1);
      }
      userData.value.posts[postIndex].isLiked = isLiked;
      if (selectedPost.value && selectedPost.value.postId === postId) {
        selectedPost.value = userData.value.posts[postIndex];
      }
    }
  } catch (error) {
    console.error("Error toggling like:", error.response?.data || error);
  }
};

onMounted(() => {
  fetchUserData();
  checkFriendStatus();
});

watch(() => route.params.id, fetchUserData); // Refetch data if route changes

// Scrollbar setup remains unchanged
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
  /* Width of the navbar */
  height: 100vh;
  /* Full height of the viewport */
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

  .floating-btn {
    width: 45px;
    height: 45px;
    font-size: 26px;
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
    bottom: 70px;
    /* Place above mobile navbar */
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
}
</style>