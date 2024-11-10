<template>
  <div class="profile-page">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-picture">
        <img :src="userData.profileImage || 'https://via.placeholder.com/150?text=Profile+Image'" alt="Profile Picture" class="profile-image" />
      </div>
      <div class="profile-info">
        <div class="profile-details">
          <h2 class="username">{{ props.userData.username }}</h2>

          <!-- Conditional button display for follow/unfollow based on props -->
          <button :class="['edit-btn', { 'requested': isRequested || isFriend }]"
            @click="isFriend ? removeFriend() : toggleFollow()" :disabled="isRequested && !isFriend">
            {{ isFriend ? 'Remove Friend' : (isRequested ? 'Friend Request Sent' : 'Follow') }}
          </button>
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
      <!-- Posts Tab -->
      <div v-if="activeTab === 'posts'">
        <div v-if="posts.length === 0" class="no-posts">
          <i class="no-posts-pic"><img src="../../../assets/images/camera.png" alt=""></i>
          <h3>No posts yet</h3>
        </div>
        <div v-else class="posts-grid">
          <div v-for="(post, index) in userData.posts" :key="post.id" class="post-item" @click="$emit('open-post', post)">
            <img :src="post.image" alt="User Post" class="post-image" />
            <div class="overlay">
              <i class="fas fa-thumbs-up"></i>
              <span class="likes-count">{{ post.likes.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pets Tab -->
      <div v-if="activeTab === 'pets'">
        <router-link v-if="isOwnProfile" to="/manage-pets">
          <button class="edit-btn">Manage Pets</button>
        </router-link>
        <div class="pets-wrapper">
          <div v-if="props.pets.length > 0" class="pets-grid">
            <div v-for="(pet, index) in props.pets" :key="index" class="pet-card" :style="{ animationDelay: `${index * 0.2}s` }">
              <img :src="pet.profileImage || 'https://via.placeholder.com/150?text=No+Image'" alt="Pet Image" class="pet-avatar" />
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
          <div v-else class="no-pets">
            <i class="no-pets-pic"><img src="../../../assets/images/no-events.png" alt=""></i>
            <h3>No pets yet</h3>
          </div>
        </div>
      </div>

      <!-- Events Joined Tab -->
      <div v-if="activeTab === 'eventsJoined'">
        <div class="toggle-buttons">
          <button :class="{ active: eventsView === 'createdEvents' }" @click="eventsView = 'createdEvents'">
            Created Events
          </button>
          <button :class="{ active: eventsView === 'joinedEvents' }" @click="eventsView = 'joinedEvents'">
            Joined Events
          </button>
        </div>
        <div v-if="eventsView === 'createdEvents'">
          <CreatedEventsList :events="createdEvents" @edit-event="handleEditEvent" @delete-event="deleteEvent" />
        </div>
        <div v-if="eventsView === 'joinedEvents'">
          <JoinedEventsList :events="filteredJoinedEvents" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import api from '@/services/api';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';
import JoinedEventsList from '../EventsAdmin/JoinedEventsList.vue';
import CreatedEventsList from '../EventsAdmin/CreatedEventsList.vue';

const auth = getAuth();
const router = useRouter();

// Define props for data coming from FriendProfile.vue
const props = defineProps({
  userData: {
    type: Object,
    required: true
  },
  createdEvents: {
    type: Array,
    required: true
  },
  joinedEvents: {
    type: Array,
    required: true
  },
  pets: {
    type: Array,
    required: true
  },
  isOwnProfile: {
    type: Boolean,
    default: true
  }
});


watch(
  () => props.userData.userId,
  (newUserId) => {
    if (newUserId) {
      fetchPosts(newUserId);
    }
  },
  { immediate: true }
);

const fetchPosts = async (userId) => {
  console.log(`Fetching posts for userId: ${userId}`); // Debugging log
  try {
    const response = await api.get(`/api/posts/user/${userId}/posts`);
    posts.value = response.data || [];
    console.log("Fetched Posts:", posts.value);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

const posts = computed(() => props.userData.posts || []);

const activeTab = ref('posts');
const eventsView = ref('createdEvents');

// Additional states for friends and requests
const isRequested = ref(false);
const isFriend = ref(false);
const friends = ref(0); // Placeholder for friend count

const filteredJoinedEvents = computed(() => {
  // Check for valid events and filter to exclude those created by the current user
  console.log("User Data:", props.userData); // This should include userId

  const currentUserId = props.userData.uid;
  console.log(currentUserId);
  return props.joinedEvents.filter(event => {
    const isNotCreatedByUser = event.host !== currentUserId;
    console.log(`current user ID: ${currentUserId}, Host: ${event.host}, isNotCreatedByUser: ${isNotCreatedByUser}`);
    return isNotCreatedByUser;
  });
});


// Check if users are friends or if a friend request is pending
const checkFriendStatus = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };

    // Check if they are friends
    const friendsResponse = await api.get(`/api/friends/${auth.currentUser.uid}`, { headers });
    isFriend.value = friendsResponse.data.some(friend => friend.id === props.userData.uid);

    // Check if there is a pending friend request if they are not friends
    if (!isFriend.value) {
      const requestsResponse = await api.get(`/api/friends/requests/${auth.currentUser.uid}`, { headers });
      isRequested.value = requestsResponse.data.some(
        request => request.senderId === auth.currentUser.uid && request.receiverId === props.userData.uid
      );
    } else {
      isRequested.value = false; // Reset request status if they are friends
    }
  } catch (error) {
    console.error("Error checking friend status:", error);
  }
};

// Toggle follow (send friend request or remove friend)
const toggleFollow = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };

    if (isFriend.value) {
      // Already friends, initiate friend removal
      await removeFriend();
    } else if (!isRequested.value) {
      // No existing request, send a friend request
      const response = await api.post(
        "/api/friends/request",
        { senderId: auth.currentUser.uid, receiverId: props.userData.uid },
        { headers }
      );
      if (response.status === 201) {
        isRequested.value = true; // Update UI to show request is sent
      }
    } else {
      // Request already sent, prevent duplicate
      alert("Friend request already sent");
    }
  } catch (error) {
    console.error("Error in toggleFollow:", error.response?.data || error);
  }
};

