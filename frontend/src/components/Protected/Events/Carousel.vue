<template>
  <!-- <div class="carousel-wrapper"> -->
  <div class="carousel">
    <h1 class="title">Events</h1>
    <!-- Loading Indicator -->
    <div v-if="loading" class="loading-indicator">
      Loading events...
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- Events Display -->
    <div v-else>
      <!-- Vertical Cards for Small Screens (1 Column) -->
      <div class="flex flex-col md:hidden">
        <div v-for="(event, index) in events" :key="index" class="mb-4 mx-auto">
          <router-link :to="{ name: 'eventDetail', params: { id: event.eventId } }">
            <div class="carousel__item">
              <div class="card">
                <img :src="event.eventImage || 'https://via.placeholder.com/300x150'" alt="Event Image">
                <div class="card-body">
                  <div class="card-left">
                    <div class="event-date">
                      <div class="month">{{ formatEventMonth(event.date) }}</div>
                      <div class="year">{{ formatEventYear(event.date) }}</div>
                    </div>
                  </div>
                  <div class="card-right">
                    <div class="event-title">{{ event.title }}</div>
                    <div class="event-details">
                      {{ formatEventOrdinalDay(event.date) }} {{ formatEventMonthFull(event.date) }} at
                      {{ formatEventTime(event.date) }}
                    </div>
                    <div class="event-subtitle">
                      <i class="fas fa-star star-icon"></i>
                      {{ event.interestedUsers ? event.interestedUsers.length : 0 }} Interested
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Carousel for Medium Screens (1 Item) -->
      <div class="hidden md:block lg:hidden">
        <Carousel :itemsToShow="1" :wrapAround="true" :transition="500" class="mx-auto" style="width:600px;">
          <Slide v-for="(event, index) in events" :key="index">
            <router-link :to="{ name: 'eventDetail', params: { id: event.eventId } }">
              <div class="carousel__item">
                <div class="card">
                  <img :src="event.eventImage || 'https://via.placeholder.com/300x150'" alt="Event Image">
                  <div class="card-body">
                    <div class="card-left">
                      <div class="event-date">
                        <div class="month">{{ formatEventMonth(event.date) }}</div>
                        <div class="year">{{ formatEventYear(event.date) }}</div>
                      </div>
                    </div>
                    <div class="card-right">
                      <div class="event-title">{{ event.title }}</div>
                      <div class="event-details">
                        {{ formatEventOrdinalDay(event.date) }} {{ formatEventMonthFull(event.date) }} at
                        {{ formatEventTime(event.date) }}
                      </div>
                      <div class="event-subtitle">
                        <i class="fas fa-star star-icon"></i>
                        {{ event.interestedUsers ? event.interestedUsers.length : 0 }} Interested
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </Slide>
          <template #addons>
            <navigation>
              <template #next>
                <span id="right"> <img src="../../../assets/images/right_arrow.png" alt="right_arrow"> </span>
              </template>
              <template #prev>
                <span id="left">
                  <img src="../../../assets/images/left_arrow.png" alt="left_arrow" width="100px" height="40px">
                </span>
              </template>
            </navigation>
            <!-- <Navigation /> -->
            <Pagination />
          </template>
        </Carousel>
      </div>

      <!-- Carousel for Large Screens (3 Items) -->
      <div v-if="showLargeCarousel" class="hidden lg:block">
        <Carousel :itemsToShow="3" :wrapAround="true" :transition="500" :partialVisible="false">
          <Slide v-for="(event, index) in events" :key="index" :class="{ active: index === currentIndex }">
            <router-link :to="{ name: 'eventDetail', params: { id: event.eventId } }">
              <div class="carousel__item">
                <div class="card">
                  <img :src="event.eventImage || 'https://via.placeholder.com/300x150'" alt="Event Image">
                  <div class="card-body">
                    <div class="card-left">
                      <div class="event-date">
                        <div class="month">{{ formatEventMonth(event.date) }}</div>
                        <div class="year">{{ formatEventYear(event.date) }}</div>
                      </div>
                    </div>
                    <div class="card-right">
                      <div class="event-title">{{ event.title }}</div>
                      <div class="event-details">
                        {{ formatEventOrdinalDay(event.date) }} {{ formatEventMonthFull(event.date) }} at
                        {{ formatEventTime(event.date) }}
                      </div>
                      <div class="event-subtitle">
                        <i class="fas fa-star star-icon"></i>
                        {{ event.interestedUsers ? event.interestedUsers.length : 0 }} Interested
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </Slide>
          <template #addons>
            <navigation>
              <template #next>
                <span id="right"> <img src="../../../assets/images/right_arrow.png" alt="right_arrow"> </span>
              </template>
              <template #prev>
                <span id="left">
                  <img src="../../../assets/images/left_arrow.png" alt="left_arrow" width="100px" height="40px">
                </span>
              </template>
            </navigation>
            <!-- <Navigation /> -->
            <Pagination />
          </template>
        </Carousel>
      </div>


    </div>
  </div>
  <!-- </div> -->
