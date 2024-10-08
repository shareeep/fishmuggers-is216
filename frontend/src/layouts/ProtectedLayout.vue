<template>
    <div class="protected-layout">
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/profile">Profile</router-link>
        <button @click="handleSignOut">Sign Out</button>
      </nav>
      <main>
        <router-view></router-view>
      </main>
    </div>
  </template>
  
  <script setup>
  import { getAuth, signOut } from "firebase/auth";
  import { useRouter } from 'vue-router';
  
  const auth = getAuth();
  const router = useRouter();
  
  // Handle user sign-out
  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push("/login");
    });
  };
  </script>
  
  <style scoped>
  /* Protected layout specific styles */
  </style>
  