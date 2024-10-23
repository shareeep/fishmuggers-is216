<template>
  <div class="pets-profile-container">
    <h2 class="text-2xl font-bold mb-6 text-center">Manage Your Pets</h2>

    <!-- Add New Pet Form -->
    <form @submit.prevent="addPet" enctype="multipart/form-data" class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Add New Pet</h3>
      
      <!-- Name -->
      <div class="mb-4">
        <label class="block text-gray-700">Name:</label>
        <input 
          v-model="newPet.name" 
          type="text" 
          required 
          class="border border-gray-300 rounded-md py-2 px-4 w-full"
        />
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
        <input 
          v-model="newPet.breed" 
          type="text" 
          required 
          class="border border-gray-300 rounded-md py-2 px-4 w-full"
        />
      </div>

      <!-- Age -->
      <div class="mb-4">
        <label class="block text-gray-700">Age:</label>
        <input 
          v-model.number="newPet.age" 
          type="number" 
          min="0" 
          required 
          class="border border-gray-300 rounded-md py-2 px-4 w-full"
        />
      </div>

      <!-- Profile Image -->
      <div class="mb-4">
        <label class="block text-gray-700">Profile Image:</label>
        <input 
          type="file" 
          @change="handleNewPetFileUpload" 
          accept="image/*"
          class="border border-gray-300 rounded-md py-2 px-4 w-full"
        />
        <!-- Image Preview -->
        <div v-if="newPetImageUrl" class="mt-4">
          <p class="text-gray-700 mb-2">Image Preview:</p>
          <img :src="newPetImageUrl" alt="Pet Image" class="w-32 h-32 rounded-full">
        </div>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        class="bg-green-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-green-600 transition"
        :disabled="isAdding"
      >
        {{ isAdding ? 'Adding...' : 'Add Pet' }}
      </button>

      <!-- Success and Error Messages -->
      <p v-if="addPetSuccess" class="mt-4 text-sm text-green-500 text-center">{{ addPetSuccess }}</p>
      <p v-if="addPetError" class="mt-4 text-sm text-red-500 text-center">{{ addPetError }}</p>
    </form>

    <!-- List of Pets -->
    <div v-if="pets.length">
      <h3 class="text-xl font-semibold mb-4">Your Pets</h3>
      <div v-for="pet in pets" :key="pet.id" class="mb-6 p-4 bg-gray-100 rounded-md">
        <div class="flex items-center">
          <img :src="pet.profileImage || 'https://via.placeholder.com/150?text=No+Image'" alt="Pet Image" class="w-24 h-24 rounded-full mr-4">
          <div>
            <p><strong>Name:</strong> {{ pet.name }}</p>
            <p><strong>Type:</strong> {{ pet.type }}</p>
            <p><strong>Breed:</strong> {{ pet.breed }}</p>
            <p><strong>Age:</strong> {{ pet.age }}</p>
            <button 
              @click="openEditModal(pet)" 
              class="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
            >
              Edit Pet
            </button>
            <button 
              @click="deletePet(pet.id)" 
              class="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete Pet
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-center text-gray-700">You have no pets yet.</p>

    <!-- Edit Pet Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content">
        <h3 class="text-xl font-semibold mb-4">Edit Pet</h3>
        <form @submit.prevent="updatePet" enctype="multipart/form-data">
          <!-- Name -->
          <div class="mb-4">
            <label class="block text-gray-700">Name:</label>
            <input 
              v-model="editPetData.name" 
              type="text" 
              required 
              class="border border-gray-300 rounded-md py-2 px-4 w-full"
            />
          </div>

          <!-- Type -->
          <div class="mb-4">
            <label class="block text-gray-700">Type:</label>
            <select v-model="editPetData.type" required class="border border-gray-300 rounded-md py-2 px-4 w-full">
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
            <input 
              v-model="editPetData.breed" 
              type="text" 
              required 
              class="border border-gray-300 rounded-md py-2 px-4 w-full"
            />
          </div>

          <!-- Age -->
          <div class="mb-4">
            <label class="block text-gray-700">Age:</label>
            <input 
              v-model.number="editPetData.age" 
              type="number" 
              min="0" 
              required 
              class="border border-gray-300 rounded-md py-2 px-4 w-full"
            />
          </div>

          <!-- Profile Image -->
          <div class="mb-4">
            <label class="block text-gray-700">Profile Image:</label>
            <input 
              type="file" 
              @change="handleEditPetFileUpload" 
              accept="image/*"
              class="border border-gray-300 rounded-md py-2 px-4 w-full"
            />
            <!-- Image Preview -->
            <div v-if="editPetImageUrl" class="mt-4">
              <p class="text-gray-700 mb-2">New Image Preview:</p>
              <img :src="editPetImageUrl" alt="New Pet Image" class="w-32 h-32 rounded-full">
            </div>
            <div v-else class="mt-4">
              <p class="text-gray-700 mb-2">Current Image:</p>
              <img :src="currentEditPet.profileImage || 'https://via.placeholder.com/150?text=No+Image'" alt="Current Pet Image" class="w-32 h-32 rounded-full">
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-600 transition"
            :disabled="isUpdating"
          >
            {{ isUpdating ? 'Updating...' : 'Update Pet' }}
          </button>

          <!-- Success and Error Messages -->
          <p v-if="updatePetSuccess" class="mt-4 text-sm text-green-500 text-center">{{ updatePetSuccess }}</p>
          <p v-if="updatePetError" class="mt-4 text-sm text-red-500 text-center">{{ updatePetError }}</p>
        </form>
        <button @click="closeEditModal" class="mt-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
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

