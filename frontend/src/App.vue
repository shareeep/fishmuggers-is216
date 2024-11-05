<template>
  <component v-if="!initializing" :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PublicLayout from './layouts/PublicLayout.vue';
import ProtectedLayout from './layouts/ProtectedLayout.vue';

const auth = getAuth();
const isAuthenticated = ref(false);
const initializing = ref(true); // Track if authentication check is complete

// Set up authentication listener
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user;
    initializing.value = false; // Mark initialization complete after auth state resolves
  });
});

// Dynamically load layouts based on authentication status
const layoutComponent = computed(() => isAuthenticated.value ? ProtectedLayout : PublicLayout);
</script>
