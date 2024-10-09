<template>
  <div class="protected-layout">
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.protected-layout {
  display: flex;
}

main {
  flex-grow: 1;
}
</style>
