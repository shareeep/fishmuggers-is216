<!-- UserProfile.vue -->
<template>
    <div class="user-profile">
      <h2>User Profile</h2>
    </div>
  </template>
  
  <script>
  export default {
    name: "UserProfile",
    props: {
      userId: {
        type: [String, Number],
        required: true
      }
    }
  };
  </script>