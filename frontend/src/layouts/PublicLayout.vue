<template>
  <div class="public-layout bg-[#FFF3B3] min-h-screen flex flex-col">
    <div class="div1"> <!-- Adjusted styling -->
      <img src="../assets/images/logo.png" class="logo" />
      <div class="text-container ml-4"> <!-- Add margin left for spacing -->
        <h2>PetConnect</h2>
        <p>Building a Community for Paws and People</p>
      </div>
    </div>
    
    <main class="flex-grow items-end"> 
      <router-view class="w-full max-w-md flex-grow flex items-center justify-center" /> <!-- Adjusted for right alignment -->
    </main>
  </div>
</template>

<style scoped>
h2 {
  font-size: 5rem; /* Set the font size */
  font-weight: 700; /* Make it bold */
  color: #333; /* Darker color for better contrast */
  margin: 0; /* Remove default margin */
  text-align: left; /* Align text to the left */
  width: auto;
  font-family: 'Poppins', sans-serif; /* For Poppins */
}

p {
  font-size: 2rem; /* Set the font size */
  font-weight: 400; /* Normal weight for the paragraph */
  color: #666; /* Lighter gray for the text */
  margin-top: 0.5rem; /* Add some space above the paragraph */
  text-align: left; /* Align text to the left */
  line-height: 1.5; /* Increase line height for readability */
  font-family: 'Open Sans', sans-serif; /* For Open Sans */
}

.public-layout {
  background-image: url('../assets/images/public_background.png'); /* Background image */
  background-size: contain; /* Adjust image size to contain */
  background-repeat: no-repeat; /* Prevent repeating the background image */
  background-position: bottom left; /* Align background image to bottom left */
  min-height: 100vh; /* Ensure it takes full height of the viewport */
  position: relative;
}

.div1 {
  display: flex; /* Use flex to layout items */
  align-items: center; /* Center items vertically */
  position: absolute; /* Keep it positioned absolutely */
  top: 5px; /* Maintain top position */
  left: 8px; /* Add some left margin */
  width: auto; /* Allow width to adjust automatically */
  max-width: calc(100% - 16px); /* Set maximum width with some padding */
  min-width: 0; /* Allow it to shrink to fit content */
  flex-wrap: nowrap; /* Prevent wrapping */
  overflow: hidden; /* Hide overflow */
}

main {
  display: flex; /* Make sure the main section is a flex container */
  position: absolute;
  right: 10px; /* Align to the right */
  top: 50%; /* Move it down 50% from the top */
  transform: translateY(-50%); /* Shift it up by 50% of its own height */
}
</style>
