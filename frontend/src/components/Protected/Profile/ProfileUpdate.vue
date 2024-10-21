<template>
  <div class="profile-update">
    <h2 class="text-2xl font-bold mb-6 text-center">Update Profile</h2>
    
    <!-- Current Profile Information -->
    <div class="current-info mb-6 p-4 bg-gray-100 rounded-md">
      <h3 class="text-lg font-semibold mb-2">Current Profile Information</h3>
      <div class="flex items-center mb-2">
        <img 
          :src="userData.profileImage || 'default-profile.png'" 
          alt="Current Profile Image" 
          class="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <p><strong>Email:</strong> {{ userData.email }}</p>
          <p><strong>User ID:</strong> {{ userData.userID }}</p>
          <p><strong>Points:</strong> {{ userData.points }}</p>
          <p><strong>Joined Events:</strong> 
            <span v-if="userData.joinedEvents.length">
              <span v-for="(event, index) in userData.joinedEvents" :key="index">
                {{ event }}<span v-if="index < userData.joinedEvents.length - 1">, </span>
              </span>
            </span>
            <span v-else>No events joined.</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Update Form -->
    <form @submit.prevent="handleProfileUpdate" enctype="multipart/form-data">
      <!-- Email Field -->
      <div class="mb-4">
        <label class="block text-gray-700">Email:</label>
        <input 
          v-model="email" 
          type="email" 
          required 
          class="border border-gray-300 rounded-md py-2 px-4 w-full"
        />
      </div>

      <!-- User ID Field -->
      <div class="mb-4">
        <label class="block text-gray-700">User ID:</label>
        <input 
          v-model="userID" 
          type="text" 
          required 
          class="border border-gray-300 rounded-md py-2 px-4 w-full"
        />
      </div>

      <!-- Profile Image Field -->
      <div class="mb-4">
        <label class="block text-gray-700">Profile Image:</label>
        <input 
          type="file" 
          @change="handleFileUpload" 
          accept="image/*"
          class="border border-gray-300 rounded-md py-2 px-4 w-full"
        />
        <!-- New Image Preview -->
        <div v-if="newProfileImage" class="mt-4">
          <p class="text-gray-700 mb-2">New Profile Image Preview:</p>
          <img :src="newProfileImageUrl" alt="New Profile Image" class="w-16 h-16 rounded-full">
        </div>
      </div>

      <!-- Points Field -->
      <div class="mb-4">
        <label class="block text-gray-700">Points:</label>
        <input 
          v-model.number="points" 
          type="number" 
          min="0"
          class="border border-gray-300 rounded-md py-2 px-4 w-full"
        />
      </div>

      <!-- Joined Events Field -->
      <div class="mb-4">
        <label class="block text-gray-700">Joined Events:</label>
        <div class="flex flex-wrap">
          <div 
            v-for="(event, index) in joinedEvents" 
            :key="index" 
            class="flex items-center mr-2 mb-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
          >
            {{ event }}
            <button type="button" @click="removeEvent(index)" class="ml-2 text-red-500 hover:text-red-700">
              &times;
            </button>
          </div>
        </div>
        <!-- Add New Event -->
        <div class="flex mt-2">
          <input 
            v-model="newEvent" 
            type="text" 
            placeholder="Add new event ID" 
            class="border border-gray-300 rounded-md py-2 px-4 w-full mr-2"
          />
          <button 
            type="button" 
            @click="addEvent" 
            class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        class="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-700 transition"
      >
        Update Profile
      </button>

      <!-- Success and Error Messages -->
      <p v-if="successMessage" class="mt-4 text-sm text-green-500 text-center">{{ successMessage }}</p>
      <p v-if="errorMessage" class="mt-4 text-sm text-red-500 text-center">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios'; // Ensure axios is installed: npm install axios
import { getAuth } from 'firebase/auth';
import { useRouter } from 'vue-router';

const auth = getAuth();
const router = useRouter();

// State Variables
const email = ref('');
const userID = ref('');
const profileImage = ref(null);
const newProfileImage = ref(null);
const newProfileImageUrl = ref('');
const points = ref(0);
const joinedEvents = ref([]);
const newEvent = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const userData = ref({
  email: '',
  userID: '',
  profileImage: '',
  points: 0,
  joinedEvents: []
});

// Function to handle file upload
const handleFileUpload = (event) => {
  profileImage.value = event.target.files[0];
  if (profileImage.value) {
    newProfileImage.value = URL.createObjectURL(profileImage.value);
    newProfileImageUrl.value = newProfileImage.value;
  } else {
    newProfileImageUrl.value = '';
  }
};

// Function to add a new event
const addEvent = () => {
  const trimmedEvent = newEvent.value.trim();
  if (trimmedEvent && !joinedEvents.value.includes(trimmedEvent)) {
    joinedEvents.value.push(trimmedEvent);
    newEvent.value = '';
  }
};

// Function to remove an event
const removeEvent = (index) => {
  joinedEvents.value.splice(index, 1);
};

// Function to handle profile update
const handleProfileUpdate = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  const currentUser = auth.currentUser;
  if (!currentUser) {
    errorMessage.value = 'User not authenticated.';
    return;
  }

  const formData = new FormData();
  formData.append('email', email.value);
  formData.append('userID', userID.value);
  formData.append('points', points.value);
  formData.append('joinedEvents', JSON.stringify(joinedEvents.value)); // Send as JSON string
  if (profileImage.value) {
    formData.append('profileImage', profileImage.value);
  }

  try {
    // Get ID Token
    const idToken = await currentUser.getIdToken(/* forceRefresh */ true);

    const response = await axios.put(`http://localhost:3000/api/users/${currentUser.uid}`, formData, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    successMessage.value = response.data.message;

    // Optionally, refresh the user data
    fetchUserData();
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Failed to update profile. Please try again.';
    }
  }
};

// Function to fetch current user data
const fetchUserData = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return;
  }

  try {
    // Get ID Token
    const idToken = await currentUser.getIdToken(/* forceRefresh */ true);

    const response = await axios.get(`http://localhost:3000/api/users/byUserID/${currentUser.uid}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });

    userData.value = response.data;

    // Prefill form fields
    email.value = userData.value.email;
    userID.value = userData.value.userID;
    points.value = userData.value.points;
    joinedEvents.value = userData.value.joinedEvents;

    // Optionally, set the profile image URL
    newProfileImageUrl.value = userData.value.profileImage || '';
  } catch (error) {
    console.error('Error fetching user data:', error);
    errorMessage.value = 'Failed to fetch user data.';
  }
};

// Fetch user data on component mount
import { onMounted } from 'vue';

onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.profile-update {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.current-info img {
  object-fit: cover;
}

.current-info p {
  margin: 0.25rem 0;
}
</style>
