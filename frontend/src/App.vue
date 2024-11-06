<template>
  <component :is="layoutComponent">
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

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user;
  });
});

// Dynamically load layouts based on authentication status
const layoutComponent = computed(() => isAuthenticated.value ? `ProtectedLayout` : `PublicLayout`);
</script>
