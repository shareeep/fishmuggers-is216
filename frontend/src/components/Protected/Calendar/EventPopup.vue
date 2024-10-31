<template>
  <div class="popup">
    <div class="popup-content">
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

        <!-- Right Side: Map Placeholder -->
        <div class="map-placeholder">
          <p>Map of the location goes here</p>
        </div>
      </div>

      <!-- Small Close Button in the Bottom Right -->
      <button class="close-button" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    event: Object,
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
  width: 600px;
  max-width: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Arial Rounded MT', sans-serif;
  position: relative;
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
  font-family: 'pawfont';
  color: white;
  text-shadow: 5px 3px black;
  text-align: center;
  font-weight: bold;
  font-size: 3.3rem;
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
</style>
