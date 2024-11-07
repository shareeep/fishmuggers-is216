<template>
  <div class="home-container">
    <Navbar />
    <main>
      <!-- Pass the `showFindChatPopup` function as a prop to Allchats -->
      <Allchats :showFindChatPopup="showFindChatPopup" :friends="friends" @deleteChat="deleteChat" />
    </main>
    <!-- Show FindChatPopup when isFindChatPopupVisible is true -->
    <FindChatPopup v-if="isFindChatPopupVisible" :friends="friends" :activeChats="activeChatFriends"
      @close="isFindChatPopupVisible = false" @startChat="startChatWithFriend" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth } from "firebase/auth";
import axios from "axios";

import Navbar from '@/components/Protected/Navbar.vue';
import Allchats from '@/components/Protected/Chats/Allchats.vue';
import FindChatPopup from '@/components/Protected/Chats/FindChatPopup.vue';

const isFindChatPopupVisible = ref(false);
const friends = ref([]);
const activeChatFriends = ref([]); // Array for friends with active chats
const selectedFriend = ref(null);

// Function to show the FindChatPopup
const showFindChatPopup = () => {
  isFindChatPopupVisible.value = true;
};

const fetchFriends = async () => {
  try {
    const auth = getAuth();
    const userUid = auth.currentUser?.uid;

    if (!userUid) {
      console.error("User is not authenticated.");
      return;
    }

    // Fetch friends list
    const friendsResponse = await axios.get(`http://localhost:3000/api/events/${userUid}/friends`);
    friends.value = friendsResponse.data;

    // Fetch existing chats and extract friend IDs
    const chatsResponse = await axios.get(`http://localhost:3000/api/messages/user/${userUid}`);
    activeChatFriends.value = chatsResponse.data.map(chat =>
      chat.senderUid === userUid ? chat.receiverUid : chat.senderUid
    );
  } catch (error) {
    console.error("Failed to fetch friends or chats:", error);
  }
};

const deleteChat = async (friend) => {
  try {
    const userUid = getAuth().currentUser.uid;

    // Make a request to delete the chat
    await axios({
      method: "delete",
      url: `http://localhost:3000/api/messages/delete`,
      data: {
        userUid: userUid,
        friendUid: friend.senderUid, // Adjust according to the correct friend ID field
      },
      headers: {
        "Content-Type": "application/json"
      }
    });

    // Update friends list to remove deleted chat
    friends.value = friends.value.filter(f => f.senderUid !== friend.senderUid);
    if (selectedFriend.value && selectedFriend.value.senderUid === friend.senderUid) {
      selectedFriend.value = null; // Clear selected friend if they were deleted
    }

  } catch (error) {
    console.error("Failed to delete chat:", error);
  }
};



const startChatWithFriend = async (friend) => {
  isFindChatPopupVisible.value = false; // Close the popup immediately

  try {
    const userUid = getAuth().currentUser.uid;

    // Check if a conversation with this friend already exists
    const response = await axios.get(`http://localhost:3000/api/messages/user/${userUid}`);
    const existingChat = response.data.find(chat => chat.senderUid === friend.id || chat.receiverUid === friend.id);

    if (existingChat) {
      // If chat already exists, select the friend in the chat panel without sending a new message
      selectedFriend.value = friend;
    } else {
      // No existing chat found, send the initial message to start a new chat
      await axios.post(`http://localhost:3000/api/messages/send`, {
        senderUid: userUid,
        receiverUid: friend.id,
        messageText: "Hello! Let's start chatting!"
      });

      // After creating the new chat, set the selected friend to display the chat
      selectedFriend.value = friend;

      // Optionally, fetch the updated friends list or conversations
      await fetchFriends();
    }
  } catch (error) {
    console.error("Failed to start chat with friend:", error);
  }
};

onMounted(() => {
  fetchFriends();
});
</script>



<style scoped>
/* Main container layout */
.home-container {
  display: flex;
  height: 100vh;
  /* Full viewport height */
  overflow: hidden;
  /* Prevent unwanted overflow */
}

/* Navbar styling for desktop and larger screens */
.navbar {
  width: 250px;
  /* Sidebar width */
  height: 100vh;
  /* Full height */
}

/* Main content area */
main {
  flex-grow: 1;
  /* Take remaining space */
  overflow-y: auto;
  /* Allow scrolling if content overflows */
}

/* Responsive Adjustments */
@media (max-width: 991px) {
  .navbar {
    width: 80px;
    /* Narrower sidebar for md screens */
  }
}

@media (max-width: 767px) {
  .home-container {
    flex-direction: column;
    /* Stack navbar and main vertically */
  }

  .navbar {
    width: 100%;
    height: 50px;
    /* Adjusted height for bottom navbar */
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #f9f9f9;
    z-index: 10;
    /* Ensure navbar is above content */
  }

  main {
    flex-grow: 1;
    overflow-y: auto;
    /* Allow main to scroll if content overflows */
  }
}
</style>
