<template>
  <div class="search-bar">
    <input type="text" placeholder="Search by name, location, or interest" />
  </div>
</template>

<script>
export default {
  name: "SearchBar",
};
</script>

<style scoped>
.search-bar input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #ffffff;
  color: #fff;
}
</style>
