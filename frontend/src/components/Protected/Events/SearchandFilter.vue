<template>
  <div class="search-filter-wrapper">
    <div class="filters-container">
      <!-- Search Input -->
      <div class="filter-item search-input">
        <input
          id="search"
          v-model="searchQuery"
          type="search"
          @input="handleSearchInput"
          class="search-bar"
          placeholder="Search for events..."
        />
      </div>

      <!-- Pet Type Dropdown -->
      <div class="filter-item dropdown-wrapper">
        <button class="dropdown-btn" @click="togglePetTypeDropdown" type="button">
          Pet Type <i class="fas fa-caret-down"></i>
        </button>
        <div v-if="isPetTypeDropdownOpen" class="custom-dropdown">
          <h6>Category</h6>
          <ul>
            <li>
              <input id="cats" type="checkbox" v-model="selectedCats" />
              <label for="cats">Cats</label>
            </li>
            <li>
              <input id="dogs" type="checkbox" v-model="selectedDogs" />
              <label for="dogs">Dogs</label>
            </li>
            <li>
              <input id="birds" type="checkbox" v-model="selectedBirds" />
              <label for="birds">Birds</label>
            </li>
          </ul>
          <button class="apply-btn" @click="applyPetTypeFilters">Apply</button>
        </div>
      </div>

      <!-- Event Size Dropdown -->
      <div class="filter-item dropdown-wrapper">
        <button class="dropdown-btn" @click="toggleEventSizeDropdown" type="button">
          Event Size <i class="fas fa-caret-down"></i>
        </button>
        <div v-if="isEventSizeDropdownOpen" class="custom-dropdown">
          <h6>Maximum Attendees</h6>
          <select v-model.number="selectedEventSize" class="dropdown-select">
            <option disabled value="">Select maximum attendees</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <button class="apply-btn" @click="applyEventSizeFilters">Apply</button>
        </div>
      </div>

      <!-- Date Range Filter -->
      <div class="filter-item dropdown-wrapper">
        <button class="dropdown-btn" @click="toggleDateRangeDropdown" type="button">
          Date Range <i class="fas fa-caret-down"></i>
        </button>
        <div v-if="isDateRangeDropdownOpen" class="custom-dropdown">
          <h6>Date Range</h6>
          <div>
            <label for="start-date" class="block text-gray-700">Start Date:</label>
            <input
              id="start-date"
              v-model="startDate"
              type="date"
              class="date-input"
            />
          </div>
          <div class="mt-2">
            <label for="end-date" class="block text-gray-700">End Date:</label>
            <input
              id="end-date"
              v-model="endDate"
              type="date"
              class="date-input"
            />
          </div>
          <button class="apply-btn mt-2" @click="applyDateRangeFilters">Apply</button>
        </div>
      </div>

      <!-- Location Dropdown -->
      <div class="filter-item dropdown-wrapper">
        <button class="dropdown-btn" @click="toggleLocationDropdown" type="button">
          Location <i class="fas fa-caret-down"></i>
        </button>
        <div v-if="isLocationDropdownOpen" class="custom-dropdown">
          <h6>Location</h6>
          <input
            v-model="searchedLoc"
            @input="fetchLocationSuggestions"
            type="text"
            placeholder="Search for Location"
            class="location-input"
          />
          <ul v-if="locationSuggestions.length" class="location-suggestions">
            <li
              v-for="suggestion in locationSuggestions"
              :key="suggestion.id"
              @click="selectLocation(suggestion)"
              class="suggestion-item"
            >
              {{ suggestion.name }}
            </li>
          </ul>
          <button class="apply-btn mt-2" @click="applyLocationFilters">Apply</button>
        </div>
      </div>
    </div>

    <!-- Apply and Reset Filters Buttons -->
    <div class="filter-buttons mt-4">
      <button class="apply-btn mr-2" @click="applyFilters">Apply Filters</button>
      <button class="reset-btn" @click="resetFilters">Reset Filters</button>
    </div>
  </div>
</template>

