<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Edit Event</h2>
        <form @submit.prevent="handleEditEvent" enctype="multipart/form-data">
          <!-- Title -->
          <div class="mb-4">
            <label class="block text-gray-700">Title:</label>
            <input v-model="editEvent.title" type="text" required class="w-full border border-gray-300 p-2 rounded" />
          </div>

          <!-- Description -->
          <div class="mb-4">
            <label class="block text-gray-700">Description:</label>
            <textarea v-model="editEvent.description" required class="w-full border border-gray-300 p-2 rounded"
              rows="4"></textarea>
          </div>

          <!-- Date -->
          <div class="mb-4">
            <label class="block text-gray-700">Date and Time:</label>
            <input v-model="editEvent.date" type="datetime-local" required
              class="w-full border border-gray-300 p-2 rounded" />
          </div>

          <!-- Location Field -->
          <div class="mb-4">
            <label class="block text-gray-700">Location:</label>
            <input v-model="editEvent.location" type="text" required class="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter address or use current location" />
            <!-- Optionally include the "Use Current Location" button -->
          </div>

          <!-- Pet Types -->
          <div class="mb-4">
            <label class="block text-gray-700">Pet Types:</label>
            <div class="flex flex-wrap">
              <label class="mr-4">
                <input type="checkbox" value="Dog" v-model="editPetTypeSelection" />
                Dog
              </label>
              <label class="mr-4">
                <input type="checkbox" value="Cat" v-model="editPetTypeSelection" />
                Cat
              </label>
              <label class="mr-4">
                <input type="checkbox" value="Bird" v-model="editPetTypeSelection" />
                Bird
              </label>
              <!-- Add more pet types as needed -->
            </div>
          </div>

          <!-- Event Size -->
          <div class="mb-4">
            <label class="block text-gray-700">Event Size:</label>
            <select v-model="editEvent.eventSize" required class="w-full border border-gray-300 p-2 rounded">
              <option disabled value="">Select size</option>
              <option value="50-100">50-100</option>
              <option value="100-200">100-200</option>
              <option value="200+">200+</option>
            </select>
          </div>

          <!-- Event Image -->
          <div class="mb-4">
            <label class="block text-gray-700">Event Image:</label>
            <input type="file" @change="handleEditImageUpload" accept="image/*" class="w-full" />
            <div v-if="editImagePreview || editEvent.eventImage" class="mt-2">
              <p class="text-gray-700">Image Preview:</p>
              <img :src="editImagePreview || editEvent.eventImage" alt="Event Image Preview"
                class="w-32 h-32 object-cover rounded" />
            </div>
          </div>

          <!-- Submit and Cancel Buttons -->
          <div class="flex justify-end">
            <button type="button" @click="$emit('close')"
              class="cancel-btn mr-2">
              Cancel
            </button>
            <button type="submit" class="edit-btn"
              :disabled="isSubmitting">
              {{ isSubmitting ? "Updating..." : "Update Event" }}
            </button>
          </div>

          <!-- Success and Error Messages -->
          <p v-if="successMessage" class="mt-4 text-green-500">
            {{ successMessage }}
          </p>
          <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { getAuth } from "firebase/auth";
import axios from "axios";

// Props
const props = defineProps({
  eventData: {
    type: Object,
    required: true,
  },
});

// Emit events to parent
const emit = defineEmits(["close", "event-updated"]);

const auth = getAuth();
const user = auth.currentUser;

// Reactive variables
const editEvent = ref({ ...props.eventData });
const editPetTypeSelection = ref([...props.eventData.petType]);
const editImagePreview = ref("");
const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Watch for changes in eventData prop
watch(
  () => props.eventData,
  (newVal) => {
    editEvent.value = { ...newVal };
    editPetTypeSelection.value = [...newVal.petType];
    editImagePreview.value = "";
  },
  { immediate: true }
);

// Function to handle image upload and preview in edit form
const handleEditImageUpload = (eventObj) => {
  const file = eventObj.target.files[0];
  if (file) {
    editEvent.value.eventImage = file;
    editImagePreview.value = URL.createObjectURL(file);
  } else {
    editEvent.value.eventImage = null;
    editImagePreview.value = "";
  }
};

// Function to handle editing an event
const handleEditEvent = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  const currentUser = auth.currentUser;
  if (!currentUser) {
    errorMessage.value = "User not authenticated.";
    return;
  }

  // Assign pet types from selection
  editEvent.value.petType = editPetTypeSelection.value;

  // Basic validation
  if (
    !editEvent.value.title ||
    !editEvent.value.description ||
    !editEvent.value.date ||
    !editEvent.value.location ||
    editEvent.value.petType.length === 0 ||
    !editEvent.value.eventSize ||
    editEvent.value.locationData.length !== 2
  ) {
    errorMessage.value = "Please fill in all required fields.";
    return;
  }

  try {
    isSubmitting.value = true;

    // Prepare form data
    const formData = new FormData();
    formData.append("title", editEvent.value.title);
    formData.append("description", editEvent.value.description);
    formData.append("date", editEvent.value.date);
    formData.append("location", editEvent.value.location);
    formData.append(
      "locationData",
      JSON.stringify(editEvent.value.locationData)
    );
    editEvent.value.petType.forEach((type) => formData.append("petType", type));
    formData.append("eventSize", editEvent.value.eventSize);
    if (editEvent.value.eventImage instanceof File) {
      formData.append("eventImage", editEvent.value.eventImage);
    }

    // Send PUT request to update event
    await axios.put(
      `http://localhost:3000/api/events/${editEvent.value.eventId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${await currentUser.getIdToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    successMessage.value = "Event updated successfully!";
    // Emit event to parent to refresh events list
    emit("event-updated");
  } catch (error) {
    console.error("Error updating event:", error);
    if (error.response && error.response.data) {
      if (error.response.data.errors) {
        // Validation errors
        errorMessage.value = error.response.data.errors
          .map((err) => err.msg)
          .join(" ");
      } else if (error.response.data.error) {
        // Other errors
        errorMessage.value = error.response.data.error;
      } else {
        errorMessage.value = "Failed to update event.";
      }
    } else {
      errorMessage.value = "Failed to update event.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(31, 41, 55, 0.75);
  /* Equivalent to bg-gray-800 bg-opacity-75 */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.modal-container {
  background-color: white;
  border-radius: 0.375rem;
  /* To match rounded corners */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  /* Matches shadow-md */
  max-width: 32rem;
  /* Equivalent to max-w-lg */
  width: 100%;
  margin: 1rem;
  /* Margin for spacing */
  max-height: 80vh;
  /* Limit height for smaller screens */
  overflow-y: auto;
  /* Scroll if content exceeds modal height */
  padding: 1.5rem;
  -webkit-overflow-scrolling: touch;
}

.modal-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.cancel-btn, .edit-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.edit-btn {
  background-color: #FFD700;
  color: #333;
}

.edit-btn:hover {
  background-color: #E6C200;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.edit-btn:active {
  transform: scale(0.98);
}

.cancel-btn {
  background-color: #ddd;
  color: #333;
}

.cancel-btn:hover {
  background-color: #bbb;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.cancel-btn:active {
  transform: scale(0.98);
}

</style>
