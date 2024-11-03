<!-- FilteredEvents.vue -->
<template>
  <div class="filtered-events">
    <!-- Only display the title if there are events to display -->
    <div v-if="events.length > 0">
      <h1 class="title">Explore <span class="numEvents">{{ events.length }}</span> Events</h1>
      <div class="events-grid">
        <router-link
          v-for="event in events"
          :key="event.eventId"
          :to="{ name: 'eventDetail', params: { id: event.eventId } }"
          class="event-card-link"
        >
          <div class="card" style="width:300px;">
            <img :src="event.eventImage" alt="Event Image" />
            <div class="card-body">
              <div class="card-left">
                <!-- Assuming event.date is an ISO string -->
                <div class="date">{{ formatDate(event.date, 'MMM') }}</div>
                <div class="date-month">{{ formatDate(event.date, 'YYYY') }}</div>
              </div>
              <div class="card-right">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-subtitle">{{ formatDate(event.date, 'hh:mm A') }}</div>
                <div class="event-subtitle">
                  <i class="fas fa-star star-icon"></i> {{ event.interestedUsers.length }} Interested
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div v-else>
      <p class="noevents">Uh oh...no events found.</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'FilteredEvents',
  props: {
    events: {
      type: Array,
      required: true,
    },
  },
  methods: {
    /**
     * Formats a given date string based on the specified format.
     * @param {String} date - The date string to format.
     * @param {String} formatStr - The desired format.
     * @returns {String} - The formatted date string.
     */
    formatDate(date, formatStr) {
      return dayjs(date).format(formatStr);
    },
  },
});
</script>

<style scoped>
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}

.title,
.numEvents,
.noevents {
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 30px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
  color: black;
}

.numEvents {
  color: #7B61FF;
}

.card {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.8s ease, box-shadow 0.8s ease;
}

.card img {
  width: 100%;
  height: auto;
}

.card-body {
  display: flex;
  padding: 20px;
  background-color: white;
}

.card-left {
  flex: 1;
  text-align: left;
}

.card-right {
  flex: 2;
  padding-left: 20px;
}

.date {
  font-size: 16px;
  font-weight: bold;
}

.date-month {
  font-size: 14px;
}

.event-title {
  font-size: 20px;
  font-weight: bold;
}

.event-subtitle {
  font-size: 14px;
  color: #777;
}

.star-icon {
  color: gold;
  margin-right: 5px;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}
</style>