<script>
export default {
  // Declare the emitted events
  emits: ['filtersApplied', 'filtersReset'],

  data() {
    return {
      searchQuery: '',

      // Pet Type Filter
      isPetTypeDropdownOpen: false,
      selectedCats: false,
      selectedDogs: false,
      selectedBirds: false,

      // Event Size Filter
      isEventSizeDropdownOpen: false,
      selectedEventSize: '',

      // Date Range Filter
      isDateRangeDropdownOpen: false,
      startDate: '',
      endDate: '',

      // Location Filter
      isLocationDropdownOpen: false,
      searchedLoc: '',
      locationSuggestions: [],
      selectedLocation: '',
    };
  },
  methods: {
    // Toggle Pet Type Dropdown
    togglePetTypeDropdown() {
      this.isPetTypeDropdownOpen = !this.isPetTypeDropdownOpen;
    },

    // Apply Pet Type Filters
    applyPetTypeFilters() {
      const filters = {
        searchQuery: this.searchQuery,
        petType: {
          cats: this.selectedCats,
          dogs: this.selectedDogs,
          birds: this.selectedBirds,
        },
        eventSize: this.selectedEventSize,
        dateRange: {
          startDate: this.startDate,
          endDate: this.endDate,
        },
        location: this.selectedLocation,
      };
      this.$emit('filtersApplied', filters);
      this.isPetTypeDropdownOpen = false;
    },

    // Toggle Event Size Dropdown
    toggleEventSizeDropdown() {
      this.isEventSizeDropdownOpen = !this.isEventSizeDropdownOpen;
    },

    // Apply Event Size Filters
    applyEventSizeFilters() {
      const filters = {
        searchQuery: this.searchQuery,
        petType: {
          cats: this.selectedCats,
          dogs: this.selectedDogs,
          birds: this.selectedBirds,
        },
        eventSize: this.selectedEventSize,
        dateRange: {
          startDate: this.startDate,
          endDate: this.endDate,
        },
        location: this.selectedLocation,
      };
      this.$emit('filtersApplied', filters);
      this.isEventSizeDropdownOpen = false;
    },

    // Toggle Date Range Dropdown
    toggleDateRangeDropdown() {
      this.isDateRangeDropdownOpen = !this.isDateRangeDropdownOpen;
    },

    // Apply Date Range Filters
    applyDateRangeFilters() {
      const filters = {
        searchQuery: this.searchQuery,
        petType: {
          cats: this.selectedCats,
          dogs: this.selectedDogs,
          birds: this.selectedBirds,
        },
        eventSize: this.selectedEventSize,
        dateRange: {
          startDate: this.startDate,
          endDate: this.endDate,
        },
        location: this.selectedLocation,
      };
      this.$emit('filtersApplied', filters);
      this.isDateRangeDropdownOpen = false;
    },

    // Toggle Location Dropdown
    toggleLocationDropdown() {
      this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
    },

    // Fetch Location Suggestions
    fetchLocationSuggestions() {
      if (this.searchedLoc.trim() === '') {
        this.locationSuggestions = [];
        return;
      }

      const oneMapURL = "https://www.onemap.gov.sg/api/common/elastic/search?searchVal=";
      const url = `${oneMapURL}${encodeURIComponent(this.searchedLoc)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            this.locationSuggestions = data.results.map(item => ({
              id: item.SEARCHVAL,
              name: item.SEARCHVAL,
            }));
          } else {
            this.locationSuggestions = [];
          }
        })
        .catch(error => {
          console.error('Error fetching location suggestions:', error);
        });
    },

    // Select Location from Suggestions
    selectLocation(suggestion) {
      this.selectedLocation = suggestion.name;
      this.searchQuery = suggestion.name; // Optionally update search query
      this.locationSuggestions = [];
      this.applyLocationFilters();
    },

    // Apply Location Filters
    applyLocationFilters() {
      const filters = {
        searchQuery: this.searchQuery,
        petType: {
          cats: this.selectedCats,
          dogs: this.selectedDogs,
          birds: this.selectedBirds,
        },
        eventSize: this.selectedEventSize,
        dateRange: {
          startDate: this.startDate,
          endDate: this.endDate,
        },
        location: this.selectedLocation,
      };
      this.$emit('filtersApplied', filters);
      this.isLocationDropdownOpen = false;
    },

    // Handle Search Input
    handleSearchInput() {
    console.log('Search Query:', this.searchQuery);
      const filters = {
        searchQuery: this.searchQuery,
        petType: {
          cats: this.selectedCats,
          dogs: this.selectedDogs,
          birds: this.selectedBirds,
        },
        eventSize: this.selectedEventSize,
        dateRange: {
          startDate: this.startDate,
          endDate: this.endDate,
        },
        location: this.selectedLocation,
      };
        console.log(this.selectLocation)
        this.$emit('filtersApplied', filters);
    },

// Apply All Filters (when clicking Apply Filters button)
// Before emitting filters
applyFilters() {
  const filters = {
    searchQuery: this.searchQuery,
    petType: {
      cats: this.selectedCats,
      dogs: this.selectedDogs,
      birds: this.selectedBirds,
    },
    eventSize: this.selectedEventSize,
    dateRange: {
      startDate: this.startDate,
      endDate: this.endDate,
    },
    location: this.selectedLocation,
  };

  console.log('Filters to be emitted:', filters); // Log the filters being emitted
  this.$emit('filtersApplied', filters);
},


    // Reset All Filters
    resetFilters() {
      this.searchQuery = '';
      this.selectedCats = false;
      this.selectedDogs = false;
      this.selectedBirds = false;
      this.selectedEventSize = '';
      this.startDate = '';
      this.endDate = '';
      this.selectedLocation = '';
      this.locationSuggestions = [];

      this.$emit('filtersReset');
    },
  },
};
</script>

<style scoped>
.search-filter-wrapper {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.filter-item {
  flex: 1 1 200px; /* Adjusts width as necessary */
  min-width: 180px;
}

.search-bar {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #ddd;
  padding: 10px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-bar:focus {
  border-color: #7b61ff;
  outline: none;
  box-shadow: 0 0 5px rgba(123, 97, 255, 0.3);
}

.dropdown-btn {
  width: 100%;
  background-color: #7b61ff;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown-btn:hover {
  background-color: #5e48e6;
}

.custom-dropdown {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  width: 100%;
}

.date-input,
.dropdown-select,
.location-input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 8px;
  margin-top: 5px;
}

.apply-btn {
  background-color: #7b61ff;
  color: #fff;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.apply-btn:hover {
  background-color: #5e48e6;
}

.reset-btn {
  background-color: #ddd;
  color: #333;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: #bbb;
}

.location-suggestions {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.suggestion-item {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.3s;
}

.suggestion-item:hover {
  background-color: #f4f4f4;
}
</style>