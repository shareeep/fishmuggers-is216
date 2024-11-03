<!-- SearchandFilter.vue -->
<template>
  <div class="search-filter-wrapper">
    <!-- Search Input -->
    <div class="mb-4">
      <label for="search" class="block text-gray-700">Search:</label>
      <input
        id="search"
        v-model="searchQuery"
        type="search"
        @input="handleSearchInput"
        class="w-full border border-gray-300 p-2 rounded"
        placeholder="Search for events..."
      />
    </div>

    <!-- Pet Type Dropdown -->
    <div class="dropdown-wrapper">
      <button @click="togglePetTypeDropdown" type="button">
        Pet Type
      </button>

      <!-- Pet Type Dropdown Menu -->
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
          <!-- Add more pet types as needed -->
        </ul>
        <button @click="applyPetTypeFilters">Apply</button>
      </div>
    </div>

    <!-- Event Size Dropdown -->
    <div class="dropdown-wrapper">
      <button @click="toggleEventSizeDropdown" type="button">
        Event Size
        <!-- Dropdown Icon (optional) -->
      </button>

      <!-- Event Size Dropdown Menu -->
      <div v-if="isEventSizeDropdownOpen" class="custom-dropdown">
        <h6>Maximum Attendees</h6>
        <select v-model.number="selectedEventSize">
          <option disabled value="">Select maximum attendees</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <button @click="applyEventSizeFilters">Apply</button>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="dropdown-wrapper">
      <button @click="toggleDateRangeDropdown" type="button">
        Date Range
        <!-- Dropdown Icon (optional) -->
      </button>

      <!-- Date Range Dropdown Menu -->
      <div v-if="isDateRangeDropdownOpen" class="custom-dropdown">
        <h6>Date Range</h6>
        <div>
          <label for="start-date">Start Date:</label>
          <input
            id="start-date"
            v-model="startDate"
            type="date"
            class="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label for="end-date">End Date:</label>
          <input
            id="end-date"
            v-model="endDate"
            type="date"
            class="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button @click="applyDateRangeFilters">Apply</button>
      </div>
    </div>

    <!-- Location Dropdown -->
    <div class="dropdown-wrapper">
      <button @click="toggleLocationDropdown" type="button">
        Location
        <!-- Dropdown Icon (optional) -->
      </button>

      <!-- Location Dropdown Menu -->
      <div v-if="isLocationDropdownOpen" class="custom-dropdown">
        <h6>Location</h6>
        <input
          v-model="searchedLoc"
          @input="fetchLocationSuggestions"
          type="text"
          placeholder="Search for Location"
          class="w-full border border-gray-300 p-2 rounded"
        />
        <ul v-if="locationSuggestions.length">
          <li
            v-for="suggestion in locationSuggestions"
            :key="suggestion.id"
            @click="selectLocation(suggestion)"
          >
            {{ suggestion.name }}
          </li>
        </ul>
        <button @click="applyLocationFilters">Apply</button>
      </div>
    </div>

    <!-- Apply and Reset Filters Buttons -->
    <div class="filter-buttons">
      <button @click="applyFilters">Apply Filters</button>
      <button @click="resetFilters">Reset Filters</button>
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
.wrapper {
    width: 100%;
    position: relative;
}

/* DROPDOWN CONTAINER */
.custom-dropdown {
    position: fixed;
    padding: 1rem;
    /* Ensure uniform dropdown padding */
    background-color: #FDF8E1;
    /* Cornsilk */
    border: 1px solid #FAE588;
    /* Jasmine */
    position: absolute;
    /* Set dropdown menu position to absolute */
    top: 100%;
    /* Position the menu below the button */
    left: 0;
    /* Align it to the left of the button */
    z-index: 100000000000;
    /* Ensure it appears above other elements */

}

/* Dropdown header */
.custom-dropdown h6 {
    color: black;
    font-weight: bold;
}

/* Checkbox styling */
.custom-dropdown input[type="checkbox"] {
    accent-color: #7B61FF;
}

/* Apply button */
.custom-dropdown button {
    background-color: #7B61FF;
    color: #FFFFFF;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s;
}


.custom-dropdown button:hover {
    background-color: #5e48e6;
}

/* List items */
.custom-dropdown ul li label {
    color: #333333;
    /* Darker for contrast */
}

.custom-dropdown ul li:hover {
    background-color: #FDF4CB;
    /* Lemon Chiffon */
    border-radius: 5px;
}

.dropdown-wrapper {
    position: relative;
    /*Set relative positioning for dropdown menus */
    padding: 0;
}


/* Search Bar */
input[type="search"] {
    background-color: white;
    /* White fill */
    border: 2px solid #FFD700;
    /* Gray border */
    border-radius: 15px;
    /* Rounded corners */
    width: 400px;
    /* Set the width of the search bar */
    color: black;
    transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="search"]:focus {
    border-color: #FAE588;
    /* Change border color on focus (blue) */
    box-shadow: 0 0 0 2px #FFD700;
    /* Blue focus outline */
    color: black;
}

button {
    border-radius: 12px;
    /* Ensure the button also has rounded corners */
}

/* SORT BY */
.sort-by {
    /* Flexbox for sort by section */
    justify-content: center;
    width: 100%;
    /* Center align items */
    margin-top: 15px;
    /* Margin on top */
}

/* SORT BY */
@media (min-width: 1024px) {
    .sort-by {
        display: flex;
        /* Flexbox for sort by section */
        align-items: center;
        /* Center align items */
        margin-top: 15px;
        /* Margin on top */
        transform: scale(0.9);
    }
}

.apply {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.apply:hover {
    background-color: #e6c200;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}


.apply:active {
    transform: scale(0.98);

}
</style>
