<template>
    <div class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-content">
            <button class="close-button" @click="$emit('close')">✕</button>
            <h3 class="text-xl font-semibold mb-4 text-center">Edit Pet</h3>
            <form @submit.prevent="updatePet" enctype="multipart/form-data">

                <!-- Name -->
                <div class="mb-4">
                    <label class="block text-gray-700">Name:</label>
                    <input v-model="editPetData.name" type="text" required
                        class="border border-gray-300 rounded-md py-2 px-4 w-full" />
                </div>

                <!-- Type -->
                <div class="mb-4">
                    <label class="block text-gray-700">Type:</label>
                    <select v-model="editPetData.type" required
                        class="border border-gray-300 rounded-md py-2 px-4 w-full">
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
                    <input v-model="editPetData.breed" type="text" required
                        class="border border-gray-300 rounded-md py-2 px-4 w-full" />
                </div>

                <!-- Age -->
                <div class="mb-4">
                    <label class="block text-gray-700">Age:</label>
                    <input v-model.number="editPetData.age" type="number" min="0" required
                        class="border border-gray-300 rounded-md py-2 px-4 w-full" />
                </div>

                <!-- Profile Image -->
                <div class="mb-4">
                    <label class="block text-gray-700">Profile Image:</label>
                    <input type="file" @change="handleEditPetFileUpload" accept="image/*"
                        class="border border-gray-300 rounded-md py-2 px-4 w-full" />
                    <!-- Image Preview -->
                    <div v-if="editPetImageUrl" class="mt-4">
                        <p class="text-gray-700 mb-2">New Image Preview:</p>
                        <img :src="editPetImageUrl" alt="New Pet Image" class="w-32 h-32 rounded-full">
                    </div>
                    <div v-else class="mt-4">
                        <p class="text-gray-700 mb-2">Current Image:</p>
                        <img :src="props.pet?.profileImage || 'https://via.placeholder.com/150?text=No+Image'"
                            alt="Current Pet Image" class="w-32 h-32 rounded-full" />
                    </div>
                </div>


                <!-- Submit Button -->
                <button type="submit" class="update-btn" :disabled="isUpdating">
                    {{ isUpdating ? 'Updating...' : 'Update Pet' }}
                </button>

                <p v-if="updatePetSuccess" class="text-green-500 text-center mt-4">{{ updatePetSuccess }}</p>
                <p v-if="updatePetError" class="mt-4 text-sm text-red-500 text-center">{{ updatePetError }}</p>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

// Props and emits
const props = defineProps({
    pet: Object,
});
const emit = defineEmits(['update-pet', 'close']);

// Reactive data
const editPetData = ref({
    name: '',
    type: '',
    breed: '',
    age: 0,
});
const editPetImage = ref(null);
const editPetImageUrl = ref('');
const isUpdating = ref(false);
const updatePetSuccess = ref(''); // Reactive variable for success message
const updatePetError = ref(''); // Reactive variable for success message

// Watch pet prop to update editPetData
watch(
    () => props.pet,
    (newPet) => {
        if (newPet) {
            editPetData.value = {
                name: newPet.name,
                type: newPet.type,
                breed: newPet.breed,
                age: newPet.age,
            };
            editPetImageUrl.value = newPet.profileImage || ''; // Set initial image URL if available
        }
    },
    { immediate: true }
);

// Function to handle file upload and preview for editing a pet
const handleEditPetFileUpload = (event) => {
    editPetImage.value = event.target.files[0];
    if (editPetImage.value) {
        editPetImageUrl.value = URL.createObjectURL(editPetImage.value);
    } else {
        editPetImageUrl.value = '';
    }
};

// Function to update a pet's details
const updatePet = async () => {
    try {
        if (!props.pet || !props.pet.petId) {
            throw new Error("Pet ID is missing or invalid");
        }

        isUpdating.value = true;

        const formData = new FormData();
        formData.append('name', editPetData.value.name);
        formData.append('type', editPetData.value.type);
        formData.append('breed', editPetData.value.breed);
        formData.append('age', editPetData.value.age);
        if (editPetImage.value) {
            formData.append('profileImage', editPetImage.value);
        }

        console.log("Updating pet with ID:", props.pet.petId);

        // Make the API call
        const response = await axios.put(`/api/pets/${props.pet.petId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log("API response:", response.data); // Debugging output

        // Check for success message
        if (response.data && response.data.message === 'Pet updated successfully.') {
            updatePetSuccess.value = 'Pet updated successfully!';
            // Emit an event to refresh pets list in the parent component
            emit('update-pet');
            setTimeout(() => closeEditModal(), 1500); // Close modal after a short delay
        } else {
            updatePetError.value = 'Failed to update pet. Please try again.';
            console.error("Unexpected response format:", response.data);
            throw new Error("Failed to confirm pet update from the server.");
        }
    } catch (error) {
        console.error('Error updating pet:', error.message || error);
    } finally {
        isUpdating.value = false;
    }
};



// Close modal
const closeEditModal = () => {
    emit('close'); // Emit close event to Profile.vue
};
</script>


<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    width: 500px;
    height: 500px;
    padding: 20px;
    border-radius: 15px;
    position: relative;
    overflow-y: auto;
    max-width: 100%;
}


button {
    cursor: pointer;
    transition: background-color 0.3s;
}


.close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
}

@media (max-width: 768px) {
    .modal-content {
        width: 400px;
    }
}

.update-btn {
    width: 100%;
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

.update-btn:hover {
    background-color: #E6C200;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.update-btn:active {
    transform: scale(0.98);
}

.modal-content::-webkit-scrollbar {
  display: none;
}
</style>