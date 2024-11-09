<template>
  <div class="profile-page">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-picture">
        <img :src="userData.profileImage || 'https://via.placeholder.com/150?text=Profile+Image'" alt="Profile Picture"
          class="profile-image" />
      </div>
      <div class="profile-info">
        <div class="profile-details">
          <h2 class="username">{{ userData.username }}</h2>

          <!-- Conditional button display -->
          <button :class="['edit-btn', { 'requested': isRequested || isFriend }]"
            @click="isFriend ? removeFriend() : toggleFollow()" :disabled="isRequested && !isFriend">
            {{ isFriend ? 'Remove Friend' : (isRequested ? 'Friend Request Sent' : 'Follow') }}
          </button>
        </div>
        <div class="profile-stats">
          <span><b>{{ posts }}</b> Posts</span>
          <span><b>{{ userData.joinedEvents.length }}</b> Events Joined</span>
          <span><b>{{ friends }}</b> Friends</span>
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
        <div v-if="posts === 0" class="no-posts">
          <i class="no-posts-pic"><img src="../../../assets/images/camera.png" alt=""></i>
          <h3>No posts yet</h3>
        </div>
        <div v-else class="posts-grid">
          <div v-for="(post, index) in userData.posts" :key="post.id" class="post-item" @click="openModal(index)">
            <img :src="post.image" alt="User Post" class="post-image" />
            <div class="overlay">
              <i class="fas fa-thumbs-up"></i>
               <span class="likes-count">{{ post.likes.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="isModalOpen && userData.posts[selectedPostIndex]" class="post-modal" @click.self="closeModal">
        <div class="modal-content">

          <div class="modal-left">
            <img :src="userData.posts[selectedPostIndex].image" alt="Selected Post" class="modal-image" />
          </div>

          <div class="modal-right">

            <div class="post-header">
              <div class="user-info">
                <img :src="userData.profileImage || 'https://via.placeholder.com/50?text=Avatar'" alt="User Avatar"
                  class="avatar" />
                <h3 class="user-name">{{ userData.username }}</h3>
              </div>
            </div>

            <div class="post-footer">
              <div class="caption-container">
                <img :src="userData.profileImage || 'https://via.placeholder.com/50?text=Avatar'" alt="User Avatar"
                  class="avatar-caption" />
                <span class="caption-text">
                  <span class="user-name-caption">{{ userData.username }}</span>
                  {{ userData.posts[selectedPostIndex].caption }}
                </span>
              </div>

              <div class="likes-container">
                <p class="likes-caption">{{ userData.posts[selectedPostIndex].likes.length }} Likes</p>

<button @click="handleLikeToggle(userData.posts[selectedPostIndex])" :class="['like-button', { 'liked': userData.posts[selectedPostIndex].isLiked }]">
  <i class="fas fa-thumbs-up"></i> {{ userData.posts[selectedPostIndex].isLiked ? 'Unlike' : 'Like' }}
</button>


              </div>
            </div>
          </div>

          <!-- Navigation Arrows and Close Button -->
          <i class="fas fa-chevron-left nav-arrow" @click="selectedPostIndex > 0 && prevPost()"
            :class="{ disabled: selectedPostIndex === 0 }" />
          <i class="fas fa-chevron-right nav-arrow" @click="selectedPostIndex < userData.posts.length - 1 && nextPost()"
            :class="{ disabled: selectedPostIndex === userData.posts.length - 1 }" />
          <i class="fas fa-times close-modal" @click="closeModal"></i>
        </div>
      </div>

<!-- PETS -->
<div v-if="activeTab === 'pets'">
  <!-- Conditionally render Manage Pets button if viewing own profile -->
  <router-link v-if="isOwnProfile" to="/manage-pets">
    <button class="edit-btn">Manage Pets</button>
  </router-link>
  
  <div class="pets-wrapper">
    <!-- Check if there are pets to display -->
    <div v-if="pets.length > 0" class="pets-grid">
      <div v-for="(pet, index) in pets" :key="index" class="pet-card"
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
      <i class="no-pets-pic"><img src="../../../assets/images/no-events.png" alt=""></i>
      <h3>No pets yet</h3>
    </div>
  </div>
</div>

      <!-- EVENTS JOINED -->
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
          <CreatedEventsList :events="userData.createdEvents" @edit-event="handleEditEvent" @delete-event="deleteEvent" />
        </div>
        <div v-if="eventsView === 'joinedEvents'">
          <JoinedEventsList 
            :events="userData.joinedEvents" 
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';
import JoinedEventsList from '../EventsAdmin/JoinedEventsList.vue';
import CreatedEventsList from '../EventsAdmin/CreatedEventsList.vue';

const auth = getAuth();
const router = useRouter();

// Define props to accept data from FriendProfile.vue
const props = defineProps({
  userId: {
    type: [String, Number],
    required: true
  },
  username: {
    type: String,
    default: 'User'
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150?text=Profile+Image'
  },
  isOwnProfile: {
    type: Boolean,
    default: true
  }
});

// Initialize userData with fallback default values
const userData = ref({
  username: props.username || "Unknown User",
  profileImage: props.avatar || "https://via.placeholder.com/150?text=Profile+Image",
  joinedEvents: [],
  createdEvents: [], // Added to handle created events
  posts: []
});

const friends = ref(0); // Placeholder for the friends count
const posts = ref(userData.value.posts.length);
const activeTab = ref('posts');
const selectedPostIndex = ref(0);
const isModalOpen = ref(false);

// Placeholder for the pets 
const pets = ref([
  // Example pet data
  // { name: 'Woofie', type: 'Dog', breed: 'Golden Retriever', age: 3, image: 'https://via.placeholder.com/150?text=Dog' },
  // { name: 'Meowers', type: 'Cat', breed: 'Siamese', age: 2, image: 'https://via.placeholder.com/150?text=Cat' }
]);

// Additional events view state
const eventsView = ref('createdEvents');

// Fetch user data from the backend
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
      axios.get(`/api/users/${props.userId}`, { headers }),
      axios.get(`/api/posts/user/${props.userId}/posts`, { headers }),
      axios.get(`/api/events/created/${props.userId}`, { headers }),
      axios.get(`/api/events/joined/${props.userId}`, { headers }),
      axios.get(`/api/pets/user/${props.userId}`, { headers }),
    ]);

    userData.value = {
      ...userData.value,
      ...userResponse.data,
    };

    // Set posts data and add `isLiked` property based on the user's likes
    userData.value.posts = (postsResponse.data || []).map(post => ({
      ...post,
      isLiked: post.likes.includes(auth.currentUser.uid), // Set isLiked based on user's ID in likes array
    }));

    posts.value = userData.value.posts.length; // Update posts count
    userData.value.createdEvents = createdEventsResponse.data || [];
    userData.value.joinedEvents = joinedEventsResponse.data || [];
    pets.value = petsResponse.data || [];

    // Debugging logs
    console.log("User Data:", userData.value);
    console.log("Posts:", userData.value.posts);
    console.log("Created Events:", userData.value.createdEvents);
    console.log("Joined Events:", userData.value.joinedEvents);
    console.log("Pets:", pets.value);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};


