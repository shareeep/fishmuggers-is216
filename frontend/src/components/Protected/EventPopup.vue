<template>
    <div class="popup">
      <div class="popup-content">
        <h2 class="popup-title">{{ event.Title }}</h2>
        <textarea class="popup-description" disabled>{{ event.Description }}</textarea>
        <p><strong>Date:</strong> {{ event.EventDate }}</p>
        <p><strong>Location:</strong> {{ event.Location }}</p>
        <button @click="$emit('close')">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      event: Object,
    },
  };
  </script>
  
  <style scoped>
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .popup-content {
    background: white;
    /* padding: 20px; */
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border: 3px solid black;
    width: 400px; /* Set a width for better layout */
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .popup-title {
    background-color: #4dcdc3; /* Change this to any color you like */
    color: white;
    padding: 10px;
    /* border-radius:; */
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    margin: 0; /* Remove default margin */
  }
  
  .popup-description {
    width: 87%;
    height: 100px; /* Adjust height as needed */
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin:auto;
    margin-top: 20px; /* Add margin for separation */
    margin-bottom: 10px;
    resize: none; /* Prevent resizing */
    background-color: #f9f9f9; /* Light background for visibility */
    font-family: Arial, sans-serif; /* Change font if needed */
  }
  p{
    margin-left: 25px;
  }
  button {
    background-color: #fff;
    color: #000;
    border: 1px solid black;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 10px;
    width: 100%; /* Full width button */
  }
  
  button:hover {
    background-color: #f0f0f0;
  }
  </style>
  