</template>


<script>
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

export default defineComponent({
  name: 'EventCarousel',
  components: {
    Carousel,
    Navigation,
    Pagination,
    Slide,
  },
  data() {
    return {
      events: [],
      loading: true,
      errorMessage: '',
      showLargeCarousel: false,
    };
  },
  setup() {
    const currentIndex = ref(0);

    const updateActiveSlide = (index) => {
      currentIndex.value = index;
    };

    return {
      currentIndex,
      updateActiveSlide,
    };
  },
  mounted() {
    this.fetchEvents();
    this.setInitialCarouselView();
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await axios.get('http://localhost:3000/api/events');
        // Assign the fetched events to the events array
        this.events = response.data;
      } catch (error) {
        console.error('Error fetching events:', error);
        this.errorMessage = 'Failed to load events.';
      } finally {
        this.loading = false;
        // Delay and trigger a resize event
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 50); // Adjust delay as needed
      }
    },
    formatEventDay(dateInput) {
      const dateObj = this.convertToDate(dateInput);
      return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    },
    formatEventTime(dateInput) {
      const dateObj = this.convertToDate(dateInput);
      const hours = dateObj.getHours();
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format

      return `${formattedHours}:${minutes}${ampm.toLowerCase()}`;
    },
    formatFullDate(dateInput) {
      const dateObj = this.convertToDate(dateInput);
      const day = dateObj.getDate();
      const month = dateObj.toLocaleString('en-US', { month: 'long' });
      const year = dateObj.getFullYear();

      return `${day} ${month} ${year}`;
    },
    formatEventMonth(dateInput) {
      const dateObj = this.convertToDate(dateInput);
      return dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    },
    formatEventMonthFull(dateInput) {
      const dateObj = this.convertToDate(dateInput);
      return dateObj.toLocaleString('en-US', { month: 'long' });
    },
    formatEventOrdinalDay(dateInput) {
      const dateObj = this.convertToDate(dateInput);
      const day = dateObj.getDate();
      const suffix = day % 10 === 1 && day !== 11 ? "st" :
        day % 10 === 2 && day !== 12 ? "nd" :
          day % 10 === 3 && day !== 13 ? "rd" : "th";
      return `${day}${suffix}`;
    },
    formatEventYear(dateInput) {
      const dateObj = this.convertToDate(dateInput);
      return dateObj.getFullYear();
    },
    convertToDate(dateInput) {
      if (dateInput && dateInput._seconds) {
        // If date is a Firestore Timestamp object
        return new Date(dateInput._seconds * 1000);
      } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
        // If date is a string or number
        return new Date(dateInput);
      } else {
        return new Date();
      }
    },
    setInitialCarouselView() {
      const screenWidth = window.innerWidth;
      this.showLargeCarousel = screenWidth >= 1024;
      // this.showMediumCarousel = screenWidth >= 768 && screenWidth < 1024;
      // this.showSmallCarousel = screenWidth < 768;
    },
  },
});
</script>

