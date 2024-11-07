<template>
  <div class="home-container">
    <Navbar />
    <main id="scrollable-element">
      <ProfileMain :userData="userData" :pets="pets" @edit-event="openEditEventModal" @event-updated="fetchEvents"
        @open-post="openPostModal" />
    </main>
    <EditEventModal v-if="showEditModal" :eventData="editEventData" @close="closeEditEventModal"
      @event-updated="handleEventUpdated" />
    <PostModal v-if="showPostModal" :post="selectedPost" :userData="userData" :selectedPostIndex="selectedPostIndex"
      :totalPosts="userData.posts.length" @close="closePostModal" @prev="goToPrevPost" @next="goToNextPost" />
  </div> 
</template>


<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Protected/Navbar.vue';
import ProfileMain from '@/components/Protected/Profile/ProfileMain.vue';
import EditEventModal from '@/components/Protected/EventsAdmin/EditEventModal.vue';
import PostModal from '@/components/Protected/Profile/PostModal.vue';

const showEditModal = ref(false);
const editEventData = ref(null);
const showPostModal = ref(false);
const selectedPost = ref(null);
const selectedPostIndex = ref(0);

const userData = ref({
  id: 1,
  friends: 73,
  username: 'username',
  profileImage: '',
  joinedEvents: [],
  posts: [
    { id: 1, image: 'https://www.tracyvets.com/files/Parakeets.jpeg', likes: 194000, caption: 'First post caption',isLiked: false },
    { id: 2, image: 'https://www.uk.pedigree.com/sites/g/files/fnmzdf5531/files/2023-06/pexels-sarah-chai-7282710-list.jpg', likes: 6290, caption: 'woof woof',isLiked: false },
    { id: 3, image: 'https://media.4-paws.org/a/e/6/f/ae6fefbd6d12cfc50d51ebb7da9d7cbdb322d006/VIER%20PFOTEN_2020-10-07_00138-2890x2000-1920x1329.jpg', likes: 1020, caption: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed consectetur fuga molestias rem rerum, placeat, iusto repellat eius natus veritatis nostrum libero, blanditiis autem molestiae aperiam similique quis officiis eum?',isLiked: false },
  ]
});

const pets = ref([
  { name: 'Woofie', type: 'Dog', breed: 'Golden Retriever', age: 3, image: 'https://via.placeholder.com/150?text=Dog' },
  { name: 'Meowers', type: 'Cat', breed: 'Siamese', age: 2, image: 'https://via.placeholder.com/150?text=Cat' }
]);


const openEditEventModal = (event) => {
  editEventData.value = event;
  showEditModal.value = true;
};

const closeEditEventModal = () => {
  showEditModal.value = false;
  editEventData.value = null;
};

// Set selected post and index when opening the post modal
const openPostModal = (post) => {
  selectedPost.value = post;
  selectedPostIndex.value = userData.value.posts.findIndex((p) => p.id === post.id);  // Set the index here
  showPostModal.value = true;
};

const closePostModal = () => {
  showPostModal.value = false;
  selectedPost.value = null;
};

// Handle navigation to the previous post
const goToPrevPost = () => {
  if (selectedPostIndex.value > 0) {
    selectedPostIndex.value--;
  } else {
    selectedPostIndex.value = userData.value.posts.length - 1; // Wrap to last post
  }
  selectedPost.value = userData.value.posts[selectedPostIndex.value];
};

// Handle navigation to the next post
const goToNextPost = () => {
  if (selectedPostIndex.value < userData.value.posts.length - 1) {
    selectedPostIndex.value++;
  } else {
    selectedPostIndex.value = 0; // Wrap to first post
  }
  selectedPost.value = userData.value.posts[selectedPostIndex.value];
};

// Scrolling
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

  // Hide the scrollbar track by setting its opacity to 0
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
