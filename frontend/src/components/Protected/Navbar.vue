<template>
  <nav class="navbar">
    <div class="logo">
      <h1>
        <img src="../../assets/images/logo.png" alt="Profile" class="profile-pic" />
        <span class="text">PetConnect</span>
      </h1>
    </div>
    <ul class="nav-links">
      <li>
        <router-link to="/" exact-active-class="active">
          <i class="fas fa-home"></i>
          <span class="text">Home</span>
        </router-link>
      </li>
      <li>
        <router-link to="/events" exact-active-class="active">
          <i class="fas fa-search"></i>
          <span class="text">Events</span>
        </router-link>
      </li>
      <li>
        <router-link to="/calendar" exact-active-class="active">
          <i class="fas fa-calendar-alt"></i>
          <span class="text">Calendar</span>
        </router-link>
      </li>
      <!-- <li>
        <router-link to="/notifications" exact-active-class="active">
          <i class="fas fa-bell"></i>
          <span class="text">Notifications</span>
        </router-link>
      </li> -->
      <li>
        <router-link to="/friends" exact-active-class="active">
          <i class="fas fa-users"></i>
          <span class="text">Friends</span>
        </router-link>
      </li>
      <li>
        <router-link to="/profile" exact-active-class="active">
          <i class="fas fa-user"></i>
          <span class="text">Profile</span>
        </router-link>
      </li>
      <li>
        <router-link to="/chats" exact-active-class="active">
          <i class="fas fa-message"></i>
          <span class="text">Chats</span>
        </router-link>
      </li>
      <!-- <li>
        <router-link to="/eventsadmin" exact-active-class="active">
          <i class="fas fa-plus"></i>
          <span class="text">Add Events Temporary</span>
        </router-link>
      </li> -->
      <!-- <li>
        <router-link to="/sample" exact-active-class="active">
          <i class="fas fa-dog"></i>
          <span class="text">Sample Page</span>
        </router-link>
      </li> -->
    </ul>
    <div class="more-options">
      <button @click="handleSignOut">
        <i class="fas fa-sign-out-alt"></i>
        <span class="text">Sign Out</span>
      </button>
    </div>
  </nav>
</template>

<style>
.navbar {
  width: 250px;
  height: 100vh;
  background-color: #f9f9f9;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
}

.nav-links {
  list-style: none;
  padding: 0;
  flex-grow: 1;
}

.nav-links li {
  margin-bottom: 20px;
}

.router-link {
  text-decoration: none;
  color: #333;
  font-size: 18px;
  display: flex;
  align-items: center;
}

i {
  margin-right: 10px;
}

.text {
  display: inline;
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

.active {
  color: #756000;
  font-weight: bold;
}

/* Media Queries for Responsive Layouts */

/* Large screens - default layout */
@media (min-width: 992px) {
  .text {
    display: inline;
  }
}

/* Medium screens - center content in each li */
@media (max-width: 991px) {
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
  