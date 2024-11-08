<template>
  <div class="profile-page" v-if="userData">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-picture">
        <img :src="userData.profileImage || 'https://via.placeholder.com/150?text=Profile+Image'" alt="Profile Picture"
          class="profile-image" />
      </div>
      <div class="profile-info">
        <div class="profile-details">
          <h2 class="username">{{ props.userData.username }}</h2>
<router-link v-if="isOwnProfile" to="/editprofile">
  <button class="edit-btn">Edit profile</button>
</router-link>
        </div>
<div class="profile-stats">
  <span><b>{{ userData?.posts?.length || 0 }}</b> Posts</span>
  <span><b>{{ userData?.joinedEvents?.length || 0 }}</b> Events Joined</span>
  <span><b>{{ userData?.friends?.length || 0 }}</b> Friends</span>
</div>
      </div>
    </div>

    <!-- Profile Tabs -->
    <div class="profile-tabs">
      <button :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">Posts</button>
      <button :class="{ active: activeTab === 'eventsJoined' }" @click="activeTab = 'eventsJoined'">Events</button>
      <button :class="{ active: activeTab === 'pets' }" @click="activeTab = 'pets'">Pets</button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
<div v-if="activeTab === 'posts'">
  <div v-if="posts.length === 0" class="no-posts">
    <i class="no-posts-pic"><img src="../../../assets/images/camera.png" alt=""></i>
    <h3>Share Photos</h3>
    <p>When you share photos, they will appear on your profile.</p>
    <router-link to="/addpost">
      <p class="share-first-photo">Share your first photo</p>
    </router-link>
  </div>
  <div v-else class="posts-grid">
    <div v-for="(post, index) in posts" :key="post.id" class="post-item" @click="openModal(post)">
      <img :src="post.image" alt="User Post" class="post-image" />
      <div class="post-overlay">
        <i class="fas fa-thumbs-up"></i>
        <span class="likes-count">{{ post.likes?.length || 0 }}</span>
      </div>
    </div>
  </div>
</div>

      <div v-if="activeTab === 'eventsJoined'">


        <!-- Buttons for toggling views -->
        <div class="toggle-buttons">
          <button :class="{ active: eventsView === 'createdEvents' }" @click="eventsView = 'createdEvents'">
            Created Events
          </button>
          <button :class="{ active: eventsView === 'joinedEvents' }" @click="eventsView = 'joinedEvents'">
            Joined Events
          </button>
        </div>

        <!-- Display CreatedEvents or JoinedEvents based on eventsView -->
        <div v-if="eventsView === 'createdEvents'">
    <router-link v-if="isOwnProfile" to="/eventsadmin">
    <button class="edit-btn">Create Event</button>
  </router-link>
          
          <CreatedEventsList 
            :events="createdEvents" 
            @edit-event="handleEditEvent" 
            @delete-event="handleDeleteEvent" 
          />
        </div>

        
        <div v-if="eventsView === 'joinedEvents'">
              <router-link v-if="isOwnProfile" to="/events">
      <button class="edit-btn">Join Event</button>
    </router-link>
          <JoinedEventsList 
            :events="joinedEvents" 
          />
        </div>
      </div>


      <!-- PETS -->
<div v-if="activeTab === 'pets'">
  <router-link to="/manage-pets">
    <button class="edit-btn">Manage Pets</button>
  </router-link>
  <div class="pets-wrapper">
    <!-- Check if there are pets to display -->
    <div v-if="props.pets.length > 0" class="pets-grid">
      <div v-for="(pet, index) in props.pets" :key="index" class="pet-card"
        :style="{ animationDelay: `${index * 0.2}s` }">
        <img 
          :src="pet.profileImage || 'https://via.placeholder.com/150?text=No+Image'" 
          alt="Pet Image" 
          class="pet-avatar" 
        />
        <div class="info-container">
          <div class="details">
            <h4>{{ pet.name }}</h4>
            <p>Type: {{ pet.type }}</p>
            <p>Breed: {{ pet.breed }}</p>
            <p>Age: {{ pet.age }} years</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Display message if no pets are available -->
    <div v-else class="no-pets">
      <i class="no-pets-pic"><img src="../../../assets/images/no-events.png" alt="No Pets Image"></i>
      <h3>No pets yet</h3>
      <p>Add your pets so others can see them too!</p>
    </div>
  </div>
</div>


    </div>
  </div>
  <div v-else class="loading-placeholder">Loading...</div>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps, watch } from 'vue';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';
import CreatedEventsList from "@/components/Protected/EventsAdmin/CreatedEventsList.vue";
import JoinedEventsList from "@/components/Protected/EventsAdmin/JoinedEventsList.vue";

// Define props
const props = defineProps({
  userData: Object,
  pets: Array,
  isOwnProfile: Boolean,
  createdEvents: Array,
  joinedEvents: Array,
});

const posts = ref([]);
onMounted(() => {
  if (props.userData && props.userData.userId) {
    fetchPosts(props.userData.userId);
  }
});

// Optionally, add a watcher to re-fetch posts if userData changes
watch(() => props.userData, (newData) => {
  if (newData && newData.userId) {
    fetchPosts(newData.userId);
  }
});

