<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup>

import { ref, computed, onMounted } from "vue";  // Ensure computed is imported here
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PublicLayout from './layouts/PublicLayout.vue';
import ProtectedLayout from './layouts/ProtectedLayout.vue';

const auth = getAuth();
const isAuthenticated = ref(false);  // Track if the user is authenticated

onMounted(() => {
  // Check Firebase authentication state
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user; // Set true if the user is logged in, false otherwise
  });
});

// Dynamically load layouts based on authentication status
const layoutComponent = computed(() => isAuthenticated.value ? 'ProtectedLayout' : 'PublicLayout');
</script>