const showEditModal = ref(false);
const currentEditPet = ref(null);
const editPetData = ref({
  name: '',
  type: '',
  breed: '',
  age: 0
});
const editPetImage = ref(null);
const editPetImageUrl = ref('');
const isUpdating = ref(false);
const updatePetSuccess = ref('');
const updatePetError = ref('');

// Function to handle file upload and preview for adding a new pet
const handleNewPetFileUpload = (event) => {
  newPetImage.value = event.target.files[0];
  if (newPetImage.value) {
    newPetImageUrl.value = URL.createObjectURL(newPetImage.value);
  } else {
    newPetImageUrl.value = '';
  }
};

// Function to handle file upload and preview for editing a pet
const handleEditPetFileUpload = (event) => {
  editPetImage.value = event.target.files[0];
  if (editPetImage.value) {
    editPetImageUrl.value = URL.createObjectURL(editPetImage.value);
  } else {
    editPetImageUrl.value = '';
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
    const response = await axios.post('/api/pets', formData, {
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

// Function to delete a pet
const deletePet = async (petId) => {
  if (!confirm('Are you sure you want to delete this pet?')) {
    return;
  }

  try {
    await axios.delete(`/api/pets/${petId}`);
    // Refresh pets list
    await fetchPets();
  } catch (error) {
    console.error('Error deleting pet:', error);
    alert('Failed to delete pet. Please try again.');
  }
};

// Function to open the edit modal with the selected pet's data
const openEditModal = (pet) => {
  showEditModal.value = true;
  currentEditPet.value = pet;
  editPetData.value = {
    name: pet.name,
    type: pet.type,
    breed: pet.breed,
    age: pet.age
  };
  editPetImage.value = null;
  editPetImageUrl.value = '';
  updatePetSuccess.value = '';
  updatePetError.value = '';
};

// Function to close the edit modal
const closeEditModal = () => {
  showEditModal.value = false;
  currentEditPet.value = null;
  editPetData.value = {
    name: '',
    type: '',
    breed: '',
    age: 0
  };
  editPetImage.value = null;
  editPetImageUrl.value = '';
  updatePetSuccess.value = '';
  updatePetError.value = '';
};

// Function to update a pet's details
const updatePet = async () => {
  updatePetSuccess.value = '';
  updatePetError.value = '';

  if (!currentEditPet.value) {
    updatePetError.value = 'No pet selected for editing.';
    return;
  }

  try {
    isUpdating.value = true;

    // Prepare form data
    const formData = new FormData();
    formData.append('name', editPetData.value.name);
    formData.append('type', editPetData.value.type);
    formData.append('breed', editPetData.value.breed);
    formData.append('age', editPetData.value.age);
    if (editPetImage.value) {
      formData.append('profileImage', editPetImage.value);
    }

    // Send PUT request to update pet
    const response = await axios.put(`/api/pets/${currentEditPet.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    updatePetSuccess.value = response.data.message;

    // Refresh pets list
    await fetchPets();

    // Close modal after a short delay
    setTimeout(() => {
      closeEditModal();
    }, 1500);
  } catch (error) {
    console.error('Error updating pet:', error);
    if (error.response && error.response.data && error.response.data.message) {
      updatePetError.value = error.response.data.message;
    } else {
      updatePetError.value = 'Failed to update pet. Please try again.';
    }
  } finally {
    isUpdating.value = false;
  }
};

// Fetch pets on component mount
onMounted(() => {
  fetchPets();
});
</script>

<style scoped>
.pets-profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pets-profile-container h2,
.pets-profile-container h3 {
  color: #2b6cb0;
}

.pets-profile-container form {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.pets-profile-container img {
  object-fit: cover;
}

.pets-profile-container button {
  transition: background-color 0.3s;
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
  color: #2b6cb0;
}

.modal-content button {
  transition: background-color 0.3s;
}
</style>