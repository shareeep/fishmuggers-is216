<template>

  <div class="create-event-form">
    <h2>Create a New Event</h2>
    <form @submit.prevent="handleCreateEvent" enctype="multipart/form-data">
      <!-- Title -->
      <div class="mb-4">
        <label class="block text-gray-700">Title:</label>
        <input v-model="event.title" type="text" required class="w-full border border-gray-300 p-2 rounded" />
      </div>

      <!-- Description -->
      <div class="mb-4">
        <label class="block text-gray-700">Description:</label>
        <textarea v-model="event.description" required class="w-full border border-gray-300 p-2 rounded"
          rows="4"></textarea>
      </div>

      <!-- Date -->
      <div class="mb-4">
        <label class="block text-gray-700">Date and Time:</label>
        <input v-model="event.date" type="datetime-local" required class="w-full border border-gray-300 p-2 rounded" />
      </div>

      <!-- Location Field -->
      <div class="mb-4">
        <label class="block text-gray-700">Location:</label>
        <input v-model="event.location" type="text" required class="w-full border border-gray-300 p-2 rounded"
          placeholder="Please enter the exact address..." />
      </div>

      <!-- Latitude Input -->
      <div class="mb-4">
        <label class="block text-gray-700">Latitude:</label>
        <input v-model="event.locationData[0]" type="float" required class="w-full border border-gray-300 p-2 rounded"
          placeholder="Enter latitude" />
      </div>

      <!-- Longitude Input -->
      <div class="mb-4">
        <label class="block text-gray-700">Longitude:</label>
        <input v-model="event.locationData[1]" type="float" required class="w-full border border-gray-300 p-2 rounded"
          placeholder="Enter longitude" />
        <button type="button" @click="getCurrentLocation"
          class="rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center me-3 text-black  bg-[#FFD700] hover:bg-[#E6C200] font-bold text-sm my-3">
          Use Current Location
        </button>
        <!-- <p class="text-sm text-gray-500"> -->
          <!-- ^ Only fills in Latitude & Longitude, for Leaflet.js reference -->
        <!-- </p> -->
      </div>

      <!-- Pet Types -->
      <div class="mb-4">
        <label class="block text-gray-700">Pet Types:</label>
        <div class="flex flex-wrap">
          <label class="mr-4">
            <input type="checkbox" value="Dog" v-model="petTypeSelection" />
            Dog
          </label>
          <label class="mr-4">
            <input type="checkbox" value="Cat" v-model="petTypeSelection" />
            Cat
          </label>
          <label class="mr-4">
            <input type="checkbox" value="Bird" v-model="petTypeSelection" />
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
            <input type="radio" value="casual" v-model="event.eventType" required />
            Casual
          </label>
          <label>
            <input type="radio" value="large" v-model="event.eventType" required />
            Large-Scale
          </label>
        </div>
      </div>

      <!-- Event Size -->
      <div class="mb-4">
        <label class="block text-gray-700">Event Size:</label>
        <select v-model="event.eventSize" required class="w-full border border-gray-300 p-2 rounded">
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
        <div v-if="imagePreview" class="mt-2">
          <p class="text-gray-700">Image Preview:</p>
          <img :src="imagePreview" alt="Event Image Preview" class="w-32 h-32 object-cover rounded" />
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit"
        class="rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center me-3 text-black  bg-[#FFD700] hover:bg-[#E6C200] font-bold text-sm my-3"
        :disabled="isSubmitting">
        {{ isSubmitting ? "Creating..." : "Create Event" }}
      </button>

      <!-- Success and Error Messages -->
      <p v-if="successMessage" class="mt-4 text-green-500">
        {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
    </form>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { getAuth } from "firebase/auth";
import axios from "axios";
import googleMapsLoader from "../../../../googleMapsLoader.js";


const auth = getAuth();
const user = auth.currentUser;

// Emit event to parent when a new event is created
const emit = defineEmits(["event-created"]);

const event = ref({
  title: "",
  description: "",
  date: "",
  location: "",
  locationData: [null, null], // Initialize with two elements for latitude and longitude
  petType: [],
  eventSize: "",
  eventType: "", // Ensuring `eventType` is initialized
  eventImage: null,
});

const petTypeSelection = ref([]);
const imagePreview = ref("");
const isSubmitting = ref(false);
const isGettingLocation = ref(false);
const successMessage = ref("");
const errorMessage = ref("");


// Watch the location input field
watch(
  () => event.value.location,
  async (newLocation) => {
    if (newLocation) {
      await fetchCoordinates(newLocation);
    }
  }
);


// Function to fetch coordinates using Google Maps Geocoding API
const fetchCoordinates = async (address) => {
  try {
    // Load the Google Maps API
    await googleMapsLoader.load();

    // Initialize the Geocoder
    const geocoder = new google.maps.Geocoder();

    // Perform geocoding
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        event.value.locationData = [location.lat(), location.lng()];
      } else {
        console.error("Geocode was not successful for the following reason: " + status);
      }
    });
  } catch (error) {
    console.error("Error loading Google Maps API or fetching coordinates:", error);
  }
};

