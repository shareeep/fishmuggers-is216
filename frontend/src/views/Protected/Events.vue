<template>
  <div class="home-container">
    <Navbar />
    <main>
      <div class="search-filter-container">
        <search_filter @filters-applied="handleFiltersApplied" @filters-reset="handleFiltersReset" />
      </div>
      <div class="content-container">
        <carousel v-if="!filtersApplied" />
        <FilteredEvents v-if="filtersApplied" :filters="appliedFilters" />
      </div>
      <!--Go to Add Events Page-->
      <router-link to="/eventsadmin">
        <button class="floating-btn">🐾</button>
      </router-link>
    </main>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import Navbar from '@/components/Protected/Navbar.vue';
import search_filter from '@/components/Protected/Events/SearchandFilter.vue';
import carousel from '@/components/Protected/Events/Carousel.vue';
import FilteredEvents from '@/components/Protected/Events/FilteredEvents.vue';

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
/* Styling for the Navbar */
.navbar {
  width: 250px;
  /* Width of the navbar */
  height: 100vh;
  /* Full height of the viewport */
  position: sticky;
  /* Make the navbar sticky */
  top: 0;
  /* Stick to the top of the page */
}

.home-container {
  display: flex;
  /* Set flexbox layout for the container */
}

/* can change */
main {
  flex-grow: 1;
  /* Allow main to take the remaining width */
  padding: 20px;
  /* Add padding for spacing */
  /* Optional styling */
  background-color: #FCEFB4;
  /* Example background color */
  overflow-y: auto;
  /* Allow scrolling if content overflows */
}

/* Floating Button */
.floating-btn {
  position: fixed;
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
}

.floating-btn:hover {
  background-color: rgb(238, 207, 30);
}

</style>