<template>
  <div class="event-detail" v-if="event">
    <!-- Back Button -->
    <router-link to="/events" class="back-button">
      <img src="@/assets/images/back_arrow.png" alt="back" width="40px" />
    </router-link>

    <!-- Event Image -->
    <img class="event-image" :src="event.eventImage || 'https://via.placeholder.com/800x400'" alt="Event Image" />

    <!-- Event Title -->
    <h1 class="event-title">{{ event.title }}</h1>

    <div class="event-info">
      <!-- Left Block -->
      <div class="left-block">
        <!-- About -->
        <h3>About</h3>
        <p>{{ event.description }}</p>

        <!-- Host -->
        <h3 style="padding-top:15px;">Hosted by:</h3>
        <div class="host-info">
          <img
            class="profile-pic"
            :src="event.host.profilePic || 'https://via.placeholder.com/50'"
            alt="Profile Picture"
          />
          <div class="host-details">
            <strong>{{ event.host.username }}</strong>
            <div class="host-buttons">
              <button class="contact-button">Contact</button>
              <button class="follow-button">+ Follow</button>
            </div>
          </div>
        </div>

        <!-- Pet Type -->
        <h3 style="padding-top:15px;">Pet Type</h3>
        <div class="pet-type-container">
          <span v-for="(type, index) in event.petType" :key="index" class="pet-type">
            {{ type }}
          </span>
        </div>

        <!-- Event Size -->
        <h3 style="padding-top:15px;">Event Size</h3>
        <p>{{ event.eventSize }}</p>
      </div>

      <!-- Right Block -->
      <div class="right-block">
        <!-- Date & Time -->
        <h3>Date & Time</h3>
        <div class="date-time">
          <div class="date">
            <span class="icon calendar-icon">
              <img src="@/assets/images/calendar_icon.png" alt="calendar icon" style="width:30px;height:30px;" />
            </span>
            <span>{{ formatEventDate(event.date) }}</span>
          </div>
          <div class="time">
            <span class="icon clock-icon">
              <img src="@/assets/images/time_icon.png" alt="time icon" style="width:30px;height:30px;" />
            </span>
            <span>{{ formatEventTime(event.date) }}</span>
          </div>
        </div>
        <!-- Add to Calendar -->
        <button class="add-to-calendar">+Add to Calendar</button>

        <!-- Location -->
        <h3>Location</h3>
        <div class="location">
          <span class="icon location-icon">
            <img src="@/assets/images/location_icon.png" alt="location icon" style="width:30px;height:30px;" />
          </span>
          <span>{{ event.location }}</span>
        </div>

        <!-- Leaflet.js Map -->
        <div id="map"></div>
      </div>
    </div>
  </div>

  <!-- Loading Indicator -->
  <div v-else class="loading-indicator">
    Loading event details...
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, defineProps, defineEmits } from 'vue';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customMarkerIcon from '@/assets/images/paw_marker.png';

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

// Declare custom events (filtersApplied, filtersReset) if needed
const emit = defineEmits(['filtersApplied', 'filtersReset']);

const map = ref(null);

const initMap = () => {
  if (!props.event || !props.event.locationData || props.event.locationData.length !== 2) {
    console.error("Invalid event location data");
    return;
  }

  const [latitude, longitude] = props.event.locationData;

  // Initialize the map centered on the event location
  map.value = L.map("map").setView([latitude, longitude], 15);
  L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
    detectRetina: true,
    maxZoom: 19,
    minZoom: 5,
  }).addTo(map.value);

  const pawIcon = L.icon({
    iconUrl: customMarkerIcon,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    popupAnchor: [0, -60],
  });

  const marker = L.marker([latitude, longitude], { icon: pawIcon }).addTo(map.value);
  marker.bindPopup(`<b>${props.event.location}</b>`);
};

const formatEventDate = (dateInput) => {
  const dateObj = convertToDate(dateInput);
  return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

const formatEventTime = (dateInput) => {
  const dateObj = convertToDate(dateInput);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${minutes} ${ampm}`;
};

const convertToDate = (dateInput) => {
  if (dateInput && dateInput._seconds) {
    return new Date(dateInput._seconds * 1000);
  } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    return new Date(dateInput);
  } else {
    return new Date();
  }
};

onMounted(async () => {
  await nextTick();
  initMap();
});
</script>

<style scoped>
.back-button {
  position: absolute;
  /* Adjust to appear beside the Navbar */
  z-index: 10;
  padding: 5px;
  transition: transform 0.2s ease;
}

.back-button:hover {
  transform: scale(1.1);
}
/* Loading Indicator Style */
.loading-indicator {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}

/* Event Detail Container */
.event-detail {
  padding: 20px;
  max-width: 100%;
}

/* Back Button */
.back-button {
  text-decoration: none;
  color: #007bff;
  font-size: 16px;
}

/* Event Image */
.event-image {
  width: 100%;
  max-width: 800px;
  border-radius: 10px;
  margin: auto;
  display: block;
}

/* Event Title */
.event-title {
  font-family: 'Poppins', sans-serif;
  font-size: 2em;
  font-weight: bold;
  margin: 20px 0;
  text-align: center;
}

/* Event Info Wrapper */
.event-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 768px) {
  .event-info {
    flex-direction: row;
  }
}

/* Left and Right Block */
.left-block,
.right-block {
  flex: 1;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow: hidden;
}

.right-block {
  max-width: 100%;
}

@media (min-width: 768px) {
  .right-block {
    width: 400px;
  }
}

/* Host Information */
.host-info {
  display: flex;
  align-items: center;
  margin-top: 7px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 90px;
}

.profile-pic {
  margin-left: 10px;
  border-radius: 50%;
  margin-right: 10px;
  height: 50px;
  width: 50px;
}

.host-details {
  flex-grow: 1;
}

.host-buttons {
  display: flex;
  gap: 10px;
  padding-top: 8px;
  padding-bottom: 10px;
}

.contact-button,
.follow-button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.contact-button {
  background-color: white;
  color: #C99F25;
  border: 1px solid #C99F25;
}

.follow-button {
  background-color: #FBD157;
  color: black;
}

/* Date and Time */
.date,
.time {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

/* Add to Calendar Button */
.add-to-calendar {
  color: #7B61FF;
  cursor: pointer;
  margin-bottom: 10px;
}

/* Location Section */
.location {
  display: flex;
  align-items: center;
}

.icon {
  padding-right: 10px;
}

/* Pet Type Container */
.pet-type-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pet-type {
  border: 2px solid #7B61FF;
  border-radius: 15px;
  padding: 5px 15px;
  background-color: transparent;
  color: #7B61FF;
  font-weight: bold;
}

/* Map Container */
#map {
  margin-top: 15px;
  width: 100%;
  height: 300px;
}

@media (min-width: 768px) {
  #map {
    width: 100%;
    height: 400px;
  }
}

/* Responsive Font Sizes */
h3 {
  font-weight: bold;
  padding-bottom: 7px;
  padding-top: 3px;
  font-size: 1.2em;
}

.event-title {
  font-size: 2em;
}

/* Additional responsive styles for smaller screens */
@media (max-width: 767px) {
  .event-title {
    font-size: 1.5em;
  }

  .contact-button,
  .follow-button {
    font-size: 12px;
    padding: 4px 8px;
  }
}
</style>
