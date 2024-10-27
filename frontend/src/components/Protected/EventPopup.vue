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
  z-index: 1000;
}

.popup-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 3px solid #4b4b4b;
  width: 400px;
  max-width: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Arial Rounded MT', sans-serif;
}
@font-face {
    font-family: pawfont;
    src: url(../../assets/fonts/PawWowBlock-VGMDl.otf);
  }
.popup-title {
  background-color: #ffd700;
  color: #4b4b4b;
  font-family: pawfont;
  border-bottom: 3px solid #4b4b4b;
  text-align: center;
  font-weight: bold;
  font-size: 3.5rem;
  margin: 0;
  text-transform: uppercase;
}

.popup-description {
  width: 87%;
  height: 100px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin: auto;
  margin-top: 16px;
  margin-bottom: 16px;
  resize: none;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
  color: #4b4b4b;
}

p {
  margin-left: 25px;
  color: #4b4b4b;
  font-size: 1rem;
  font-family: 'Arial Rounded MT', sans-serif;
}

button {
  background-color: #ffd700;
  color: #4b4b4b;
  font-weight: bold;
  border: 2px solid #4b4b4b;
  border-radius: 8px;
  padding: 10px 0;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-size: 1rem;
  width: 90%;
  margin: 16px auto;
}

button:hover {
  background-color: #f0e68c;
  color: #333;
}

  </style>
  