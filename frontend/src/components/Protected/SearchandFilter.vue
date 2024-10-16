<template>
    <div class="max-w-md mx-auto">
        <!--SEARCH BAR-->
        <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-10">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </div>
            <input type="search" id="default-search"
                class="block w-full pl-10 p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-[#FDF4CB] focus:border-[#FDF4CB] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#FDF4CB] dark:focus:border-[#FDF4CB] drop-shadow-md"
                placeholder="Search for an event" required />
            <button
                class="text-black absolute end-2.5 bottom-2.5 bg-[#FFD700] hover:bg-[#E6C200] font-bold rounded-lg text-sm px-4 py-2">Search
            </button>
        </div>
    </div>

    <!-- Sort by -->
    <div class="sort-by">
        <span class="sort-by-text me-3" style="font-weight: bold;color:#7B61FF;">Sort by:</span>

        <div class="dropdown-wrapper me-3 d-inline-block">
            <!-- Pet Type Dropdown -->
            <button @click="togglePetTypeDropdown" :class="[
                'border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center me-3',
                isPetTypeFilled ? 'bg-[#7B61FF] text-white' : 'text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white'
            ]" type="button">
                Pet Type
                <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            <!-- Pet Type Dropdown Menu -->
            <div v-if="isPetTypeDropdownOpen" class="custom-dropdown z-10 w-56 p-3 rounded-lg shadow-lg">
                <h6 class="mb-3 text-sm font-medium text-gray-800">
                    Category
                </h6>
                <ul class="space-y-2 text-sm">
                    <li class="flex items-center">
                        <input id="cats" type="checkbox" v-model="selectedCats"
                            class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500" />
                        <label for="cats" class="ml-2 text-sm font-medium text-gray-900">
                            Cats
                        </label>
                    </li>

                    <li class="flex items-center">
                        <input id="dogs" type="checkbox" v-model="selectedDogs"
                            class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500" />
                        <label for="dogs" class="ml-2 text-sm font-medium text-gray-900">
                            Dogs
                        </label>
                    </li>
                </ul>

                <!-- Apply Button -->
                <button @click="applyPetTypeFilters"
                    class="mt-3 w-full bg-[#7B61FF] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#5e48e6]">
                    Apply
                </button>
            </div>
        </div>
        <div class="dropdown-wrapper me-3 d-inline-block">
            <!-- Event Size Dropdown -->
            <button @click="toggleEventSizeDropdown" :class="[
                'border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center me-3',
                isEventSizeFilled ? 'bg-[#7B61FF] text-white' : 'text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white'
            ]" type="button">
                Event Size
                <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            <!-- Event Size Dropdown Menu -->
            <div v-if="isEventSizeDropdownOpen" class="custom-dropdown z-10 w-56 p-3 rounded-lg shadow-lg">
                <h6 class="mb-3 text-sm font-medium text-gray-800">
                    Event Size
                </h6>
                <ul class="space-y-2 text-sm">
                    <li class="flex items-center">
                        <input id="lessThan10" type="radio" value="lessThan10" v-model="selectedEventSize"
                            class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500" />
                        <label for="lessThan10" class="ml-2 text-sm font-medium text-gray-900">
                            &lt;10
                        </label>
                    </li>

                    <li class="flex items-center">
                        <input id="tenToFifty" type="radio" value="tenToFifty" v-model="selectedEventSize"
                            class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500" />
                        <label for="tenToFifty" class="ml-2 text-sm font-medium text-gray-900">
                            10-50
                        </label>
                    </li>

                    <li class="flex items-center">
                        <input id="fiftyToHundred" type="radio" value="fiftyToHundred" v-model="selectedEventSize"
                            class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500" />
                        <label for="fiftyToHundred" class="ml-2 text-sm font-medium text-gray-900">
                            50-100
                        </label>
                    </li>

                    <li class="flex items-center">
                        <input id="moreThanHundred" type="radio" value="moreThanHundred" v-model="selectedEventSize"
                            class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500" />
                        <label for="moreThanHundred" class="ml-2 text-sm font-medium text-gray-900">
                            &gt;100
                        </label>
                    </li>
                </ul>

                <!-- Apply Button -->
                <button @click="applyEventSizeFilters"
                    class="mt-3 w-full bg-[#7B61FF] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#5e48e6]">
                    Apply
                </button>
            </div>
        </div>

        <!-- Date Range Dropdown -->
        <div class="dropdown-wrapper me-3 d-inline-block">
            <button @click="toggleDateRangeDropdown" :class="[
                'border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center me-3',
                isDateRangeFilled ? 'bg-[#7B61FF] text-white' : 'text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white'
            ]" type="button">
                Date Range
                <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            <!-- Date Range Dropdown Menu -->
            <div v-if="isDateRangeDropdownOpen" class="custom-dropdown z-10 w-56 p-3 rounded-lg shadow-lg">
                <h6 class="mb-3 text-sm font-medium text-gray-800">Date Range</h6>
                <div class="mb-4">
                    <label for="start-date" class="block text-sm font-medium text-gray-700">From:</label>
                    <div class="relative">
                        <input id="start-date" v-model="startDate" type="date" :min="today"
                            placeholder="Select start date"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        </div>
                    </div>
                </div>
                <div>
                    <label for="end-date" class="block text-sm font-medium text-gray-700">To:</label>
                    <div class="relative">
                        <input id="end-date" v-model="endDate" type="date" :min="today" placeholder="Select end date"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        </div>
                    </div>
                </div>

                <!-- Apply Button -->
                <button @click="applyDateRangeFilters"
                    class="mt-3 w-full bg-[#7B61FF] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#5e48e6]">
                    Apply
                </button>
            </div>
        </div>

        <!-- Location Dropdown -->
        <div class="dropdown-wrapper me-3 d-inline-block">
            <button @click="toggleLocationDropdown" :class="[
                'border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center me-3',
                isLocationFilled ? 'bg-[#7B61FF] text-white' : 'text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white'
            ]" type="button">
                Location
                <svg class="w-4 h-4 ml-2 z-10" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <!-- Location Dropdown Menu -->
            <div v-if="isLocationDropdownOpen" class="custom-dropdown z-10 w-56 p-3 rounded-lg shadow-lg">
                <h6 class="mb-3 text-sm font-medium text-gray-800">Location</h6>
                <div class="mb-4">
                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-10">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input v-model="searchedLoc" @input="fetchLocationSuggestions" type="text"
                            placeholder="Search for Location"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-9">
                    </div>
                </div>

                <!-- Suggestions -->
                <ul v-if="locationSuggestions.length" class="bg-white border border-gray-300 rounded-lg shadow-lg">
                    <li v-for="suggestion in locationSuggestions" :key="suggestion.id"
                        @click="selectLocation(suggestion)" class="px-2 py-1 cursor-pointer hover:bg-gray-200">
                        {{ suggestion.name }}
                    </li>
                </ul>
                <!-- Apply Button -->
                <button @click="applyLocationFilters"
                    class="mt-2 w-full bg-[#7B61FF] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#5e48e6]">
                    Apply
                </button>
            </div>
        </div>
        <!-- Reset Filters Button -->
        <button @click="resetFilters"
            class="rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center me-3 text-black  bg-[#FFD700] hover:bg-[#E6C200] font-bold text-sm">
            Reset Filters
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            today: new Date().toISOString().split('T')[0], // Calculate today's date
            // PET SIZE FILTER
            isPetTypeDropdownOpen: false,
            selectedCats: false,
            selectedDogs: false,
            isPetTypeFilled: false,

            // EVENT SIZE FILTER
            isEventSizeDropdownOpen: false,
            selectedEventSize: null, // Default to null
            isEventSizeFilled: false,

            // DATE RANGE FILTER
            isDateRangeDropdownOpen: false,
            startDate: '',
            endDate: '',
            isDateRangeFilled: false,

            // LOCATION FILTER
            isLocationDropdownOpen: false,
            searchedLoc: '',
            isLocationFilled: false,
            locationSuggestions: [],
            selectedLocation: null, // Add this to hold selected location
        };
    },
    methods: {
        togglePetTypeDropdown() {
            this.isPetTypeDropdownOpen = !this.isPetTypeDropdownOpen;
        },
        toggleEventSizeDropdown() {
            this.isEventSizeDropdownOpen = !this.isEventSizeDropdownOpen;
        },
        toggleDateRangeDropdown() {
            this.isDateRangeDropdownOpen = !this.isDateRangeDropdownOpen;
        },
        toggleLocationDropdown() {
            this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
        },
        applyPetTypeFilters() {
            this.isPetTypeFilled = this.selectedCats || this.selectedDogs;
            this.isPetTypeDropdownOpen = false;
        },
        applyEventSizeFilters() {
            this.isEventSizeFilled = this.selectedEventSize !== null;
            this.isEventSizeDropdownOpen = false;
        },
        applyDateRangeFilters() {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            // Set default values for startDate and endDate if they're empty
            if (!this.startDate) {
                this.startDate = today; // Set startDate to today if empty
            }

            // If endDate is empty, leave it as null (the user may not want to specify an end date)

            // Check if the user has selected a start date
            if (this.endDate) {
                this.isDateRangeFilled = true;
                // Handle filtering logic based on startDate and endDate
            } else {
                // Optionally handle empty input case
                this.isDateRangeFilled = false;
            }

            this.isDateRangeDropdownOpen = false; // Close dropdown after applying
        },
        fetchLocationSuggestions() {
            if (this.searchedLoc.trim() === '') {
                this.locationSuggestions = []; // Clear suggestions if input is empty
                return;
            }

            const oneMapURL = "https://www.onemap.gov.sg/api/common/elastic/search?searchVal=";
            const url = `${oneMapURL}${encodeURIComponent(this.searchedLoc)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.results && data.results.length > 0) {
                        // Use a Set to keep track of unique location names
                        const uniqueResults = new Map();
                        data.results.forEach(item => {
                            // Use the SEARCHVAL as the key to avoid duplicates
                            uniqueResults.set(item.SEARCHVAL, {
                                id: item.SEARCHVAL,
                                name: item.SEARCHVAL,
                                location: item.LAYER // Adjust based on actual structure of response
                            });
                        });
                        // Convert the Map back to an array
                        this.locationSuggestions = Array.from(uniqueResults.values());
                    } else {
                        this.locationSuggestions = []; // Clear suggestions if no results
                    }
                })
                .catch(error => {
                    console.error('Error fetching location suggestions:', error);
                });
        },
        selectLocation(suggestion) {
            this.selectedLocation = suggestion.location; // Store selected location
            this.searchedLoc = suggestion.name; // Set input value to selected name
            this.locationSuggestions = []; // Clear suggestions
        },

        applyLocationFilters() {
            this.isLocationFilled = true; // Set filled status to true
            this.isLocationDropdownOpen = false; // Close dropdown after applying
        },
        resetFilters() {
            this.selectedCats = false;
            this.selectedDogs = false;
            this.selectedEventSize = null;
            this.startDate = '';
            this.endDate = '';
            this.selectedLocation = null; // Reset selected location
            this.searchedLoc = ''; // Reset search input for location
            this.isPetTypeFilled = false;
            this.isEventSizeFilled = false;
            this.isDateRangeFilled = false;
            this.isLocationFilled = false; // Reset location filled status
            this.locationSuggestions = []; // Clear suggestions if necessary
        },
    }
};
</script>

<style scoped>
/* DROPDOWN CONTAINER */
.custom-dropdown {
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
    z-index: 10;
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
    margin-right: 0.75rem;
}

/* Add this to your existing CSS */

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
    display: flex;
    /* Flexbox for sort by section */
    align-items: center;
    /* Center align items */
    margin-top: 15px;
    /* Margin on top */
}
</style>
