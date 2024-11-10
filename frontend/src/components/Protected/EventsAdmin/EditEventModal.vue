<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="create-event-form">
        <button class="close-button" @click="$emit('close')">✕</button>
        <h2>Edit Event</h2>
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
              placeholder="Enter Address in Plain Text" />
          </div>

          <!-- Latitude Input -->
          <div class="mb-4">
            <label class="block text-gray-700">Latitude:</label>
            <input v-model="editEvent.latitude" type="number" step="any" required
              class="w-full border border-gray-300 p-2 rounded" placeholder="Enter latitude" />
          </div>

          <!-- Longitude Input -->
          <div class="mb-4">
            <label class="block text-gray-700">Longitude:</label>
            <input v-model="editEvent.longitude" type="number" step="any" required
              class="w-full border border-gray-300 p-2 rounded" placeholder="Enter longitude" />
            <button type="button" @click="getCurrentLocation"
              class="rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center me-3 text-black bg-[#FFD700] hover:bg-[#E6C200] font-bold text-sm my-3">
              Use Current Location
            </button>
            <p class="text-sm text-gray-500">
              ^ Only fills in Latitude & Longitude, for Leaflet.js reference
            </p>
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

          <!-- Event Type -->
          <div class="mb-4">
            <label class="block text-gray-700">Event Type:</label>
            <div class="flex items-center">
              <label class="mr-4">
                <input type="radio" value="casual" v-model="editEvent.eventType" required />
                Casual
              </label>
              <label>
                <input type="radio" value="large" v-model="editEvent.eventType" required />
                Large-Scale
              </label>
            </div>
          </div>

          <!-- Event Size -->
          <div class="mb-4">
            <label class="block text-gray-700">Event Size:</label>
            <select v-model="editEvent.eventSize" required class="w-full border border-gray-300 p-2 rounded">
              <option disabled value="">Select maximum attendees</option>
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>

          <!-- Event Image -->
          <div class="mb-4">
            <label class="block text-gray-700">Event Image:</label>
            <input type="file" @change="handleImageUpload" accept="image/*" class="w-full" />
            <div v-if="imagePreview || existingImage" class="mt-2">
              <p class="text-gray-700">Image Preview:</p>
              <img :src="imagePreview || existingImage" alt="Event Image Preview"
                class="w-32 h-32 object-cover rounded" />
            </div>
          </div>

          <!-- Submit and Cancel Buttons -->
          <div class="flex justify-end">
            <button type="button" @click="$emit('close')" class="cancel-btn mr-2">
              Cancel
            </button>
            <button type="submit" class="edit-btn" :disabled="isSubmitting">
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
import api from '@/services/api';

// Helper function to convert Firestore timestamp to a formatted date string
function formatFirestoreTimestamp(timestamp) {
  if (!timestamp || typeof timestamp._seconds === 'undefined') return "";

  // Convert Firestore timestamp to a JavaScript Date object
  const date = new Date(timestamp._seconds * 1000);

  // Format the date for datetime-local input
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Props
const props = defineProps({
  eventData: {
    type: Object,
    required: true,
  },
});
console.log(props.eventData);
// Emit events to parent
const emit = defineEmits(["close", "event-updated"]);

const auth = getAuth();
const user = auth.currentUser;

// Reactive variables
const editEvent = ref({
  ...props.eventData,
  latitude: props.eventData.locationData[0] || "",
  longitude: props.eventData.locationData[1] || "",
  date: formatFirestoreTimestamp(props.eventData.date),
});
const editPetTypeSelection = ref([...props.eventData.petType]);
const imagePreview = ref("");
const existingImage = ref(props.eventData.eventImage || "");
const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Watch for changes in eventData prop
watch(
  () => props.eventData,
  (newVal) => {
    editEvent.value = {
      ...newVal,

      latitude: newVal.locationData[0] || "",
      longitude: newVal.locationData[1] || "",
      date: formatFirestoreTimestamp(newVal.date),

    };
    editPetTypeSelection.value = [...newVal.petType];
    imagePreview.value = "";
    existingImage.value = newVal.eventImage || "";
  },
  { immediate: true }
);

console.log(editEvent.value.date);

// Function to get the user's current location
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    errorMessage.value = "Geolocation is not supported by your browser.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Update event.locationData with [latitude, longitude]
      editEvent.value.latitude = latitude;
      editEvent.value.longitude = longitude;

      // Optionally, reverse geocode to get the address
      editEvent.value.location = `Lat: ${latitude.toFixed(
        5
      )}, Lon: ${longitude.toFixed(5)}`;

      successMessage.value = "Location detected successfully!";
    },
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage.value = "User denied the request for Geolocation.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage.value = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage.value = "The request to get user location timed out.";
          break;
        case error.UNKNOWN_ERROR:
          errorMessage.value = "An unknown error occurred.";
          break;
      }
    }
  );
};

// Function to handle image upload and preview
const handleImageUpload = (eventObj) => {
  const file = eventObj.target.files[0];
  if (file) {
    editEvent.value.eventImage = file;
    imagePreview.value = URL.createObjectURL(file);
  } else {
    editEvent.value.eventImage = null;
    imagePreview.value = "";
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
    !editEvent.value.latitude ||
    !editEvent.value.longitude ||
    editEvent.value.petType.length === 0 ||
    !editEvent.value.eventSize ||
    !editEvent.value.eventType
  ) {
    errorMessage.value = "Please fill in all required fields.";
    return;
  }

  try {
    isSubmitting.value = true;

    // Convert latitude and longitude to floats and validate
    const lat = parseFloat(editEvent.value.latitude);
    const lon = parseFloat(editEvent.value.longitude);

    if (isNaN(lat) || isNaN(lon)) {
      errorMessage.value = "Please enter valid latitude and longitude values.";
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("title", editEvent.value.title);
    formData.append("description", editEvent.value.description);
    formData.append("date", editEvent.value.date);
    console.log(editEvent.value.date);
    formData.append("location", editEvent.value.location);
    formData.append("latitude", lat);
    formData.append("longitude", lon);
    editEvent.value.petType.forEach((type) => formData.append("petType", type));
    formData.append("eventType", editEvent.value.eventType);
    formData.append("eventSize", editEvent.value.eventSize);
    if (editEvent.value.eventImage instanceof File) {
      formData.append("eventImage", editEvent.value.eventImage);
    }

    // Send PUT request to update event
    await api.put(
      `/api/events/${editEvent.value.eventId}`,
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
    // Optionally, close the modal after successful update
    emit("close");
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
.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

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
  position: relative;
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
  display: none;
  /* Chrome, Safari */
}

.cancel-btn,
.edit-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.edit-btn {
  background-color: #ffd700;
  color: #333;
}

.edit-btn:hover {
  background-color: #e6c200;
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

/* Additional Styles to Match Create Event Form */
.create-event-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

h2 {
  font-size: 20px;
  font-weight: bold;
  color: rgb(46, 46, 46);
  text-align: center;
  margin-bottom: 20px;
}

label {
  color: black;
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="number"],
input[type="datetime-local"],
input[type="file"],
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  box-sizing: border-box;
}

button[type="submit"],
button[type="button"] {
  display: inline-block;
}

button[type="submit"] {
  background-color: #ffd700;
  color: #333;
}

button[type="button"].cancel-btn {
  background-color: #ddd;
  color: #333;
}

button[type="submit"]:hover,
button[type="button"].cancel-btn:hover {
  cursor: pointer;
}
</style>
