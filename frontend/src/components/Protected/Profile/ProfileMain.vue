<template>
  <div class="profile-page">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-picture">
        <img
          :src="userData.profileImage || 'https://via.placeholder.com/300?text=Profile+Image'"
          alt="Profile Picture"
          class="profile-image" 
        />
      </div>
      <div class="profile-info">
        <div class="profile-details">
          <h2 class="username">{{ userData.username }}</h2>
          <!--Go to ProfileUpdate.vue-->
          <router-link to="/editprofile">
            <button class="edit-btn">Edit profile</button>
          </router-link>
        </div>
        <div class="profile-stats">
          <!--Need posts and friends num-->
          <span>{{ posts }} posts</span> 
          <span>{{ userData.joinedEvents.length }} events joined</span>
          <span>{{ friends }} friends</span>
        </div>
      </div>
    </div>

    <!-- Profile Tabs -->
    <div class="profile-tabs">
      <button :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">Posts</button>
      <button :class="{ active: activeTab === 'eventsJoined' }" @click="activeTab = 'eventsJoined'">Events Joined</button>
      <button :class="{ active: activeTab === 'pets' }" @click="activeTab = 'pets'">Pets</button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <div v-if="activeTab === 'posts'">
        <p>Share your first post</p>
      </div>
      <div v-if="activeTab === 'eventsJoined'">
        <p>No events joined</p>
      </div>
      <div v-if="activeTab === 'pets'">
        <router-link to="/addpets">
            <button class="edit-btn">Add Pets</button>
          </router-link>
        <div v-for="(pet, index) in pets" :key="index" class="pet-card">
          <img :src="pet.image" alt="Pet Image" class="pet-image" />
          <div class="pet-info">
            <h3>{{ pet.name }}</h3>
            <p>Type: {{ pet.type }}</p>
            <p>Breed: {{ pet.breed }}</p>
            <p>Age: {{ pet.age }} years</p>
          </div>
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

// Initialize Firebase Auth
const auth = getAuth();
const router = useRouter();

// Reactive variables
const userData = ref({
  email: '',
  username: '',
  profileImage: '',
  pets: [],
  joinedEvents: [],
});

const posts = ref(0); // Placeholder for post count
const friends = ref(7); // Placeholder for friends count

// Set the default active tab
const activeTab = ref('posts');

// Placeholder pets data
const pets = ref([
  {
    name: 'Woofie',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    image: 'https://via.placeholder.com/150?text=Dog'
  },
  {
    name: 'Meowers',
    type: 'Cat',
    breed: 'Siamese',
    age: 2,
    image: 'hhttps://via.placeholder.com/150?text=Cat'
  }
]);

// Function to fetch current user data
const fetchUserData = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return;
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/users/${currentUser.uid}`, {
      headers: {
        'Authorization': `Bearer ${await currentUser.getIdToken()}`
      }
    });

    userData.value = response.data;
    posts.value = response.data.posts ? response.data.posts.length : 0;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

// Fetch user data on component mount
onMounted(() => {
  fetchUserData();
});
</script>


<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 10px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.profile-picture {
  margin-bottom: 15px;
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info {
  text-align: center;
}

.profile-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.username {
  font-size: 20px;
  font-weight: bold;
}

.edit-btn, .archive-btn {
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  margin: 5px;
}

.profile-stats {
  display: flex;
  gap: 10px;
  font-size: 14px;
  margin: 10px 0;
}

.profile-tabs {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #ddd;
  padding: 10px;
}

.profile-tabs button {
  background: none;
  border: none;
  font-size: 14px;
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

/* Pet Cards Styling */
/* Pet Cards Container */
.pet-cards-container {
  display: flex;
  justify-content: center;
  gap: 20px; /* Space between cards */
  flex-wrap: wrap; /* Allows wrapping to a new line on small screens */
  padding: 20px 0;
}

/* Pet Card */
.pet-card {
  width: 180px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Pet Image */
.pet-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

/* Pet Details */
.pet-details {
  margin-top: 10px;
}

.pet-details h3 {
  font-size: 18px;
  margin-bottom: 5px;
}

.pet-details p {
  font-size: 14px;
  margin: 2px 0;
}

/* Responsive Styling */
@media (min-width: 600px) {
  .profile-header {
    flex-direction: row;
    justify-content: center;
    text-align: left;
  }

  .profile-picture {
    margin-right: 20px;
  }

  .profile-image {
    width: 100px;
    height: 100px;
  }

  .profile-info {
    flex: 1;
  }

  .profile-details {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .profile-stats {
    gap: 20px;
    font-size: 16px;
  }

  .profile-tabs button {
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .profile-page {
    max-width: 800px;
    padding: 20px;
  }

  .profile-image {
    width: 120px;
    height: 120px;
  }

  .username {
    font-size: 24px;
  }

  .tab-content {
    font-size: 18px;
  }
}
</style>
