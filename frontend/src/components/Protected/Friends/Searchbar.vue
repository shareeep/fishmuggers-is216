<template>
  <!-- SEARCH BAR -->
  <div class="flex justify-center items-center mx-auto mr-0">
    <div class=" mx-auto relative z-20 flex items-center max-w-lg">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
        </svg>
      </div>
      <input type="search" id="default-search" v-model="searchQuery" @keyup.enter="applySearch"
        @input="handleSearchInput"
        class="block w-full pl-10 pr-16 lg:pr-32 p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-[#FDF4CB] focus:border-[#FDF4CB] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#FDF4CB] dark:focus:border-[#FDF4CB] drop-shadow-md"
        placeholder="Search for a user" required>
      <div class="absolute inset-y-0 right-0 flex items-center mr-2">
        <button @click="applySearch"
          class="text-black bg-[#FFD700] hover:bg-[#E6C200] font-bold rounded-lg text-sm px-4 py-2">
          Search
        </button>
      </div>
      </input>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
};
</script>

<style scoped>
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
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  background-color: #e6c200;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}


button:active {
  transform: scale(0.98);

}

@media (min-width: 1024px) {
  input[type="search"] {
    width: 400px !important;
    /* Adjust width as needed */
  }
}

@media (min-width: 640px) {
  input[type="search"] {
    width: 270px;
    /* Adjust width as needed */
  }
}

@media (min-width: 480px) {
  input[type="search"] {
    width: 270px;
    /* Adjust width as needed */
  }
}
</style>