// Remove friend
const removeFriend = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    const headers = { Authorization: `Bearer ${token}` };

    await api.delete(`/api/friends/${auth.currentUser.uid}/remove/${props.userData.uid}`, { headers });
    isFriend.value = false; // Update UI to reflect friendship status
    isRequested.value = false; // Reset request status
  } catch (error) {
    console.error("Error removing friend:", error.response?.data || error);
  }
};

// Fetch friend status on mount
onMounted(() => {
  checkFriendStatus();
});

</script>

<style scoped>
/* Your existing styles */

/* Additional styles for debugging modal visibility */
.post-modal {
  display: flex;
  /* Ensure modal is visible */
}

/* Optional: Add cursor styles for better UX */
.post-item {
  cursor: pointer;
}

/* Toggle Buttons Styling */
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.edit-btn:hover {
  background-color: #E6C200;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.edit-btn:active {
  transform: scale(0.98);
}

.edit-btn.requested {
  background-color: #E6C200;
  /* Color for Requested state */
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
}

.post-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
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

.far.fa-thumbs-up {
  color: rgb(160, 160, 160);
}

.overlay .fa-thumbs-up {
  color: white;
}

.fa-thumbs-up {
  color: black;
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

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  width: 100%;
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

.post-footer {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.caption-container {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.avatar-caption {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.user-name-caption {
  font-weight: bold;
  margin-right: 5px;
  color: black;
}

.caption-text {
  margin-top: 6px;
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

.like-button:hover {
  transform: scale(1.05);
}

.like-button:active {
  transform: scale(0.98);
}

.thumbs-up-icon {
  color: grey;
  transition: color 0.2s ease;
  cursor: pointer;
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

/* Responsive adjustments */
@media (min-width: 767px) {
  .modal-content {
    flex-direction: row;
    max-width: 80vw;
    max-height: 80vh;
  }

  .modal-left {
    height: auto;
    flex: 1;
  }

  .modal-image {
    width: 100%;
    height: 100%;
    overflow: scroll;
  }

  .modal-right {
    padding: 20px;
    flex: 1;
  }

  .post-header {
    display: flex;
  }

  .user-name {
    font-size: 1.4rem;
  }

  .likes-caption,
  .like-button,
  .caption-text {
    font-size: 1.1rem;
  }

  .nav-arrow {
    font-size: 2.5rem;
  }
}

@media (max-width: 767px) {
  .modal-content {
    flex-direction: column;
    width: 100%;
    max-width: 350px;
    height: auto;
  }

  .modal-left,
  .modal-right {
    width: 100%;
  }

  .modal-right {
    padding: 10px;
  }

  .modal-left {
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-image {
    width: 100%;
    height: auto;
  }

  .avatar,
  .avatar-caption {
    width: 40px;
    height: 40px;
  }

  .user-name,
  .likes-caption {
    font-size: 1rem;
  }

  .like-button,
  .caption-text {
    font-size: 0.9rem;
  }

  .nav-arrow {
    font-size: 1.5rem;
  }

  /* Hide the post-header on small screens */
  .post-header {
    display: none;
  }
}
</style>
