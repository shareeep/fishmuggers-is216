<template>
  <div class="popup" @click.self="$emit('close')">
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
        <button class="delete-button" @click="showDeleteConfirm = true">Remove</button>
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

      L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
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
        .bindPopup(`<b>${this.event.location}</b>`)
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
  overflow-y: auto; /* Enable scrolling for overflow content */
}

.popup-content {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 2px solid #4b4b4b;
  width: 90%;
  max-width: 600px;
  max-height: 90vh; /* Ensure popup doesn't exceed viewport height */
  overflow-y: auto; /* Enable vertical scrolling within popup content */
  display: flex;
  flex-direction: column;
  position: relative;
}

.popup-image-container {
  position: relative;
  width: 100%;
  max-height: 200px; /* Restrict image height to prevent excessive space usage */
  overflow: hidden;
  background-color: #FCEFB4;
  flex-shrink: 0; /* Prevents the image container from shrinking when scrolling */
}

.popup-image {
  width: 100%;
  height: auto; /* Maintains aspect ratio */
  object-fit: cover; /* Ensures the image covers the area */
}

.popup-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-shadow: 2px 2px black;
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
  margin: 0;
  padding: 10px;
}

.popup-body {
  display: flex;
  padding: 16px;
  overflow-y: auto; /* Allows scrolling within popup body */
  flex-direction: column;
  flex-grow: 1; /* Fills remaining space in popup for content */
}

.event-details {
  width: 100%;
  padding-right: 16px;
}

.popup-description {
  width: 100%;
  height: 120px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  background-color: #f9f9f9;
  color: #4b4b4b;
  margin-bottom: 8px;
}

p {
  color: #4b4b4b;
  font-size: 1rem;
}

.map-placeholder, #map {
  width: 100%;
  min-height: 200px;
  margin-top: 12px;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  flex-shrink: 0; /* Prevents buttons from shrinking when scrolling */
}

.delete-button, .close-button {
  padding: 8px 12px;
  font-size: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
}

.delete-button {
  background-color: #ff7b7b;
  color: white;
}

.close-button {
  background-color: #ffd700;
  color: #4b4b4b;
}

/* Media query for tablet screens */
@media (max-width: 768px) {
  .popup-content {
    max-width: 90%;
    max-height: 85vh; /* Reduce max-height to fit smaller screens */
  }

  .popup-title {
    font-size: 1.5rem;
  }

  .popup-description {
    height: 100px;
  }

  #map {
    height: 150px;
  }
}

/* Media query for mobile screens */
@media (max-width: 480px) {
  .popup-content {
    max-width: 100%;
    max-height: 85vh;
    padding: 10px; /* Reduce padding */
  }

  .popup-image-container {
    height: 120px; /* Adjust image height for small screens */
  }

  .popup-title {
    font-size: 1.2rem;
    padding: 5px;
  }

  .popup-description {
    height: 70px; /* Reduce description height */
  }

  .delete-button, .close-button {
    font-size: 0.8rem;
    padding: 6px 10px;
  }

  #map {
    height: 120px; /* Reduce map height for small screens */
  }
}

/* Media query for extra small mobile screens */
@media (max-width: 320px) {
  .popup-content {
    padding: 5px;
    max-height: 80vh;
  }

  .popup-title {
    font-size: 1rem;
  }

  .popup-description {
    height: 60px; /* Further reduce description height */
  }

  #map {
    height: 100px; /* Further reduce map height */
  }

  .delete-button, .close-button {
    font-size: 0.7rem;
    padding: 5px 8px;
  }
}

</style>
