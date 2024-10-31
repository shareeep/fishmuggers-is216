<template>
 
  <div class="profile-update">
    <h2 class="text-2xl font-bold mb-6 text-center">Update Profile</h2>
    
    <!-- Current Profile Information -->
    <div class="current-info mb-6 p-4 bg-gray-100 rounded-md">
      <h3 class="text-lg font-semibold mb-2">Current Profile Information</h3>
      <div class="flex items-center mb-2">
        <img 
          :src="userData.profileImage || 'https://via.placeholder.com/300?text=Profile+Image'" 
          alt="Current Profile Image" 
          class="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <p><strong>Email:</strong> {{ userData.email }}</p>
          <p><strong>Username:</strong> {{ userData.username }}</p>
          <p><strong>Points:</strong> {{ userData.points }}</p>
          <p><strong>Joined Events:</strong> 
            <span v-if="userData.joinedEvents.length">
              <span v-for="(event, index) in userData.joinedEvents" :key="index">
                {{ event }}<span v-if="index < userData.joinedEvents.length - 1">, </span>
              </span>
            </span>
            <span v-else> No events joined.</span>
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

      <!-- Username Field -->
      <div class="mb-4">
        <label class="block text-gray-700">Username:</label>
        <input 
          v-model="username" 
          type="text" 
          required 
          class="border border-gray-300 rounded-md py-2 px-4 w-full"
          @blur="checkUsername"
        />
        <p v-if="usernameError" class="text-red-500 text-sm mb-4">{{ usernameError }}</p>
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
        <div v-if="newProfileImageUrl" class="mt-4">
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
          readonly
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
          <button type="button" @click="addEvent" class="edit-btn">Add</button>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="edit-btn w-full" :disabled="isSubmitting">
        {{ isSubmitting ? 'Updating...' : 'Update Profile' }}
      </button>

      <!-- Success and Error Messages -->
      <p v-if="successMessage" class="mt-4 text-sm text-green-500 text-center">{{ successMessage }}</p>
      <p v-if="errorMessage" class="mt-4 text-sm text-red-500 text-center">{{ errorMessage }}</p>
    </form>
  </div>
</template>

 
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Ensure axios is installed: npm install axios
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
  points: 0,
  pets: [],
  joinedEvents: []
});
const email = ref('');
const username = ref('');
const profileImage = ref(null);
const newProfileImageUrl = ref('');
const points = ref(0);
const joinedEvents = ref([]);
const newEvent = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const usernameError = ref('');
const isSubmitting = ref(false);

// Regular expression for username validation
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

// Function to check if the username is already taken
const isUsernameTaken = async (desiredUsername) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/users/checkUsername`, {
      params: { username: desiredUsername },
      headers: {
        'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
      }
    });
    return response.data.isTaken;
  } catch (error) {
    console.error('Error checking username:', error);
    throw error;
  }
};

// Function to validate the username format
const validateUsername = (desiredUsername) => {
  if (!usernameRegex.test(desiredUsername)) {
    usernameError.value = 'Username must be 3-20 characters long and can include letters, numbers, and underscores.';
    return false;
  }
  usernameError.value = '';
  return true;
};

// Function to check username uniqueness on blur (optional)
const checkUsername = async () => {
  const desiredUsername = username.value.trim();
  if (!validateUsername(desiredUsername)) {
    return;
  }
  
  try {
    const taken = await isUsernameTaken(desiredUsername);
    if (taken && desiredUsername !== userData.value.username) { // Allow if username is unchanged
      usernameError.value = 'Username is already taken. Please choose another one.';
    } else {
      usernameError.value = '';
    }
  } catch (error) {
    console.error('Error checking username:', error);
    usernameError.value = 'Unable to verify username at this time.';
  }
};

// Function to handle file upload and preview
const handleFileUpload = (event) => {
  profileImage.value = event.target.files[0];
  if (profileImage.value) {
    newProfileImageUrl.value = URL.createObjectURL(profileImage.value);
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
  
  const desiredUsername = username.value.trim();
  
  // Validate username format
  if (!validateUsername(desiredUsername)) {
    return;
  }
  
  // Check if username is taken (if changed)
  try {
    isSubmitting.value = true;
    const taken = await isUsernameTaken(desiredUsername);
    if (taken && desiredUsername !== userData.value.username) { // Allow if username is unchanged
      usernameError.value = 'Username is already taken. Please choose another one.';
      isSubmitting.value = false;
      return;
    }
  } catch (error) {
    console.error('Error checking username:', error);
    errorMessage.value = 'Unable to verify username. Please try again later.';
    isSubmitting.value = false;
    return;
  }
  
  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('email', email.value);
    formData.append('username', desiredUsername);
    formData.append('points', points.value);
    formData.append('joinedEvents', JSON.stringify(joinedEvents.value));
    if (profileImage.value) {
      formData.append('profileImage', profileImage.value);
    }

    // Send PUT request to Express.js backend to update profile
    const response = await axios.put(`http://localhost:3000/api/users/${currentUser.uid}`, formData, {
      headers: {
        'Authorization': `Bearer ${await currentUser.getIdToken()}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    successMessage.value = 'Profile updated successfully!';
    
    // Optionally, refresh the user data
    fetchUserData();
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Failed to update profile. Please try again.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

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
    email.value = response.data.email || '';
    username.value = response.data.username || '';
    points.value = response.data.points || 0;
    joinedEvents.value = response.data.joinedEvents || [];
    newProfileImageUrl.value = response.data.profileImage || '';
  } catch (error) {
    console.error('Error fetching user data:', error);
    errorMessage.value = 'Failed to fetch user data.';
  }
};

// Fetch user data on component mount
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

.current-info {
  display: flex;
  align-items: center;
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
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
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.edit-btn:hover {
  background-color: #E6C200;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.edit-btn:active {
  transform: scale(0.98);
}

.edit-btn:disabled {
  background-color: #e6c200;
  cursor: not-allowed;
  opacity: 0.7;
}

</style>