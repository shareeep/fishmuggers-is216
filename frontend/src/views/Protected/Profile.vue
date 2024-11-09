<template>
  <div class="home-container">
    <Navbar />
    <main id="scrollable-element">
      <ProfileMain :userData="userData" :pets="pets" :isOwnProfile="isOwnProfile" :createdEvents="createdEvents"
        :joinedEvents="joinedEvents" @edit-event="openEditEventModal" @event-updated="fetchEvents"
        @open-post="openModal" @edit-pet="openEditPetModal" @delete-pet="deletePet" @delete-event="handleEventDeleted"/>

    </main>
    <EditEventModal v-if="showEditModal" :eventData="editEventData" @close="closeEditEventModal"
      @event-updated="handleEventUpdated" />

    <EditPetModal v-if="showEditPetModal" :pet="currentEditPet" @close="closeEditPetModal"
      @update-pet="handlePetUpdate" />

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
import ProfileMain from '@/components/Protected/Profile/ProfileMain.vue';
import EditEventModal from '@/components/Protected/EventsAdmin/EditEventModal.vue';
import EditPetModal from '@/components/Protected/Profile/EditPetModal.vue';

import PostModal from '@/components/Protected/Profile/PostModal.vue';

const route = useRoute();
const auth = getAuth();

const showEditPetModal = ref(false); // Modal visibility control
const currentEditPet = ref(null); // To store the selected pet to edit
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

// Handle the 'open-post' event from ProfileMain.vue
const openModal = (post) => {
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
    selectedPost.value = userData.value.posts[selectedPostIndex.value];
  }
};

const goToNextPost = () => {
  if (selectedPostIndex.value < userData.value.posts.length - 1) {
    selectedPostIndex.value++;
    selectedPost.value = userData.value.posts[selectedPostIndex.value];
  }
};

const openEditPetModal = (pet) => {
  if (pet && pet.petId) {
    console.log("Opening EditPetModal for pet with ID:", pet.petId); // Debugging
    currentEditPet.value = pet;  // Set the pet to be edited
    showEditPetModal.value = true; // Open the modal
  } else {
    console.error("Pet ID is missing or invalid:", pet); // Error if ID is undefined
  }
};


const closeEditPetModal = () => {
  showEditPetModal.value = false;
  currentEditPet.value = null;
};

const deletePet = async (petId) => {
  if (!confirm('Are you sure you want to delete this pet?')) {
    return;
  }

  try {
    await axios.delete(`/api/pets/${petId}`);
    await fetchPets(); // Refresh pets list after deletion
  } catch (error) {
    console.error('Error deleting pet:', error);
    alert('Failed to delete pet. Please try again.');
  }
};


const fetchPets = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return;
  }

  try {
    const response = await axios.get(`/api/users/${currentUser.uid}`);
    const userPets = response.data.pets || [];

    // Fetch pet details
    const petPromises = userPets.map(async (petId) => {
      const petResponse = await axios.get(`/api/pets/${petId}`);
      return { id: petId, ...petResponse.data };
    });

    pets.value = await Promise.all(petPromises);
  } catch (error) {
    console.error('Error fetching pets:', error);
  }
};
// Function to handle the pet update event from EditPetModal
const handlePetUpdate = async () => {
  await fetchPets(); // Refresh the pets list from the backend
};


const handleLikeToggle = async ({ postId, isLiked }) => {
  try {
    // Ensure the user is authenticated
    if (!auth.currentUser) {
      alert("You need to be logged in to like posts.");
      return;
    }

    const token = await auth.currentUser.getIdToken();
    const userId = auth.currentUser.uid;

    console.log("Token:", token); // Debugging
    console.log("User ID:", userId); // Debugging

    // Send like/unlike request to the backend with userId
    const response = await axios.post(
      `/api/posts/${postId}/like`,
      { like: isLiked, userId: userId }, // Included userId
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 200) {
      // Find the post in userData.posts
      const postIndex = userData.value.posts.findIndex(post => post.postId === postId);
      if (postIndex !== -1) {
        if (isLiked) {
          // Add current user's ID to the likes array
          userData.value.posts[postIndex].likes.push(userId);
        } else {
          // Remove current user's ID from the likes array
          const index = userData.value.posts[postIndex].likes.indexOf(userId);
          if (index !== -1) {
            userData.value.posts[postIndex].likes.splice(index, 1);
          }
        }
        // Update isLiked status
        userData.value.posts[postIndex].isLiked = isLiked;
        // Update the selectedPost if it's the one being viewed
        if (selectedPost.value && selectedPost.value.postId === postId) {
          selectedPost.value = userData.value.posts[postIndex];
        }
      }
    }
  } catch (error) {
    console.error("Error toggling like:", error.response?.data || error);
    alert(error.response?.data?.error || "Unable to toggle like. Please try again.");
  }
};

const handleEventUpdated = async () => {
  await fetchEvents(); // Refresh the list of events from the backend
};

const handleEventDeleted = async () => {
  await fetchEvents(); // Refresh the list of events from the backend
};



const fetchEvents = async () => {
  const uid = route.params.uid || auth.currentUser?.uid;
  if (!uid) return;

  try {
    const response = await axios.get(`/api/events/created/${uid}`);
    createdEvents.value = response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};


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