// Friend request and friendship status
const isRequested = ref(false); // Track if a request is pending
const isFriend = ref(false); // Track friendship status

// Check if users are friends or if a friend request is pending
const checkFriendStatus = async () => {
  try {
    const token = await auth.currentUser.getIdToken();

    // Check if they are friends
    const friendsResponse = await axios.get(`/api/friends/${auth.currentUser.uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    isFriend.value = friendsResponse.data.some(friend => friend.id === props.userId);

    // Check if there is a pending friend request
    if (!isFriend.value) {
      const requestsResponse = await axios.get(`/api/friends/requests/${auth.currentUser.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Set isRequested to true if there's a pending request from current user to this user
      isRequested.value = requestsResponse.data.some(request => 
        request.senderId === auth.currentUser.uid && 
        request.receiverId === props.userId &&
        request.status === "pending" // Ensure the request status is "pending"
      );
    }
  } catch (error) {
    console.error("Error checking friend or request status:", error);
  }
};

// Toggle follow (send friend request or remove friend)
async function toggleFollow() {
  try {
    const token = await auth.currentUser.getIdToken();

    // Check if there is an existing request
    if (isRequested.value) {
      alert("You already have a pending friend request with this user.");
      return; // Stop further actions if there's an existing request
    }

    if (isFriend.value) {
      // Remove friend if already friends
      await axios.delete(`/api/friends/${auth.currentUser.uid}/remove/${props.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      isFriend.value = false; // Update UI
    } else {
      // Send follow request if not already requested
      const response = await axios.post(
        "/api/friends/request",
        { senderId: auth.currentUser.uid, receiverId: props.userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        isRequested.value = true; // Disable button after request is sent
      }
    }
  } catch (error) {
    console.error("Error in follow/unfollow action:", error.response?.data || error);
    alert("Friend request already sent");
  }
};

// Remove friend method
const removeFriend = async () => {
  try {
    const token = await auth.currentUser.getIdToken();
    await axios.delete(`/api/friends/${auth.currentUser.uid}/remove/${props.userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    isFriend.value = false;
  } catch (error) {
    console.error("Error removing friend:", error.response?.data || error);
  }
};

// Handle event edit (if applicable)
const handleEditEvent = (event) => {
  // Implement your edit event logic here
};

// Handle event deletion (if applicable)
const deleteEvent = (eventId) => {
  // Implement your delete event logic here
};

// Modal handling for posts
const openModal = (index) => {
  console.log(`Post clicked. Index: ${index}`); // Debugging Line
  if (userData.value.posts[index]) {
    selectedPostIndex.value = index;
    isModalOpen.value = true;
    console.log(`Modal opened for post index: ${index}`); // Debugging Line
  } else {
    console.error(`Post at index ${index} does not exist.`);
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

const prevPost = () => {
  if (selectedPostIndex.value > 0) {
    selectedPostIndex.value--;
  } else {
    selectedPostIndex.value = userData.value.posts.length - 1;
  }
};

const nextPost = () => {
  if (selectedPostIndex.value < userData.value.posts.length - 1) {
    selectedPostIndex.value++;
  } else {
    selectedPostIndex.value = 0;
  }
};
// Like Post Method
const handleLikeToggle = async (post) => {
  if (!auth.currentUser) {
    alert("You need to be logged in to like posts.");
    return;
  }

  const userId = auth.currentUser.uid;
  const isLiked = post.likes.includes(userId);
  
  try {
    const token = await auth.currentUser.getIdToken();
    
    // Toggle like/unlike on the backend
    await axios.post(
      `/api/posts/${post.postId}/like`,
      { like: !isLiked, userId: userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update likes locally
    if (isLiked) {
      post.likes = post.likes.filter(id => id !== userId); // Unlike
    } else {
      post.likes.push(userId); // Like
    }
    post.isLiked = !isLiked; // Toggle isLiked status for the UI

  } catch (error) {
    console.error("Error toggling like:", error.response?.data || error);
    alert("Unable to toggle like. Please try again.");
  }
};


// Fetch data on component mount
onMounted(() => {
  fetchUserData();
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
  grid-template-columns: repeat(2, 1fr);
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
  color: #333; /* Default color for text and icon */
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;
}

.like-button i {
  margin-right: 5px;
  color: #333; /* Default icon color */
  transition: color 0.3s ease;
}

/* Hover effect for the like button */
.like-button:hover {
  color: #007bff; /* Hover color for text */
  transform: scale(1.05); /* Slightly enlarge on hover */
}

.like-button:hover i {
  color: #007bff; /* Hover color for icon */
}

/* Active state for pressing the button */
.like-button:active {
  transform: scale(0.95); /* Slightly shrink when clicked */
}

/* Styling when the post is liked */
.like-button.liked {
  color: #ff4500; /* Liked color for text */
}

.like-button.liked i {
  color: #ff4500; /* Liked color for icon */
}

/* Add a subtle shadow to the button when liked */
.like-button.liked {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
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
