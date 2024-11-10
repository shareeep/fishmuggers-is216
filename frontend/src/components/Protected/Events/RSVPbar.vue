<template>
  <div class="bottom-bar">
    <!-- <span @click="toggleInterested" class="icon star-icon" :class="{ 'filled': isInterested }">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="30" height="30">
        <path
          d="M12 .587l3.668 7.568 8.332 1.203-6.002 5.854 1.417 8.338L12 18.896l-7.415 3.885 1.417-8.338-6.002-5.854 8.332-1.203L12 .587z" />
      </svg>
    </span> -->
    <button class="icon share-icon" @click="$emit('showSharePopup')">
      <img src="../../../assets/images/send.png" width="30px" alt="send">
    </button>
    <button class="see-int-btn" @click="$emit('seeInterestedUsers')">
      See Interested Users
    </button>
    <span class="slots-left">{{ remainingSlots }} slots left</span>
    <button class="rsvp-button" @click="toggleInterested">{{ isInterested ? "Un-RSVP" : "RSVP" }}</button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { defineProps } from "vue";
import api from '@/services/api';

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

// Set initial state directly from backend-provided isUserInterested flag
const isInterested = ref(props.event.isUserInterested || false);
const localInterestedUsers = ref([...props.event.interestedUsers || []]);

const remainingSlots = computed(() => {
  return props.event.eventSize - localInterestedUsers.value.length;
});

const toggleInterested = async () => {
  const eventId = props.event.eventId;
  if (!eventId) {
    console.error("Event ID is undefined in RSVPBar.vue");
    return;
  }
  try {
    isInterested.value = !isInterested.value;
    const endpoint = `/api/events/${eventId}/interested`;

    if (isInterested.value) {
      await api.post(endpoint);
      localInterestedUsers.value.push("your-user-id"); // Placeholder; backend manages actual user
    } else {
      await api.delete(endpoint);
      localInterestedUsers.value = localInterestedUsers.value.filter((id) => id !== "your-user-id");
    }
  } catch (error) {
    console.error("Error updating interest:", error);
  }
};
</script>

<style scoped>
.share-icon {
  padding-left: 25px;
}

.icon {
  margin-right: 10px;
  padding-left: 15px;
  cursor: pointer;
  transition: fill 0.3s;
}

.star-icon {
  color: white;
  stroke: black;
}

.star-icon.filled {
  color: #FFD700;
}

.bottom-bar {
  z-index: 1000000;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background-color: white;
  padding: 10px 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  gap: 10px;
}

.slots-left {
  flex-grow: 1;
  font-weight: bold;
  font-size: large;
  text-align: center;
}

.see-int-btn,
.rsvp-button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #FBD157;
  color: black;
  font-family: poppins, sans-serif;
  font-weight: 550;
  margin-right: 20px;
  font-size: large;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden; /* Hide overflow */

}

.see-int-btn:hover,
.rsvp-button:hover {
  background-color: #e6c200;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.see-int-btn,
.rsvp-button:active {
  transform: scale(0.98);
}

/* Media query for smaller screens */
@media (max-width: 562px) {
  .see-int-btn,
  .rsvp-button,
  .slots-left {
    font-size: small; /* Reduce font size for buttons */
  }
}

@media (max-width: 472px) {
  .see-int-btn,
  .rsvp-button,
  .slots-left {
    font-size: 12px; /* Reduce font size for buttons */
  }
}

@media (max-width: 375px) {
  .bottom-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px 0; /* Compact padding */
    gap: 5px;
  }

  .icon.share-icon {
    flex: 1;
    text-align: center;
    max-width: 20%; /* Limit width for icon */
  }

  .rsvp-button {
    flex: 1;
    font-size: 10px;
    padding: 10px; /* Increase padding for consistent button height */
    text-align: center;
    white-space: nowrap;
    max-width: 30%; /* Limit button width */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slots-left {
    flex: 1;
    font-size: 10px;
    text-align: center;
    line-height: 1.2;
    max-width: 20%; /* Limit width */
  }

}
</style>