// Function to get the user's current location
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    errorMessage.value = "Geolocation is not supported by your browser.";
    return;
  }

  isGettingLocation.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Update event.locationData with [latitude, longitude]
      event.value.locationData = [latitude, longitude];

      // Optionally, reverse geocode to get the address
      event.value.location = `Lat: ${latitude.toFixed(
        5
      )}, Lon: ${longitude.toFixed(5)}`;

      successMessage.value = "Location detected successfully!";
      isGettingLocation.value = false;
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
      isGettingLocation.value = false;
    }
  );
};

// Function to handle image upload and preview
const handleImageUpload = (eventObj) => {
  const file = eventObj.target.files[0];
  if (file) {
    event.value.eventImage = file;
    imagePreview.value = URL.createObjectURL(file);
  } else {
    event.value.eventImage = null;
    imagePreview.value = "";
  }
};

// Function to create a new event
const handleCreateEvent = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  const currentUser = auth.currentUser;
  if (!currentUser) {
    errorMessage.value = "User not authenticated.";
    return;
  }

  // Assign petTypeSelection to event.petType
  event.value.petType = petTypeSelection.value;

  // Basic validation
  if (
    !event.value.title ||
    !event.value.description ||
    !event.value.date ||
    !event.value.location ||
    event.value.petType.length === 0 ||
    !event.value.eventSize ||
    event.value.locationData.length !== 2 ||
    event.value.locationData.some(coord => coord === null)
  ) {
    errorMessage.value = "Please fill in all required fields.";
    return;
  }

  try {
    isSubmitting.value = true;

    // Convert latitude and longitude to floats and validate
    const lat = parseFloat(event.value.locationData[0]);
    const lon = parseFloat(event.value.locationData[1]);

    if (isNaN(lat) || isNaN(lon)) {
      errorMessage.value = "Please enter valid latitude and longitude values.";
      return;
    }

    // Assign locationData as floats
    event.value.locationData = [lat, lon];

    // Prepare form data
    const formData = new FormData();
    formData.append("title", event.value.title);
    formData.append("description", event.value.description);
    formData.append("date", event.value.date);
    formData.append("location", event.value.location);
    formData.append("latitude", lat); // Send latitude separately
    formData.append("longitude", lon); // Send longitude separately
    event.value.petType.forEach((type) => formData.append("petType", type));
    formData.append("eventType", event.value.eventType);
    formData.append("eventSize", event.value.eventSize);
    if (event.value.eventImage) {
      formData.append("eventImage", event.value.eventImage);
    }

    // Send POST request to create event
    await axios.post("http://localhost:3000/api/events", formData, {
      headers: {
        Authorization: `Bearer ${await currentUser.getIdToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    successMessage.value = "Event created successfully!";
    // Reset form
    event.value = {
      title: "",
      description: "",
      date: "",
      location: "",
      locationData: [null, null], // Reset to initial state
      petType: [],
      eventSize: "",
      eventType: "",
      eventImage: null,
    };
    petTypeSelection.value = []; // Reset pet type selection
    imagePreview.value = "";

    // Emit event to parent to refresh events list
    emit("event-created");
  } catch (error) {
    console.error("Error creating event:", error);
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
        errorMessage.value = "Failed to create event.";
      }
    } else {
      errorMessage.value = "Failed to create event.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>


<style scoped>
/* Add any component-specific styles here */
h2 {
  font-size: 20px;
  font-weight: bold;
  color: rgb(46, 46, 46);
  text-align: center;
}

label {
  color: black;
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="url"],
input[type="file"] input[type="select"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #dbdbdb;
  border-radius: 5px;
  box-sizing: border-box;
}

.create-event-form {
  display: flex;
  max-width: 800px;
  flex-direction: column;
  margin: 0 auto;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  margin-top: -33px;
}
</style>
