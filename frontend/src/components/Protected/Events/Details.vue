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
/* Existing styles remain unchanged */
/* Loading Indicator Style */
.loading-indicator {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}

/* Additional or adjusted styles if needed */
</style>


<style scoped>
.pet-type-container {
    display: flex;
    /* Align items inline */
    gap: 10px;
    /* Space between each pet type */
}

.pet-type {
    border: 2px solid #7B61FF;
    /* Gold border */
    border-radius: 15px;
    /* Rounded corners */
    padding: 5px 15px;
    /* Padding for spacing */
    background-color: transparent;
    /* No fill */
    color: #7B61FF;
    /* Text color */
    font-weight: bold;
    /*Optional: make the text bold */
}


#map {
    /* display: flex;
    flex-grow: 1; */
    margin-top: 15px;
    width: 600px;
    height: 400px;
}

h3 {
    font-weight: bold;
    padding-bottom: 7px;
    padding-top: 3px;
}

.event-detail {
    padding: 20px;
}

.back-button {
    text-decoration: none;
    color: #007bff;
    font-size: 16px;
}

.event-image {
    width: 800px;
    border-radius: 10px;
    margin: auto;
}

.event-title {
    font-family: 'Poppins', sans-serif;
    font-size: 32px;
    font-weight: bold;
    margin: 20px 0;
    text-align: center;
}

.event-info {
    display: flex;
    gap: 20px;
}

.left-block,
.right-block {
    flex: 1;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    height: 100%;
    overflow: hidden;
}

.host-info {
    display: flex;
    align-items: center;
    margin-top: 7px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 290px;
    height: 90px;
}

.profile-pic {
    margin-left: 10px;
    border-radius: 50%;
    margin-right: 10px;
    height: 70px;
    width: 70px;
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

.date,
.time {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}


.add-to-calendar {
    margin-left: 25px;
    color: #7B61FF;
    cursor: pointer;
    margin-bottom: 10px;
}

.location {
    display: flex;
    align-items: center;
}

.icon {
    padding-right: 10px;
}
</style>
