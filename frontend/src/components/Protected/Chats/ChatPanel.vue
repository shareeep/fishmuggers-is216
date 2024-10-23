<template>
    <div class="chat-panel" v-if="selectedFriend">
      <div class="chat-header">
        <img :src="selectedFriend.avatar" alt="Avatar" class="chat-avatar" />
        <h3>{{ selectedFriend.name }}</h3>
      </div>
      <div class="chat-messages">
        <div v-for="(message, index) in selectedFriend.messages" :key="index" class="message">
          <p :class="message.sentByYou ? 'message-you' : 'message-them'">
            {{ message.text }}
          </p>
        </div>
      </div>
      <div class="chat-input">
        <input type="text" v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage" />
      </div>
    </div>
    <div class="no-chat-selected" v-else>
      <h3>Select a friend to start chatting</h3>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    selectedFriend: {
      type: Object,
      required: false
    }
  });
  
  const newMessage = ref('');
  
  const sendMessage = () => {
    if (newMessage.value.trim() !== '' && props.selectedFriend) {
      props.selectedFriend.messages.push({ text: newMessage.value, sentByYou: true });
      newMessage.value = '';
    }
  };
  </script>
  
  <style scoped>
  .chat-panel {
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* Ensures the chat panel takes up the remaining space */
    background-color: #f9f9f9;
    height: 100vh; /* Full height */
    width: 100%; /* Full width */
  }
  
  .chat-header {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #ddd;
    background-color: white;
  }
  
  .chat-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
  }
  
  .chat-messages {
  flex-grow: 1;
  padding: 15px;
  background-color: #fff;
  overflow-y: auto;
  background-image: url('../../../assets/images/chat_background.png');
  background-size: 100% 100%; /* Ensure the background image fills the container */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevents the background from repeating */
}

.message {
  display: flex;
  width: 100%; /* Ensure the message takes the full width of the container */
  margin-bottom: 10px;
}

.message-you {
  justify-content: flex-end; /* Aligns your messages to the right */
  align-items: flex-end; /* Aligns the text at the bottom */
  background-color: #FFE047; /* Yellow background */
  padding: 8px;
  border-radius: 10px;
  max-width: 75%;
  margin-left: auto; /* Ensures the message aligns to the right */
  color: black; /* Black text color */
  text-align: right; /* Aligns text to the right */
}

.message-them {
  justify-content: flex-start;
  align-items: flex-start; /* Aligns the text at the top */
  background-color: #ececec;
  padding: 8px;
  border-radius: 10px;
  max-width: 75%;
  margin-right: auto; /* Ensures the message aligns to the left */
  color: #000; /* Black text color */
}
 
  .chat-input {
    padding: 15px;
    border-top: 1px solid #ddd;
    background-color: white;
  }
  
  .chat-input input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .no-chat-selected {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
  }
  </style>
  