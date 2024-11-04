<template>
  <div class="home-container">
    <Navbar />
    <main id="scrollable-element">
      <div class="search-filter-container">
        <search_filter @filters-applied="handleFiltersApplied" @filters-reset="handleFiltersReset" />
      </div>
      <div class="content-container">
        <carousel v-if="!filtersApplied" />
        <FilteredEvents v-if="filtersApplied" :filters="appliedFilters" />
      </div>

    </main>
    <!--Go to Add Events Page-->
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

  // Hide the scrollbar track by setting its opacity to 0
  scrollbar.track.xAxis.element.style.opacity = '0';
  scrollbar.track.yAxis.element.style.opacity = '0';
});


// State to track if filters are applied and the applied filter data
const filtersApplied = ref(false);
const appliedFilters = ref({}); // This will hold the filter values

// This function is called when filters are applied
function handleFiltersApplied(filters) {
  // Check if any filters are actually applied (not empty)
  const hasFilters =
    filters.searchQuery ||
    filters.petType.cats ||
    filters.petType.dogs ||
    filters.eventSize ||
    filters.dateRange.startDate ||
    filters.dateRange.endDate ||
    filters.location;

  filtersApplied.value = hasFilters; // Set the filters as applied only if filters are not empty
  appliedFilters.value = filters; // Store the applied filters
}

// This function is called when filters are reset
function handleFiltersReset() {
  filtersApplied.value = false; // Reset the filtersApplied to false to show the carousel
  appliedFilters.value = {}; // Clear the applied filters
}
// function handleSearchCleared() {
//   filtersApplied.value = false; // No filters applied, so reset
//   appliedFilters.value = {}; // Clear filters
// }



</script>

<style scoped>
html,
body {
  overflow-x: hidden;
  width: 100%;
}

body {
  overflow-x: hidden;
}

#scrollable-element {
  width: 100%;
  height: 100%;
  overflow-y: scroll !important;
  overflow-x: hidden !important;
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