const fetchPosts = async (userId) => {
  try {
    const response = await axios.get(`/api/posts/user/${userId}/posts`);
    posts.value = response.data || []; // Ensure posts is always an array
    console.log("Fetched Posts:", posts.value); // Debugging log
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

// Define emits
const emit = defineEmits(['edit-event', 'delete-event', 'open-post']);

// Define reactive properties
const eventsView = ref('createdEvents');
const activeTab = ref('posts');

// Handle edit event from CreatedEventsList.vue
const handleEditEvent = (event) => {
  emit('edit-event', event);
};

// Handle delete event from CreatedEventsList.vue
const handleDeleteEvent = (eventId) => {
  emit('delete-event', eventId);
};

const openModal = (post) => {
  emit('open-post', post);
};

</script>

<style scoped>


.profile-page {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
}

.profile-header {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  text-align: center;
}

.profile-picture img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-details {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.profile-info {
  text-align: left;
}



.username {
  font-size: 20px;
  font-weight: bold;
}

.edit-btn {
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  background-color: #FFD700;
  color: #333;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transform: scale(1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 15px;
  /* Adds space below the button */
}

.edit-btn:hover {
  background-color: #E6C200;
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.edit-btn:active {
  transform: scale(0.98);
}


.profile-stats {
  display: flex;
  gap: 10px;
  font-size: 14px;
}

.profile-tabs {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #ddd;
  padding: 10px;
  font-size: 16px;
}

.profile-tabs button {
  background: none;
  border: none;
  font-weight: bold;
  color: #888;
  cursor: pointer;
}

.profile-tabs .active {
  color: black;
  border-bottom: 2px solid black;
}

.tab-content {
  padding: 20px;
  font-size: 16px;
}

.tab-content {
  padding: 20px;
  font-size: 16px;
}

.pets-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Pets grid layout */
.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

/* Pet card styling */
.pet-card {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  width: 325px;
  opacity: 0;
  transform: scale(0.9);
  animation: popFadeIn 0.4s forwards;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 15px;
}

@keyframes popFadeIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.pet-avatar {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

.info-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.details {
  flex-grow: 1;
}


.pet-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.details h4 {
  font-weight: bold;
  color: #333;
  margin: 0;
}

.details p {
  color: #666;
  margin: 0;
}

/* Actions */
.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 5px;
}

/* Button Styles */
.edit-button,
.remove-button {
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.edit-button {
  background-color: #FFD700;
  color: #333;
}

.remove-button {
  background-color: #ddd;
  color: #333;
}

.edit-button:hover,
.remove-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.edit-button:hover {
  background-color: #E6C200;
}

.remove-button:hover {
  background-color: #bbb;
}

.edit-button:active,
.remove-button:active {
  transform: scale(0.98);
}

.no-posts {
  text-align: center;
  color: #555;
  padding: 40px 20px;
}

.no-posts-pic {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.no-posts-pic img {
  width: 150px;
  height: auto;
  /* Maintain aspect ratio */
}

.no-posts h3 {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 5px;
}

.no-posts p {
  font-size: 14px;
  color: #777;
}

.no-posts,
.no-pets {
  text-align: center;
  color: #555;
  padding: 40px 20px;
}

.no-posts-pic {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.no-pets-pic {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0;
}

.no-pets-pic img,
.no-posts-pic img {
  width: 150px;
  height: auto;
  /* Maintain aspect ratio */
}

.no-pets h3,
.no-posts h3 {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 5px;
}

.no-posts p {
  font-size: 14px;
  color: #777;
}

.share-first-photo {
  color: #0095f6;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  margin-top: 10px;
  text-decoration: underline;
}


.share-first-photo {
  color: #0095f6;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  margin-top: 10px;
  text-decoration: underline;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 3 columns for Instagram-like layout */
  gap: 8px;
}

.post-item {
  width: 100%;
  padding-top: 100%;
  /* 1:1 Aspect Ratio */
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.post-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}


.post-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1001; /* Ensure it's above the image */
}

.post-item:hover .post-overlay {
  opacity: 1;
  cursor: pointer;
}


.post-item:hover .overlay {
  opacity: 1;
  cursor: pointer;
}

.likes-count {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.fa-thumbs-up {
  color: white;
}

.post-modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  display: flex;
  background: #fff;
  border-radius: 10px;
  max-height: 90vh;
  overflow: hidden;
  padding: 0;
  width: auto;
}

.modal-left {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
  background-color: #f8f8f8;
  overflow: hidden;
  flex: 0 0 auto;
}

.modal-image {
  width: auto;
  height: 100%;
  object-fit: cover;
}

.modal-right {
  flex: 0 0 auto;
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 400px;
  padding: 20px;
}

.toggle-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.toggle-buttons button {
  padding: 10px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-weight: bold;
  border-radius: 10px;
}

.toggle-buttons .active {
  background-color: #333;
  color: white;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  /* Divider color */
  width: 100%;
  /* Full width */
  padding-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.user-name {
  font-size: 1.2rem;
  font-weight: bold;
}

.menu-container {
  margin-left: auto;
}

.post-footer {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.caption-container {
  display: flex;
  max-width: 100%;
  align-items: flex-start;
  margin-bottom: 10px;

}

.user-name-caption {
  font-weight: bold;
  margin-right: 5px;
  color: black;
}

.avatar-caption {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.caption-text {
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  overflow-wrap: break-word;
  white-space: normal;
  text-align: left;
}

.likes-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  border-top: 1px solid #ddd;
  /* Divider line */
  padding-top: 10px;
  width: 100%;
  margin-top: auto;
}

.likes-caption {
  font-size: 1rem;
  font-weight: bold;
  color: #666;
}

.like-button {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  color: black;
  background: none;
  border: none;
  cursor: pointer;
}

.like-button i {
  margin-right: 5px;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  user-select: none;
}

.nav-arrow:hover {
  color: #ddd;
}

.fa-chevron-left {
  left: 10px;
}

.fa-chevron-right {
  right: 10px;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
}

.nav-arrow.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
