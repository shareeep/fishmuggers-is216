<template>
  <div class="public-layout bg-[#FFF3B3]">
    <div class="header">
      <img src="../assets/images/logo.png" class="logo" />
      <div class="text-container">
        <h2>PetConnect</h2>
        <p>Building a Community for Paws and People</p>
      </div>
    </div>
    
    <main class="main-content">
      <router-view class="view-content" />
    </main>
  </div>
</template>

<style scoped>
/* Typography and Spacing */
h2 {
  font-size: clamp(2.5rem, 5vw, 5rem); /* Responsive font size */
  font-weight: 700;
  color: #333;
  margin: 0;
  font-family: 'Poppins', sans-serif;
}

p {
  font-size: clamp(1.5rem, 2.5vw, 2rem); /* Responsive font size */
  font-weight: 400;
  color: #666;
  margin-top: 0.5rem;
  line-height: 1.5;
  font-family: 'Open Sans', sans-serif;
}

/* Layout Styles */
.public-layout {
  background-image: url('../assets/images/public_background.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom left;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10; /* Keep it on top */
}

.logo {
  width: clamp(80px, 120px, 150px); /* Responsive size for logo */
  height: auto;
  transition: width 0.3s ease; /* Smooth resizing transition */
}

.text-container {
  margin-left: 10px; /* Space between logo and text */
}

/* Main Content Area */
.main-content {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end; /* Align content to the right */
  align-items: center;
  padding: 0 10px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  max-width: 100%;
}

.view-content {
  width: 400px;
  max-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* Center main-content on screens 640px or smaller */
@media (max-width: 640px) {
  .main-content {
    justify-content: center; /* Center horizontally */
    left: 50%; /* Move to the center horizontally */
    right: auto; /* Remove right alignment */
    transform: translate(-50%, -50%); /* Center both vertically and horizontally */
  }
}
</style>

