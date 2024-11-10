<template>
  <div class="pets-profile-container">
    <h2 class="text-2xl font-bold mb-6 text-center" style="color:black;">Manage Your Pets</h2>

    <!-- Add New Pet Form -->
    <form @submit.prevent="addPet" enctype="multipart/form-data" class="mb-8">
      <h3 class="text-xl font-semibold mb-4" style="color:black;">Add New Pet</h3>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-gray-700">Name:</label>
        <input v-model="newPet.name" type="text" required class="border border-gray-300 rounded-md py-2 px-4 w-full" />
      </div>

      <!-- Type -->
      <div class="mb-4">
        <label class="block text-gray-700">Type:</label>
        <select v-model="newPet.type" required class="border border-gray-300 rounded-md py-2 px-4 w-full">
          <option disabled value="">Select Type</option>
          <option>Dog</option>
          <option>Cat</option>
          <option>Bird</option>
          <option>Other</option>
        </select>
      </div>

      <!-- Breed -->
      <div class="mb-4">
        <label class="block text-gray-700">Breed:</label>
        <input v-model="newPet.breed" type="text" required class="border border-gray-300 rounded-md py-2 px-4 w-full" />
      </div>

      <!-- Age -->
      <div class="mb-4">
        <label class="block text-gray-700">Age:</label>
        <input v-model.number="newPet.age" type="number" min="0" required
          class="border border-gray-300 rounded-md py-2 px-4 w-full" />
      </div>

      <!-- Profile Image -->
      <div class="mb-4">
        <label class="block text-gray-700">Photo:</label>
        <input type="file" @change="handleNewPetFileUpload" accept="image/*"
          class="border border-gray-300 rounded-md py-2 px-4 w-full" />
        <!-- Image Preview -->
        <div v-if="newPetImageUrl" class="mt-4">
          <p class="text-gray-700 mb-2">Image Preview:</p>
          <img :src="newPetImageUrl" alt="Pet Image" class="w-32 h-32 rounded-full">
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="add-pet-btn w-full" :disabled="isAdding">
        {{ isAdding ? 'Adding...' : 'Add Pet' }}
      </button>

      <!-- Success and Error Messages -->
      <p v-if="addPetSuccess" class="mt-4 text-sm text-green-500 text-center">{{ addPetSuccess }}</p>
      <p v-if="addPetError" class="mt-4 text-sm text-red-500 text-center">{{ addPetError }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { getAuth } from 'firebase/auth';

// Initialize Firebase Auth
const auth = getAuth();

// Reactive variables
const pets = ref([]);
const newPet = ref({
  name: '',
  type: '',
  breed: '',
  age: 0
});
const newPetImage = ref(null);
const newPetImageUrl = ref('');
const isAdding = ref(false);
const addPetSuccess = ref('');
const addPetError = ref('');


// Function to handle file upload and preview for adding a new pet
const handleNewPetFileUpload = (event) => {
  newPetImage.value = event.target.files[0];
  if (newPetImage.value) {
    newPetImageUrl.value = URL.createObjectURL(newPetImage.value);
  } else {
    newPetImageUrl.value = '';
  }
};


// Function to add a new pet
const addPet = async () => {
  addPetSuccess.value = '';
  addPetError.value = '';

  const currentUser = auth.currentUser;
  if (!currentUser) {
    addPetError.value = 'User not authenticated.';
    return;
  }

  // Basic validation
  if (!newPet.value.name || !newPet.value.type || !newPet.value.breed || newPet.value.age < 0) {
    addPetError.value = 'Please provide valid pet details.';
    return;
  }

  try {
    isAdding.value = true;

    // Prepare form data
    const formData = new FormData();
    formData.append('name', newPet.value.name);
    formData.append('type', newPet.value.type);
    formData.append('breed', newPet.value.breed);
    formData.append('age', newPet.value.age);
    if (newPetImage.value) {
      formData.append('profileImage', newPetImage.value);
    }

    // Send POST request to add pet
    const response = await api.post('/api/pets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    addPetSuccess.value = response.data.message;

    // Reset form
    newPet.value = {
      name: '',
      type: '',
      breed: '',
      age: 0
    };
    newPetImage.value = null;
    newPetImageUrl.value = '';

    // Refresh pets list
    await fetchPets();
  } catch (error) {
    console.error('Error adding pet:', error);
    if (error.response && error.response.data && error.response.data.message) {
      addPetError.value = error.response.data.message;
    } else {
      addPetError.value = 'Failed to add pet. Please try again.';
    }
  } finally {
    isAdding.value = false;
  }
};

// Function to fetch pets
const fetchPets = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return;
  }

  try {
    const response = await api.get(`/api/users/${currentUser.uid}`);
    const userPets = response.data.pets || [];

    // Fetch pet details
    const petPromises = userPets.map(async (petId) => {
      const petResponse = await api.get(`/api/pets/${petId}`);
      return { id: petId, ...petResponse.data };
    });

    pets.value = await Promise.all(petPromises);
  } catch (error) {
    console.error('Error fetching pets:', error);
  }
};

// Fetch pets on component mount
onMounted(() => {
  fetchPets();
});
</script>


<style scoped>
.pets-profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 767px) {
  .pets-profile-container {
    max-width: 400px;
  }
}

.pets-profile-container h2,
.pets-profile-container h3 {
  color: #2b6cb0;
}

.pets-profile-container form {
  background-color: #ffffff;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.pets-profile-container img {
  object-fit: cover;
}

.pets-profile-container button {
  transition: background-color 0.3s;
}

.edit-btn,
.add-pet-btn {
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
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}

.delete-btn {
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  background-color:#ff7b7b;;
  color: #333;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transform: scale(1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}

.delete-btn:hover {
  background-color: #d06c6c;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.edit-btn:hover,
.add-pet-btn:hover {
  background-color: #E6C200;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.delete-btn:active,
.edit-btn:active,
.add-pet-btn:active {
  transform: scale(0.98);
}

.add-pet-btn:disabled {
  background-color: #e6c200;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.modal-content h3 {
  color: black;
}

.modal-content button {
  transition: background-color 0.3s;
}
</style>