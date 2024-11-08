<template>
    <div class="max-w-md mx-auto relative wrapper">
        <img src="../../../assets/images/search_image.png" style="width:300px; margin-bottom: -10px;position:relative;"
            class="block mx-auto z-30 md:w-2/3 lg:w-1/2">

        <!-- SEARCH BAR -->
        <div class="flex justify-center items-center mx-auto mr-0">
            <div class=" mx-auto relative z-20 flex items-center max-w-lg">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input type="search" id="default-search" v-model="searchQuery" @keyup.enter="applySearch"
                    @input="handleSearchInput"
                    class="block w-full pl-10 pr-16 lg:pr-32 p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-[#FDF4CB] focus:border-[#FDF4CB] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#FDF4CB] dark:focus:border-[#FDF4CB] drop-shadow-md"
                    placeholder="Search for an event" required>
                <div class="absolute inset-y-0 right-0 flex items-center mr-2">
                    <button @click="applySearch"
                        class="text-black bg-[#FFD700] hover:bg-[#E6C200] font-bold rounded-lg text-sm px-4 py-2 apply">
                        Search
                    </button>
                </div>
                </input>
            </div>
        </div>
    </div>

    <!--sort by sm block-->
    <div class="sort-bymd sm:block md:hidden flex flex-col mx-auto">
        <div class="sort-by-text"
            style="font-weight: bold;color:#7B61FF;margin-bottom: 8px;text-align: center;margin-top: 8px;">Sort by:
        </div>

        <div class="flex justify-center">
            <div class="dropdown-wrapper" ref="petTypeDropdownContainer">
                <!-- Pet Type Dropdown -->
                <button @click.stop="togglePetTypeDropdown" :class="[
                    'w-36 border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex justify-center items-center mr-3',
                    isPetTypeFilled ? 'bg-[#7B61FF] text-white' : 'text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white'
                ]" type="button">
                    Pet Type
                    <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <!-- Pet Type Dropdown Menu -->
                <div v-if="isPetTypeDropdownOpen" class="custom-dropdown z-40 w-56 p-3 rounded-lg shadow-lg"
                    @click.stop>
                    <h6 class="mb-3 text-sm font-medium text-gray-800">
                        Category
                    </h6>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center">
                            <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                                <input type="checkbox" v-model="selectedCats"
                                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                <span class="ml-2">Cats</span>
                            </label>
                        </li>

                        <li class="flex items-center cursor-pointer">
                            <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                                <input type="checkbox" v-model="selectedDogs"
                                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                <span class="ml-2">Dogs</span>
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
            <div class="dropdown-wrapper" ref="eventSizeDropdownContainer">
                <!-- Event Size Dropdown -->
                <button @click.stop="toggleEventSizeDropdown" :class="[
                    'w-36 border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-center',
                    isEventSizeFilled ? 'bg-[#7B61FF] text-white' : 'text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white'
                ]" type="button">
                    Event Size
                    <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <!-- Event Size Dropdown Menu -->
                <div v-if="isEventSizeDropdownOpen" class="custom-dropdown z-10 w-56 p-3 rounded-lg shadow-lg"
                    @click.stop>
                    <h6 class="mb-3 text-sm font-medium text-gray-800">
                        Event Size
                    </h6>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center">
                            <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                                <input type="radio" value="<10" v-model="selectedEventSize"
                                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                <span class="ml-2">&lt;10</span>
                            </label>
                        </li>

                        <li class="flex items-center">
                            <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                                <input type="radio" value="10-50" v-model="selectedEventSize"
                                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                <span class="ml-2">10-50</span>
                            </label>
                        </li>

                        <li class="flex items-center">
                            <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                                <input type="radio" value="50-100" v-model="selectedEventSize"
                                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                <span class="ml-2">50-100</span>
                            </label>
                        </li>

                        <li class="flex items-center">
                            <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                                <input type="radio" value=">100" v-model="selectedEventSize"
                                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                <span class="ml-2">&gt;100</span>
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
        </div>
        <div class="flex justify-center mt-3">
            <!-- Date Range Dropdown -->
            <div class="dropdown-wrapper flex-2" ref="dateRangeDropdownContainer">
                <button @click.stop="toggleDateRangeDropdown" :class="[
                    'w-36 border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-center mr-3',
                    isDateRangeFilled ? 'bg-[#7B61FF] text-white' : 'text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white'
                ]" type="button">
                    Date Range
                    <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <!-- Date Range Dropdown Menu -->
                <div v-if="isDateRangeDropdownOpen" class="custom-dropdown z-10 w-56 p-3 rounded-lg shadow-lg"
                    @click.stop>
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
                            <input id="end-date" v-model="endDate" type="date" :min="today"
                                placeholder="Select end date"
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
            <div class="dropdown-wrapper" ref="locationDropdownContainer">
                <button @click.stop="toggleLocationDropdown" :class="[
                    'w-36 border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-center',
                    isLocationFilled ? 'bg-[#7B61FF] text-white' : 'text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white'
                ]" type="button">
                    Location
                    <svg class="w-4 h-4 ml-2 z-10" aria-hidden="true" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                <!-- Location Dropdown Menu -->
                <div v-if="isLocationDropdownOpen" class="custom-dropdown z-10 w-56 p-3 rounded-lg shadow-lg"
                    @click.stop>
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
        </div>
        <!-- Apply Filters Button -->
        <div class="flex justify-center mt-3">
            <button @click="applyFilters"
                class="rounded-lg text-sm py-2.5 text-center items-center  text-black bg-[#FFD700] hover:bg-[#E6C200] font-bold text-sm apply"
                style="width: 19rem;">
                Apply Filters
            </button>
        </div>
        <!-- Reset Filters Button -->
        <div class="flex justify-center mt-3">
            <button @click="resetFilters"
                class="rounded-lg text-sm py-2.5 text-center items-center  text-black bg-[#FFD700] hover:bg-[#E6C200] font-bold text-sm apply reset"
                style="width: 19rem;">
                Reset Filters
            </button>
        </div>
    </div>

    <!--Sort by md block-->
    <div class="hidden md:block lg:hidden">
        <div class="sort-by-text"
            style="font-weight: bold;color:#7B61FF;margin-bottom: 8px;text-align: center;margin-top: 8px;">Sort by:
        </div>

        <div class="flex justify-center">
            <div class="dropdown-wrapper" ref="petTypeDropdownContainer">
                <!-- Pet Type Dropdown -->
                <button @click.stop="togglePetTypeDropdown" :class="[
                    'w-36 border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex justify-center items-center mr-3',
                    isPetTypeFilled ? 'bg-[#7B61FF] text-white' : 'text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white'
                ]" type="button">
                    Pet Type
                    <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <!-- Pet Type Dropdown Menu -->
                <div v-if="isPetTypeDropdownOpen" class="custom-dropdown z-10 w-56 p-3 rounded-lg shadow-lg"
                    @click.stop>
                    <h6 class="mb-3 text-sm font-medium text-gray-800">
                        Category
                    </h6>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center">
                            <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                                <input type="checkbox" v-model="selectedCats"
                                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                <span class="ml-2">Cats</span>
                            </label>
                        </li>

                        <li class="flex items-center">
                            <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                                <input type="checkbox" v-model="selectedDogs"
                                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                <span class="ml-2">Dogs</span>
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
            <div class="dropdown-wrapper" ref="eventSizeDropdownContainer">
                <!-- Event Size Dropdown -->
                <button @click="toggleEventSizeDropdown" :class="[
                    'w-36 border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-center',
                    isEventSizeFilled ? 'bg-[#7B61FF] text-white' : 'text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white'
                ]" type="button">
                    Event Size
                    <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <!-- Event Size Dropdown Menu -->
                <div v-if="isEventSizeDropdownOpen" class="custom-dropdown z-10 w-56 p-3 rounded-lg shadow-lg"
                    @click.stop>
                    <h6 class="mb-3 text-sm font-medium text-gray-800">
                        Event Size
                    </h6>
                    <ul class="space-y-2 text-sm">
                        <li class="flex items-center">
                            <label class="flex items-center text-sm font-medium text-gray-900">
                                <input type="radio" value="<10" v-model="selectedEventSize"
                                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500" />
                                <span class="ml-2">&lt;10</span>
                            </label>
                        </li>

                        <li class="flex items-center">
                            <label class="flex items-center text-sm font-medium text-gray-900">
                                <input type="radio" value="10-50" v-model="selectedEventSize"
                                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500" />
                                <span class="ml-2">10-50</span>
                            </label>
                        </li>

                        <li class="flex items-center">
                            <label class="flex items-center text-sm font-medium text-gray-900">
                                <input type="radio" value="50-100" v-model="selectedEventSize"
                                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500" />
                                <span class="ml-2">50-100</span>
                            </label>
                        </li>

                        <li class="flex items-center">
                            <label class="flex items-center text-sm font-medium text-gray-900">
                                <input type="radio" value=">100" v-model="selectedEventSize"
                                    class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500" />
                                <span class="ml-2">&gt;100</span>
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
        </div>
        <div class="flex justify-center mt-3">
            <!-- Date Range Dropdown -->
            <div class="dropdown-wrapper flex-2" ref="dateRangeDropdownContainer">
                <button @click.stop="toggleDateRangeDropdown" :class="[
                    'w-36 border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-center mr-3',
                    isDateRangeFilled ? 'bg-[#7B61FF] text-white' : 'text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white'
                ]" type="button">
                    Date Range
                    <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>

                <!-- Date Range Dropdown Menu -->
                <div v-if="isDateRangeDropdownOpen" class="custom-dropdown z-10 w-56 p-3 rounded-lg shadow-lg"
                    @click.stop>
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
                            <input id="end-date" v-model="endDate" type="date" :min="today"
                                placeholder="Select end date"
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
            <div class="dropdown-wrapper" ref="locationDropdownContainer">
                <button @click.stop="toggleLocationDropdown" :class="[
                    'w-36 border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center justify-center',
                    isLocationFilled ? 'bg-[#7B61FF] text-white' : 'text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white'
                ]" type="button">
                    Location
                    <svg class="w-4 h-4 ml-2 z-10" aria-hidden="true" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                <!-- Location Dropdown Menu -->
                <div v-if="isLocationDropdownOpen" class="custom-dropdown z-10 w-56 p-3 rounded-lg shadow-lg"
                    @click.stop>
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
        </div>
        <!-- Apply Filters Button -->
        <div class="flex justify-center mt-3">
            <button @click="applyFilters"
                class="rounded-lg text-sm py-2.5 text-center items-center text-black bg-[#FFD700] hover:bg-[#E6C200] font-bold text-sm apply"
                style="width: 19rem;">
                Apply Filters
            </button>
        </div>
        <!-- Reset Filters Button -->
        <div class="flex justify-center mt-3">
            <button @click="resetFilters"
                class="rounded-lg text-sm py-2.5 text-center items-center text-black  bg-[#FFD700] hover:bg-[#E6C200] font-bold text-sm apply"
                style="width: 19rem;">
                Reset Filters
            </button>
        </div>


    </div>

    <!-- Sort by large block-->
    <div class="sort-by hidden sm:hidden md:hidden lg:block mx-auto">
        <span class="sort-by-text mr-3" style="font-weight: bold;color:#7B61FF;">Sort by:</span>

        <div class="dropdown-wrapper me-3 d-inline-block" ref="petTypeDropdownContainer">
            <!-- Pet Type Dropdown -->
            <button @click="togglePetTypeDropdown" :class="[
                'lg:w-36 border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 justify-center text-center inline-flex items-center me-3',
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
                    <li class="flex items-center cursor-pointer">
                        <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                            <input type="checkbox" v-model="selectedCats"
                                class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                            <span class="ml-2">Cats</span>
                        </label>
                    </li>

                    <li class="flex items-center cursor-pointer">
                        <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                            <input type="checkbox" v-model="selectedDogs"
                                class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                            <span class="ml-2">Dogs</span>
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
        <div class="dropdown-wrapper me-3 d-inline-block" ref="eventSizeDropdownContainer">
            <!-- Event Size Dropdown -->
            <button @click="toggleEventSizeDropdown" :class="[
                'lg:w-36 border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 justify-center text-center inline-flex items-center me-3',
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
                    <li class="flex items-center cursor-pointer">
                        <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                            <input type="radio" value="<10" v-model="selectedEventSize"
                                class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                            <span class="ml-2">&lt;10</span>
                        </label>
                    </li>

                    <li class="flex items-center">
                        <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                            <input type="radio" value="10-50" v-model="selectedEventSize"
                                class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                            <span class="ml-2">10-50</span>
                        </label>
                    </li>

                    <li class="flex items-center">
                        <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                            <input type="radio" value="50-100" v-model="selectedEventSize"
                                class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                            <span class="ml-2">50-100</span>
                        </label>
                    </li>

                    <li class="flex items-center">
                        <label class="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                            <input type="radio" value=">100" v-model="selectedEventSize"
                                class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 cursor-pointer" />
                            <span class="ml-2">&gt;100</span>
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
        <div class="dropdown-wrapper me-3 d-inline-block" ref="dateRangeDropdownContainer">
            <button @click="toggleDateRangeDropdown" :class="[
                'lg:w-36 border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 justify-center text-center inline-flex items-center me-3',
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
        <div class="dropdown-wrapper me-3 d-inline-block" ref="locationDropdownContainer">
            <button @click="toggleLocationDropdown" :class="[
                'lg:w-36 border border-[#7B61FF] border-2 font-bold rounded-lg text-sm px-4 py-2.5 justify-center text-center inline-flex items-center me-3',
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
                <ul v-if="showSuggestions" @click.stop
                    class="bg-white border border-gray-300 rounded-lg shadow-lg whitespace-normal break-words">
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
        <!-- Apply Filters Button -->
        <button @click="applyFilters"
            class="rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center me-3 text-black  bg-[#FFD700] hover:bg-[#E6C200] font-bold text-sm whitespace-nowrap apply">
            Apply Filters
        </button>
        <!-- Reset Filters Button -->
        <button @click="resetFilters"
            class="rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center me-3 text-black  bg-[#FFD700] hover:bg-[#E6C200] font-bold text-sm apply">
            Reset Filters
        </button>
    </div>
