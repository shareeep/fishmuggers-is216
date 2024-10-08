<template>
  <div class="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Sign up for petlink</h2>
    <form @submit.prevent="handleRegister">
      <input 
        v-model="email" 
        type="email" 
        placeholder="Email" 
        required 
        class="border border-gray-300 rounded-md py-2 px-4 mb-4 w-full"
      />
      <input 
        v-model="password" 
        type="password" 
        placeholder="Password" 
        required 
        class="border border-gray-300 rounded-md py-2 px-4 mb-6 w-full"
      />
      <button 
        type="submit" 
        class="bg-[#FBD157] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#956F00] transition"
      >
        Register
      </button>
      <!-- Error message display -->
      <p v-if="errorMessage" class="mt-4 text-sm text-red-500 text-center">{{ errorMessage }}</p>
      <p class="mt-4 text-sm text-center">
        Already have an account? 
        <router-link to="/login" class="text-blue-500 underline">Log in</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref(''); // Reactive variable for error message
const auth = getAuth();
const router = useRouter();

const handleRegister = () => {
  errorMessage.value = ''; // Reset the error message before attempting to register
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      router.push('/'); // Redirect to home after successful registration
    })
    .catch(error => {
      console.error("Registration error: ", error);
      // Set a generic error message for registration issues
      errorMessage.value = 'Account already exists';
    });
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