<style scoped>
::v-deep #right img {
  position: relative;
  max-width: 60px;
  /* Override with specific size */
  max-height: 40px;
  margin-left: -2px;
  transform: scale(1);
  margin-bottom: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

::v-deep #left img {
  position: relative;
  max-width: 50px;
  /* Override with specific size */
  max-height: 35px;
  margin-right: 0px;
  transform: scale(1);
  margin-bottom: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

::v-deep #right img:hover,
::v-deep #left img:hover {
  filter: drop-shadow(0px 4px 8px #FFD700);
  /* Color shadow on hover */
}

/* General Styles */
.title {
  color: rgb(46, 46, 46);
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 30px;
  font-weight: bold;
  margin-top: 40px;
}

/* Loading Indicator and Error Message Styles */
.loading-indicator,
.error-message {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}

.error-message {
  color: red;
}

/* Carousel Container */
.carousel {
  padding: 0;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  color: #2c3e50;
  overflow-x: hidden;
  position: relative;
  --vc-pgn-margin: 5px;
  --vc-pgn-width: 15px;
  --vc-pgn-height: 15px;
  --vc-pgn-border-radius: 50%;
  --vc-pgn-background-color: white;
  --vc-pgn-active-color: gold;
  /* Responsive scaling */
}



/* Carousel Item Styles */
.carousel__item {
  margin: 10px 15px;
  flex: 0 0 600px;
  max-width: 100%;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 1;
}

.carousel__item.active {
  opacity: 1;
  transform: scale(1.05);
  border: 2px solid #333;
}

/* Carousel Slide Styles */
.carousel__slide {
  padding: 10px 10px;
  opacity: 0.9;
  transform: scale(0.9);
}


.carousel__slide--prev,
.carousel__slide--next {
  opacity: 0.8;
  transform: scale(0.95);
}

.carousel__slide--active {
  opacity: 1;
  transform: scale(1.2);
}

.carousel__slide--sliding {
  transition: transform 0.5s ease, opacity 0.5s ease;
}


/* Pagination Styles */
.carousel__pagination {
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
}

.carousel__pagination-button {
  display: block;
  border: 0;
  cursor: pointer;
  padding: var(--vc-pgn-margin);
  background: transparent;
}

.carousel__pagination-button::after {
  content: '';
  width: var(--vc-pgn-width);
  height: var(--vc-pgn-height);
  border-radius: var(--vc-pgn-border-radius);
  background-color: var(--vc-pgn-background-color);
}

.carousel__pagination-button--active::after {
  background-color: gold;
}

@media(hover: hover) {
  .carousel__pagination-button:hover::after {
    background-color: gold;
  }
}

/* Card Styles */
.card {
  transform: scale(0.85);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.8s ease, box-shadow 0.8s ease;
  height: 100%;
  width:100%;
  max-width: 550px;
}

.card:hover {
  transform: scale(0.9);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.card img {
  width: 100%;
  height: auto;
}

/* Card Body Styles */
.card-body {
  display: flex;
  padding: 20px;
  background-color: white;
}

/* Card Left Section */
.card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.month {
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 0px;
}

.year {
  font-size: 17px;
  color: #777;
}

/* Card Right Section */
.card-right {
  flex: 2;
  padding-left: 20px;
}

.date,
.date-month {
  font-size: 16px;
  font-weight: bold;
}

.event-details {
  font-size: 14px;
  color: #555;
  margin-top: 5px;
}

.event-title {
  font-size: 16px;
  font-weight: bold;
  display: -webkit-box;
  /* Required for multi-line truncation */
  -webkit-line-clamp: 1;
  /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  /* Allows wrapping of text */
}

.event-subtitle {
  font-size: 14px;
  color: #777;
}

.star-icon {
  color: gold;
  margin-right: 5px;
}
</style>
