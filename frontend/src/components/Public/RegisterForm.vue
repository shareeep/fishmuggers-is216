<template>
  <div class="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Sign up for PetConnect</h2>
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
        class="border border-gray-300 rounded-md py-2 px-4 mb-4 w-full"
      />
      
      <input 
        v-model="username" 
        type="text" 
        placeholder="Username (e.g. luffy_pirateking)" 
        required 
        class="border border-gray-300 rounded-md py-2 px-4 mb-4 w-full"
        @blur="checkUsername"
      />
      <p v-if="usernameError" class="text-red-500 text-sm mb-4">{{ usernameError }}</p>
      

      <button 
        type="submit" 
        class="bg-[#FBD157] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#956F00] transition"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Registering...' : 'Register' }}
      </button>
      

      <p v-if="errorMessage" class="mt-4 text-sm text-red-500 text-center">{{ errorMessage }}</p>
      <p v-if="successMessage" class="mt-4 text-sm text-green-500 text-center">{{ successMessage }}</p>
      
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
import { getFirestore, collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';

const email = ref('');
const password = ref('');
const username = ref('');
const errorMessage = ref(''); // Reactive variable for error message
const successMessage = ref(''); // Reactive variable for success message
const usernameError = ref(''); // Reactive variable for username-specific errors
const isSubmitting = ref(false); // Reactive variable to manage submission state

const auth = getAuth();
const router = useRouter();
const db = getFirestore(); // Initialize Firestore

// Regular expression for username validation (e.g., alphanumeric and underscores, 3-20 chars)
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

// Function to check if the username is already taken
const isUsernameTaken = async (desiredUsername) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', desiredUsername));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Function to validate the username format
const validateUsername = (desiredUsername) => {
  if (!usernameRegex.test(desiredUsername)) {
    usernameError.value = 'Username must be 3-20 characters long and can include letters, numbers, and underscores.';
    return false;
  }
  usernameError.value = '';
  return true;
};

// Function to check username uniqueness on blur (optional)
const checkUsername = async () => {
  const desiredUsername = username.value.trim();
  if (!validateUsername(desiredUsername)) {
    return;
  }
  
  try {
    const taken = await isUsernameTaken(desiredUsername);
    if (taken) {
      usernameError.value = 'Username is already taken. Please choose another one.';
    } else {
      usernameError.value = '';
    }
  } catch (error) {
    console.error('Error checking username:', error);
    usernameError.value = 'Unable to verify username at this time.';
  }
};

const handleRegister = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  
  const desiredUsername = username.value.trim();
  
  // Validate username format
  if (!validateUsername(desiredUsername)) {
    return;
  }
  
  // Check if username is taken
  try {
    isSubmitting.value = true;
    const taken = await isUsernameTaken(desiredUsername);
    if (taken) {
      usernameError.value = 'Username is already taken. Please choose another one.';
      isSubmitting.value = false;
      return;
    }
  } catch (error) {
    console.error('Error checking username:', error);
    errorMessage.value = 'Unable to verify username. Please try again later.';
    isSubmitting.value = false;
    return;
  }
  
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    
    // Prepare user data with default values
    const userData = {
      uid: user.uid, // Firebase Auth User ID
      email: user.email,
      username: desiredUsername,
      profileImage: 'https://via.placeholder.com/300?text=Profile+Image', // Default 300x300 grey image
      points: 0,
      pets: [],
      joinedEvents: [],
      createdAt: new Date() // Timestamp of account creation
    };
    
    // Create Firestore document with UID as document ID
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, userData);
    
    successMessage.value = 'Registration successful! Redirecting...';
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      router.push('/home');
    }, 500);
  } catch (error) {
    console.error('Registration error:', error);
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = 'This email is already in use.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage.value = 'Password should be at least 6 characters.';
    } else {
      errorMessage.value = 'Registration failed. Please try again.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
