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
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #ffffff;
  z-index: 1;
}

.home-container {
  display: flex;
  /* Set flexbox layout for the container */
}

/* can change */
main {
  margin-left: 250px; /* Offset for the navbar width */
  align-items: center;
  flex-grow: 1;
  padding: 20px;
  background-color: #FCEFB4;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
}

/* Center the content-container */
.content-container {
  max-width: 800px; /* Set a maximum width for the centered content */
  width: 100%; /* Take full width up to the max-width */
  margin: 0 auto; /* Center content-container */
  padding-top: 20px; /* Optional: Add padding if needed */
}

.search-filter-container{
  position:relative;
  z-index: 1000;
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