<template>
  <div class="filtered-events">
    <!-- Only display the title if there are events to display -->
    <div v-if="events.length > 0">
      <h1 class="title">Explore <span class="numEvents">{{ events.length }}</span> Events</h1>
      <div class="events-grid">
        <router-link v-for="event in events" :key="event.eventId"
            :to="{ name: 'eventDetail', params: { id: event.eventId } }" class="event-card-link">
          <div class="card" style="width:300px;">
            <img :src="event.eventImage" alt="Event Image" />
            <div class="card-body">
              <div class="card-left">
                <div class="date">{{ event.month }}</div>
                <div class="date-month">{{ event.year }}</div>
              </div>
              <div class="card-right">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-subtitle">{{ event.time }}</div>
                <div class="event-subtitle">
                  <i class="fas fa-star star-icon"></i> {{ event.numinterested }} Interested
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
import axios from 'axios';
export default {
  props: {
    filters: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      events: [], // This will be fetched from the backend based on filters
      loading: false,
      error: null,
    };
  },
  watch: {
    filters: {
      handler() {
        this.fetchFilteredEvents();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async fetchFilteredEvents() {
      this.loading = true;
      this.error = null;
      try {
        // Construct query parameters based on filters
        const params = {};

        if (this.filters.searchQuery) {
          params.searchQuery = this.filters.searchQuery;
        }
        if (this.filters.petType.cats) {
          params.petType = 'Cat';
        }
        if (this.filters.petType.dogs) {
          params.petType = 'Dog';
        }
        if (this.filters.eventSizeMin !== null) {
          params.eventSizeMin = this.filters.eventSizeMin;
        }
        if (this.filters.eventSizeMax !== null) {
          params.eventSizeMax = this.filters.eventSizeMax;
        }
        if (this.filters.dateRange.startDate) {
          params.startDate = this.filters.dateRange.startDate;
        }
        if (this.filters.dateRange.endDate) {
          params.endDate = this.filters.dateRange.endDate;
        }
        if (this.filters.location) {
          params.location = this.filters.location;
        }

        const response = await axios.get('/api/events', { params });
        this.events = response.data;
      } catch (error) {
        console.error('Error fetching filtered events:', error);
        this.error = 'Failed to fetch events.';
      } finally {
        this.loading = false;
      }
    },
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      events: [], // This will be fetched from the backend based on filters
      loading: false,
      error: null,
    };
  },
  watch: {
    filters: {
      handler() {
        this.fetchFilteredEvents();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async fetchFilteredEvents() {
      this.loading = true;
      this.error = null;
      try {
        // Construct query parameters based on filters
        const params = {};

        if (this.filters.searchQuery) {
          params.searchQuery = this.filters.searchQuery;
        }
        if (this.filters.petType.cats) {
          params.petType = 'Cat';
        }
        if (this.filters.petType.dogs) {
          params.petType = 'Dog';
        }
        if (this.filters.eventSizeMin !== null) {
          params.eventSizeMin = this.filters.eventSizeMin;
        }
        if (this.filters.eventSizeMax !== null) {
          params.eventSizeMax = this.filters.eventSizeMax;
        }
        if (this.filters.dateRange.startDate) {
          params.startDate = this.filters.dateRange.startDate;
        }
        if (this.filters.dateRange.endDate) {
          params.endDate = this.filters.dateRange.endDate;
        }
        if (this.filters.location) {
          params.location = this.filters.location;
        }

        const response = await axios.get('/api/events', { params });
        this.events = response.data;
      } catch (error) {
        console.error('Error fetching filtered events:', error);
        this.error = 'Failed to fetch events.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 3 equal-width columns */
  gap: 20px;
  /* Space between the cards */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 3 equal-width columns */
  gap: 20px;
  /* Space between the cards */
}

@media (max-width: 1024px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
    /* 2 columns on smaller screens */
  }
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
    /* 2 columns on smaller screens */
  }
}

@media (max-width: 640px) {
  .events-grid {
    grid-template-columns: 1fr;
    /* 1 column on mobile */
  }
  .events-grid {
    grid-template-columns: 1fr;
    /* 1 column on mobile */
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
  color: #7B61FF;
}

/*  Card Styles */
.card {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.8s ease, box-shadow 0.8s ease;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.8s ease, box-shadow 0.8s ease;
}

.card img {
  width: 100%;
  height: auto;
  width: 100%;
  height: auto;
}

.card-body {
  display: flex;
  padding: 20px;
  background-color: white;
  display: flex;
  padding: 20px;
  background-color: white;
}

.card-left {
  flex: 1;
  text-align: left;
  flex: 1;
  text-align: left;
}

.card-right {
  flex: 2;
  padding-left: 20px;
  flex: 2;
  padding-left: 20px;
}

.date {
  font-size: 16px;
  font-weight: bold;
  font-size: 16px;
  font-weight: bold;
}

.date-month {
  font-size: 14px;
  font-size: 14px;
}

.event-title {
  font-size: 20px;
  font-weight: bold;
  font-size: 20px;
  font-weight: bold;
}

.event-subtitle {
  font-size: 14px;
  color: #777;
  font-size: 14px;
  color: #777;
}

.star-icon {
  color: gold;
  margin-right: 5px;
  color: gold;
  margin-right: 5px;
}

.card:hover {
  transform: scale(1.03);
  /* Scale up on hover */
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  /* Increase shadow on hover */
  transform: scale(1.03);
  /* Scale up on hover */
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  /* Increase shadow on hover */
}
</style>

