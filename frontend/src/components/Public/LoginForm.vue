<template>
  <div class="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Login to your account</h2>
    <form @submit.prevent="handleLogin">
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
        Login now
      </button>
      <!-- Error message display -->
      <p v-if="errorMessage" class="mt-4 text-sm text-red-500 text-center">{{ errorMessage }}</p>
      <p class="mt-4 text-sm text-center">
        Don't Have An Account? 
        <router-link to="/register" class="text-blue-500 underline">Sign Up</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref(''); // Reactive variable for error message
const auth = getAuth();
const router = useRouter();

const handleLogin = () => {
  errorMessage.value = ''; // Reset the error message before attempting to login
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      router.push('/'); // Redirect to home (or protected route) after login
    })
    .catch(error => {
      console.error("Login error: ", error);
      // Set a generic error message for incorrect email or password
      errorMessage.value = 'Incorrect email or password.';
    });
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