</template>

<script>
import googleMapsLoader from "../../../../googleMapsLoader.js";

export default {
    emits: ['filters-applied', 'filtersReset'],

    data() {
        return {
            searchQuery: '',
            today: new Date().toISOString().split('T')[0],
            isPetTypeDropdownOpen: false,
            selectedCats: false,
            selectedDogs: false,
            isPetTypeFilled: false,
            isEventSizeDropdownOpen: false,
            selectedEventSize: null,
            isEventSizeFilled: false,
            isDateRangeDropdownOpen: false,
            startDate: '',
            endDate: '',
            isDateRangeFilled: false,
            isLocationDropdownOpen: false,
            searchedLoc: '',
            isLocationFilled: false,
            locationSuggestions: [],
            selectedLocation: null,
            showSuggestions: false,
            initialValues: {},
        };
    },
    methods: {
        applySearch() {
            if (this.searchQuery) {
                const filters = {
                    searchQuery: this.searchQuery,
                    petType: {
                        cats: this.selectedCats,
                        dogs: this.selectedDogs,
                    },
                    eventSize: this.selectedEventSize,
                    dateRange: {
                        startDate: this.startDate,
                        endDate: this.endDate,
                    },
                    location: this.selectedLocation
                };
                this.$emit('filters-applied', filters);
            }
        },
        handleSearchInput() {
            if (!this.searchQuery) {
                this.$emit('search-cleared');
            }
        },
        togglePetTypeDropdown() {
            this.closeAllDropdowns();
            this.isPetTypeDropdownOpen = !this.isPetTypeDropdownOpen;
            if (this.isPetTypeDropdownOpen) {
                this.saveInitialValues('petType');
            }
        },
        toggleEventSizeDropdown() {
            this.closeAllDropdowns();
            this.isEventSizeDropdownOpen = !this.isEventSizeDropdownOpen;
            if (this.isEventSizeDropdownOpen) {
                this.saveInitialValues('eventSize');
            }
        },
        toggleDateRangeDropdown() {
            this.closeAllDropdowns();
            this.isDateRangeDropdownOpen = !this.isDateRangeDropdownOpen;
            if (this.isDateRangeDropdownOpen) {
                this.saveInitialValues('dateRange');
            }
        },
        toggleLocationDropdown() {
            this.closeAllDropdowns();
            this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
            this.showSuggestions = false;
            if (this.isLocationDropdownOpen) {
                this.saveInitialValues('location');
            }
        },
        applyPetTypeFilters() {
            this.isPetTypeFilled = this.selectedCats || this.selectedDogs;
            this.isPetTypeDropdownOpen = false;
            delete this.initialValues.petType; // Clear stored initial values on apply
        },
        applyEventSizeFilters() {
            this.isEventSizeFilled = this.selectedEventSize !== null;
            this.isEventSizeDropdownOpen = false;
            delete this.initialValues.eventSize;
        },
        applyDateRangeFilters() {
            const today = new Date().toISOString().split('T')[0];
            if (this.endDate) {
                this.isDateRangeFilled = true;
            } else if (this.startDate && !this.endDate) {
                this.isDateRangeFilled = true;
            } else {
                this.isDateRangeFilled = false;
            }
            this.isDateRangeDropdownOpen = false;
            delete this.initialValues.dateRange;
        },
        fetchLocationSuggestions() {
            if (this.searchedLoc.trim() === "") {
                this.locationSuggestions = [];
                this.showSuggestions = false; // Hide suggestions if input is empty
                return;
            }

            // Load Google Maps API only once
            googleMapsLoader.load().then(() => {
                const service = new google.maps.places.AutocompleteService();
                service.getPlacePredictions(
                    {
                        input: this.searchedLoc,
                        componentRestrictions: { country: "SG" },
                        types: ["neighborhood"],
                    },
                    (predictions, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                            const lowercaseInput = this.searchedLoc.toLowerCase();
                            this.locationSuggestions = predictions
                                .filter((prediction) =>
                                    prediction.description.toLowerCase().startsWith(lowercaseInput)
                                )
                                .map((prediction) => ({
                                    id: prediction.place_id,
                                    name: prediction.description,
                                }));
                            this.showSuggestions = this.locationSuggestions.length > 0; // Show suggestions only if there are results
                        } else {
                            this.locationSuggestions = [];
                            this.showSuggestions = false; // Hide suggestions if no results
                        }
                    }
                );
            }).catch((error) => {
                console.error("Error loading Google Maps API:", error);
            });
        },

        selectLocation(suggestion) {
            this.selectedLocation = suggestion.name;
            this.searchedLoc = suggestion.name;
            this.showSuggestions = false; // Close only the suggestions list
            this.getPlaceDetails(suggestion.id);
        },
        getPlaceDetails(placeId) {
            googleMapsLoader.load().then(() => {
                const service = new google.maps.places.PlacesService(document.createElement("div"));
                service.getDetails({ placeId: placeId }, (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        this.selectedLocation = {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        };
                        this.$emit("filters-applied", { ...this.$data, location: this.selectedLocation }); // Emit location coordinates
                    } else {
                        console.error(`Failed to fetch place details for placeId: ${placeId}`);
                    }
                });
            });
        },
        applyLocationFilters() {
            // Apply the filter and close the entire location dropdown
            if (this.selectedLocation && this.selectedLocation.lat && this.selectedLocation.lng) {
                this.isLocationFilled = true;
            } else {
                this.isLocationFilled = false;
                this.selectedLocation = null;
            }
            this.isLocationDropdownOpen = false; // Close the dropdown when applying
            delete this.initialValues.location;
        },
        saveInitialValues(type) {
            // Save current values as initial values for dropdown reset on cancel
            if (type === 'petType') {
                this.initialValues.petType = {
                    selectedCats: this.selectedCats,
                    selectedDogs: this.selectedDogs
                };
            } else if (type === 'eventSize') {
                this.initialValues.eventSize = {
                    selectedEventSize: this.selectedEventSize
                };
            } else if (type === 'dateRange') {
                this.initialValues.dateRange = {
                    startDate: this.startDate,
                    endDate: this.endDate
                };
            } else if (type === 'location') {
                this.initialValues.location = {
                    selectedLocation: this.selectedLocation,
                    searchedLoc: this.searchedLoc
                };
            }
        },
        resetToInitialValues(type) {
            if (this.initialValues[type]) {
                if (type === 'petType') {
                    this.selectedCats = this.initialValues.petType.selectedCats;
                    this.selectedDogs = this.initialValues.petType.selectedDogs;
                } else if (type === 'eventSize') {
                    this.selectedEventSize = this.initialValues.eventSize.selectedEventSize;
                } else if (type === 'dateRange') {
                    this.startDate = this.initialValues.dateRange.startDate;
                    this.endDate = this.initialValues.dateRange.endDate;
                } else if (type === 'location') {
                    this.selectedLocation = this.initialValues.location.selectedLocation;
                    this.searchedLoc = this.initialValues.location.searchedLoc;
                }
                delete this.initialValues[type]; // Clear initial values after reset
            }
        },
        resetFilters() {
            this.closeAllDropdowns();
            this.selectedCats = false;
            this.selectedDogs = false;
            this.selectedEventSize = null;
            this.startDate = '';
            this.endDate = '';
            this.selectedLocation = null;
            this.searchedLoc = '';
            this.isPetTypeFilled = false;
            this.isEventSizeFilled = false;
            this.isDateRangeFilled = false;
            this.isLocationFilled = false;
            this.locationSuggestions = [];
            this.showSuggestions = false;
            this.$emit('filtersReset');
        },
        closeAllDropdowns() {
            console.log("Closing all dropdowns");
            this.isPetTypeDropdownOpen = false;
            this.isEventSizeDropdownOpen = false;
            this.isDateRangeDropdownOpen = false;
            this.isLocationDropdownOpen = false;
            this.showSuggestions = false; // Ensure suggestions are closed with dropdown
        },
        applyFilters() {
            this.closeAllDropdowns();

            const filters = {
                searchQuery: this.searchQuery,
                petType: {
                    cats: this.selectedCats,
                    dogs: this.selectedDogs,
                },
                eventSize: this.selectedEventSize,
                dateRange: {
                    startDate: this.startDate,
                    endDate: this.endDate,
                },
                location: this.selectedLocation
            };
            this.$emit('filters-applied', filters);
        },
        handleClickOutside(event) {
            const dropdowns = ['petType', 'eventSize', 'dateRange', 'location'];
            dropdowns.forEach(dropdown => {
                const isDropdownOpen = this[`is${dropdown.charAt(0).toUpperCase() + dropdown.slice(1)}DropdownOpen`];
                const dropdownContainer = this.$refs[`${dropdown}DropdownContainer`];
                if (isDropdownOpen && dropdownContainer && !dropdownContainer.contains(event.target)) {
                    this.resetToInitialValues(dropdown);
                    this[`is${dropdown.charAt(0).toUpperCase() + dropdown.slice(1)}DropdownOpen`] = false;
                }
            });
        },
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleClickOutside);
    }
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
    white-space: nowrap;
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
    white-space: nowrap;

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
