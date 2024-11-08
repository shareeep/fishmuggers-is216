<template>
  <div class="home-container">
    <Navbar />
    <main id="scrollable-element">
      <div class="search-filter-container">
        <!-- Add ref="searchFilterRef" to access reset method from here -->
        <search_filter ref="searchFilterRef" @filters-applied="handleFiltersApplied"
          @filters-reset="handleFiltersReset" />
        <h1 class="title">Events</h1>
      </div>
      <!-- Event Type Tabs -->
      <div class="profile-tabs">
        <button :class="{ active: selectedEventType === 'large' }" @click="setEventType('large')">Large Scale</button>
        <button :class="{ active: selectedEventType === 'casual' }" @click="setEventType('casual')">Casual</button>
      </div>
      <div class="content-container">
        <carousel v-if="!filtersApplied" :selectedEventType="selectedEventType" />
        <FilteredEvents v-if="filtersApplied" :filters="appliedFilters" :selectedEventType="selectedEventType" />
      </div>
    </main>
    <!-- Go to Add Events Page -->
    <router-link to="/eventsadmin">
      <button class="floating-btn">🐾</button>
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Protected/Navbar.vue';
import search_filter from '@/components/Protected/Events/SearchandFilter.vue';
import carousel from '@/components/Protected/Events/Carousel.vue';
import FilteredEvents from '@/components/Protected/Events/FilteredEvents.vue';
import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';

Scrollbar.use(OverscrollPlugin);

onMounted(() => {
  const scrollbar = Scrollbar.init(document.querySelector('#scrollable-element'), {
    damping: 0.05,
    renderByPixels: true,
    alwaysShowTracks: false,
    continuousScrolling: false,
    plugins: {
      overscroll: {
        effect: 'bounce',
        damping: 0.2,
        maxOverscroll: 70,
        direction: 'y',
      },
    },
  });
  scrollbar.track.xAxis.element.style.opacity = '0';
  scrollbar.track.yAxis.element.style.opacity = '0';
});

const filtersApplied = ref(false);
const appliedFilters = ref({});
const selectedEventType = ref('large');
const searchFilterRef = ref(null);

function handleFiltersApplied(filters) {
  const hasFilters =
    filters.searchQuery ||
    filters.petType.cats ||
    filters.petType.dogs ||
    filters.eventSize ||
    filters.dateRange.startDate ||
    filters.dateRange.endDate ||
    (filters.location && filters.location.lat && filters.location.lng);
    console.log('This is the location lat: ' + filters.location?.lat + ', lng: ' + filters.location?.lng);

  filtersApplied.value = hasFilters;
  appliedFilters.value = filters;
}

function handleFiltersReset() {
  filtersApplied.value = false;
  appliedFilters.value = {};
}

function setEventType(type) {
  selectedEventType.value = type;
  filtersApplied.value = false;
  handleFiltersReset();
  // Use searchFilterRef to call resetFilters on search_filter component
  searchFilterRef.value?.resetFilters();
}
</script>


<style scoped>
.title {
  color: rgb(46, 46, 46);
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 30px;
  font-weight: bold;
  margin-top: 40px;
}

.profile-tabs {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #ddd;
  padding: 10px;
  margin-top: 20px;
  font-size: 16px;

}

.profile-tabs button {
  background: none;
  border: none;
  font-weight: bold;
  color: #888;
  cursor: pointer;
}

.profile-tabs .active {
  color: black;
  border-bottom: 2px solid black;
}

@media (max-width: 767px) {
  .flex.flex-col>div {
    margin-bottom: 0px !important;
    /* Overrides the default mb-4 class */
  }
}

#scrollable-element {
  width: 100%;
  height: 100%;
  overflow-y: scroll !important;
  overflow-x: hidden;
}

.home-container {
  display: flex;
  height: 100vh;
  overflow-x: hidden;
  width: 100%;
}

.navbar {
  width: 250px;
  height: 100vh;
  position: fixed;
}

main { 
  align-items: center;
  margin-left: 250px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: #FCEFB4;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 20px;
  box-sizing: border-box;
  width: 100vh;
  margin-bottom: 55px;
}

.floating-btn {
  position: fixed !important;
  bottom: 20px;
  right: 20px;
  background-color: gold;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 30px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.floating-btn:hover {
  background-color: #e6c200;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}


.floating-btn:active {
  transform: scale(0.98);
}

/* Responsive Adjustments */
@media (max-width: 991px) {
  .navbar {
    width: 80px;
  }

  main {
    margin-left: 80px;
    padding: 15px;
  }

  .floating-btn {
    width: 50px;
    height: 50px;
    font-size: 30px;
  }
}

@media (max-width: 767px) {
  .home-container {
    flex-direction: column;
  }

  .navbar {
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #f9f9f9;
    z-index: 10;
  }

  main {
    margin-left: 0;
    margin-top: 0;
    padding: 15px;
    height: calc(100vh - 50px);
    /* Account for navbar height on mobile */
    overflow-y: auto;
  }

  .floating-btn {
    bottom: 60px;
    /* Place above mobile navbar */
    right: 20px;
    width: 50px;
    height: 50px;
    font-size: 30px;
  }
}


/* Center the content-container */
.content-container {
  max-width: 1400px;
  /* Set a maximum width for the centered content */
  width: 100%;
  /* Take full width up to the max-width */
  margin: 0 auto;
  /* Center content-container */
  padding-top: 20px;
  /* Optional: Add padding if needed */
}

.search-filter-container {
  position: relative;
  z-index: 1000;
}
</style>

