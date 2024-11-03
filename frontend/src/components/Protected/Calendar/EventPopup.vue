<template>
  <div class="popup">
    <div :class="['popup-content', { 'custom-event': isCustomEvent }]">
      <!-- Image container with conditional image rendering -->
      <div class="popup-image-container">
        <img v-if="event.eventImage" :src="event.eventImage" alt="Event Image" class="popup-image" />
        <h2 class="popup-title">{{ event.title }}</h2>
      </div>

      <!-- Content Container with Details on the Left and Map on the Right -->
      <div class="popup-body">
        <!-- Left Side: Event Details -->
        <div class="event-details">
          <p><strong>Description:</strong></p>
          <textarea class="popup-description" disabled>{{ event.description }}</textarea>
          <p><strong>Date:</strong> {{ event.EventDate }}</p>
          <p><strong>Location:</strong> {{ event.location }}</p>
        </div>

        <!-- Right Side: Map only for events with locationData -->
        <div v-if="event.locationData && !isCustomEvent" id="map"></div>
      </div>

      <!-- Buttons container for Delete and Close -->
      <div class="popup-buttons">
        <button class="delete-button" @click="showDeleteConfirm = true">Delete</button>
        <button class="close-button" @click="$emit('close')">Close</button>
      </div>

      <!-- Confirmation Popup -->
      <div v-if="showDeleteConfirm" class="delete-confirm-popup">
        <p>Confirm deletion?</p>
        <button @click="confirmDeletion">Yes</button>
        <button @click="showDeleteConfirm = false">No</button>
      </div>

    </div>
  </div>
</template>





<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pawMarker from '@/assets/images/paw_marker.png';

export default {
  props: {
    event: Object,
  },
  data() {
    return {
      showDeleteConfirm: false, // Control visibility of the delete confirmation popup
      map: null, // Reference to the Leaflet map instance
      marker: null, // Reference to the Leaflet marker instance
      isCustomEvent: false, // Flag to check if it's a custom event
    };
  },
  mounted() {
    this.isCustomEvent = !!this.event.customEventId;
    if (this.event.locationData && !this.isCustomEvent) {
      this.initializeMap();
    }
  },
  methods: {
    initializeMap() {
      // Initialize the Leaflet map centered on the event's location
      const [lat, lng] = this.event.locationData;
      this.map = L.map('map').setView([lat, lng], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      // Define the custom icon
      const customIcon = L.icon({
        iconUrl: pawMarker,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
      });

      // Add a marker with the custom icon
      this.marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(this.event.location)
        .openPopup();
    },
    confirmDeletion() {
      this.$emit('delete-event', this.event);
      this.showDeleteConfirm = false;
      this.$emit('close'); // Close the popup after deletion
    },
  },
  watch: {
    event(newEvent) {
      // Watch for changes in the event prop to reinitialize the map if needed
      if (newEvent.locationData && !this.isCustomEvent) {
        this.initializeMap();
      }
    },
  },
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 3px solid #4b4b4b;
  width: 800px;
  max-width: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Arial Rounded MT', sans-serif;
  position: relative;
}

.custom-event {
  width: 600px; /* Smaller width for custom events */
}

/* Conditionally displayed image container */
.popup-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #ffd700;
}

.popup-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popup-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-height: 100%;
  /* font-family: 'pawfont'; */
  color: white;
  text-shadow: 2px 2px black;
  text-align: center;
  font-weight: bold;
  font-size: 2.5rem;
  margin: 0;
  padding: 10px;
  border-radius: 8px;
}

/* Layout for the body content with event details and map */
.popup-body {
  display: flex;
  padding: 16px;
  padding-bottom: 0px;
}

/* Left Side: Event Details */
.event-details {
  flex: 2;
  padding-right: 16px;
}

.popup-description {
  width: 100%;
  height: 150px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
  color: #4b4b4b;
  margin-bottom: 8px;
  margin-top: 4px;
}

p {
  color: #4b4b4b;
  font-size: 1.1rem;
  font-family: 'Arial Rounded MT', sans-serif;
}

/* Right Side: Map Placeholder */
.map-placeholder {
  flex: 1;
  height: 100%;
  background-color: #e0e0e0;
  border-radius: 8px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4b4b4b;
  font-size: 1rem;
  text-align: center;
}

/* Small Close Button in Bottom Right */
.close-button {
  align-self: flex-end;
  margin: 16px;
  padding: 6px 16px;
  background-color: #ffd700;
  color: #4b4b4b;
  font-weight: bold;
  border: 1px solid #4b4b4b;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s, color 0.3s;
}

.close-button:hover {
  background-color: #f0e68c;
  color: #333;
}



/* Styles for delete button */
.popup-buttons {
  display: flex;
  justify-content: space-between;

}
.delete-button {
  align-self: flex-start;
  margin: 16px;
  padding: 6px 16px;
  background-color: red;
  color: white;
  font-weight: bold;
  border: 1px solid #4b4b4b;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}
.delete-button:hover {
  background-color: darkred;
}

/* Styles for delete confirmation popup */
.delete-confirm-popup {
  background-color: white;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: absolute;
  bottom: 50px;
  left: 10px;
  border: 2px solid #ccc;
}

.delete-confirm-popup button {
  background-color: #ffd700;
  width: 100%;
  color: #4b4b4b;
  font-weight: bold;
  font-size: 1rem;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #4b4b4b; /* Adds the border */
  transition: background-color 0.3s, color 0.3s;
}

.delete-confirm-popup button:hover {
  background-color: #f0e68c;
  color: #333;
}

#map{
  height: 300px;
  width: 400px;
}
</style>
