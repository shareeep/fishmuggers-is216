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
    </main>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import Navbar from '@/components/Protected/Navbar.vue';
import search_filter from '@/components/Protected/SearchandFilter.vue';
import carousel from '@/components/Protected/Carousel.vue';
import FilteredEvents from '@/components/Protected/FilteredEvents.vue';

// State to track if filters are applied and the applied filter data
const filtersApplied = ref(false);
const appliedFilters = ref({}); // This will hold the filter values

// This function is called when filters are applied
function handleFiltersApplied(filters) {
  // Check if any filters are actually applied (not empty)
  const hasFilters =
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
</script>

<style scoped>
/* Styling for the Navbar */
.navbar {
  width: 250px;
  height: 100vh;
  position: sticky;
  top: 0;
}

/* Fixed search filter at the top */
.fixed-search-filter {
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
  /* Adjust based on Navbar width */
  background-color: #FCEFB4;
  padding: 10px 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Content wrapper to push content below the fixed search filter */
.content-wrapper {
  padding-top: 120px;
  /* Ensure space below the fixed filter */
  width: 100%;
  display: flex;
  justify-content: center;
  /* Horizontally center content */
  align-items: center;
  /* Vertically center content */
  flex-direction: column;
  /* Stack elements vertically */
}

/* Main content layout */
.home-container {
  display: flex;
  width: 100%;
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #FCEFB4;
  overflow-y: auto;
  align-items: center;
  /* Center main content horizontally */
}

/* Responsive adjustments for smaller screens */
@media (max-width: 640px) {
  .navbar {
    width: 200px;
  }

  .fixed-search-filter {
    width: calc(100% - 200px);
  }

  .content-wrapper {
    padding-top: 120px;
    justify-content: center;
    /* Ensure vertical centering on smaller screens */
  }
}

@media (max-width: 768px) {
  .navbar {
    width: 200px;
  }

  .fixed-search-filter {
    width: calc(100% - 200px);
  }

  .content-wrapper {
    padding-top: 120px;
  }
}

@media (max-width: 1024px) {
  .navbar {
    width: 200px;
  }

  .fixed-search-filter {
    width: calc(100% - 200px);
  }

  .content-wrapper {
    padding-top: 120px;
  }
}

@media (max-width: 1289px) {
  .navbar {
    width: 250px;
  }

  .fixed-search-filter {
    width: calc(100% - 250px);
  }

  .content-wrapper {
    padding-top: 120px;
  }
}
</style>
