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
      <li>
        <router-link to="/notifications" exact-active-class="active">
          <i class="fas fa-bell"></i>
          <span class="text">Notifications</span>
        </router-link>
      </li>
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
    width: 80px;
    /* Narrower width for md screens */
  }

  .logo .text,
  .text {
    display: none;
    /* Hide all text for icons-only view */
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Center align all items */
  }

  .nav-links li {
    display: flex;
    justify-content: center;
    /* Center icon horizontally */
    align-items: center;
    /* Center icon vertically */
    text-align: center;
    width: 100%;
    /* Full width to avoid left offset */
  }

  .router-link i {
    margin-right: 0;
    /* Remove any margin for full centering */
  }
}


/* Small screens - navbar at bottom, icons only */
@media (max-width: 767px) {
  .logo {
    display: none;
    /* Hide the logo on small screens */
  }

  .navbar {
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f9f9f9;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 10px 0;
  }

  .nav-links {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
  }

  .nav-links li {
    margin-bottom: 0;
  }

  .more-options {
    position: static;
    margin-left: 15px;
    margin-top: 4px;
  }

  i {
    margin-right: 15px;
    font-size: 20px;
    /* Optional: Adjust icon size if needed */
  }

  .fa-users,
  .fa-bell,
  .fa-calendar-alt,
  .fa-search,
  .fa-home,
  .fa-message {
    margin-top: 4px;
  }

  .fa-user{
    margin-top: 3px;
  }
}
</style>
