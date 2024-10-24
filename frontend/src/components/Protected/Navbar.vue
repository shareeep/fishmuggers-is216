<template>
    <nav class="navbar">
      <div class="logo">
        <h1>
          <img src="../../assets/images/logo.png" alt="Profile" class="profile-pic" />  
          PetConnect
        </h1>
      </div>
      <ul>
        <li>
          <router-link to="/">
            <i class="fas fa-home"></i>
            Home
          </router-link>
        </li>
        <li>
          <router-link to="/events">
            <i class="fas fa-search"></i>
            Events
          </router-link>
        </li>
        <li>
          <router-link to="/calendar">
            <i class="fas fa-calendar-alt"></i>
            Calendar
          </router-link>
        </li>
        <li>
          <router-link to="/notifications">
            <i class="fas fa-bell"></i>
            Notifications
          </router-link>
        </li>
        <li>
          <router-link to="/friends">
            <i class="fas fa-users"></i>
            Friends
          </router-link>
        </li>
        <li>
          <router-link to="/profile">
        
            <i class="fas fa-user"></i>
            Profile
          </router-link>
        </li>
        <li>
          <router-link to="/chats">
            <i class="fas fa-message"></i>
            Chats
          </router-link>
        </li>
        <li>
          <router-link to="/eventsadmin">
            <i class="fas fa-eventsadmin"></i>
            Add Events Temporary
          </router-link>
        </li>
      </ul>
      <div class="more-options">
        <button @click="handleSignOut">
          <i class="fas fa-sign-out-alt"></i>
          Sign Out
        </button>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { getAuth, signOut } from "firebase/auth";
  import { useRouter } from "vue-router";
  
  const auth = getAuth();
  const router = useRouter();
  
  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push("/login");
    });
  };
  </script>
  
  <style>
  .navbar {
    width: 250px;
    height: 100vh;
    background-color: #f9f9f9;
    padding: 20px;
  }
  
  .logo {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 20px;
  }
  
  router-link {
    text-decoration: none;
    color: #333;
    font-size: 18px;
    display: flex;
    align-items: center;
  }
  
  i {
    margin-right: 10px;
  }
  
  .profile-pic {
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
  
  .more-options {
    position: absolute;
    bottom: 20px;
  }
  </style>
  