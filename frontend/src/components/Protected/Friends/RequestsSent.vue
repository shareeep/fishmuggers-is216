<template>
  <div class="requests-sent">
    <h3>Requests Sent ({{ sentRequests.length }})</h3>
    <div class="request-list">
      <div v-for="(request, index) in sentRequests" :key="request.id" class="request-item"
        :style="{ animationDelay: `${index * 0.2}s` }">
        <img :src="request.avatar" alt="User Avatar" />
        <div class="info-container">
          <div class="details">
            <h4>{{ request.name }}</h4>
            <p>{{ request.username }}</p>
            <p>{{ request.daysAgo }}</p>
          </div>
          <div class="actions">
            <!-- Your existing cancel button -->
            <button @click="openConfirmationModal(request.id)" class="cancel-button">✕ Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal v-if="showModal" title="Cancel Friend Request"
      message="Are you sure you want to cancel this friend request?" @confirm="cancelRequest" @close="closeModal" />
  </div>
</template>

<script>
import ConfirmationModal from './ConfirmationModal.vue';
import api from '@/services/api';

export default {
  name: "RequestsSent",
  props: {
    sentRequests: {
      type: Array,
      required: true,
    },
  },
  components: {
    ConfirmationModal,
  },
  data() {
    return {
      showModal: false,
      requestIdToCancel: null,
    };
  },
  
  methods: {
    openConfirmationModal(requestId) {
      // Store the ID of the request we want to cancel and show the modal
      this.requestIdToCancel = requestId;
      this.showModal = true;
    },
    closeModal() {
      // Close the modal and reset the request ID
      this.showModal = false;
      this.requestIdToCancel = null;
    },
    async cancelRequest() {
      try {
        await api.delete(`/api/friends/request/${this.requestIdToCancel}`);
        // Remove the canceled request from sentRequests by emitting an event
        this.$emit('updateSentRequests', this.requestIdToCancel);
      } catch (error) {
        console.error("Error canceling friend request:", error);
        alert("Failed to cancel friend request. Please try again.");
      } finally {
        this.closeModal();
      }
    },


  },
};
</script>

<style scoped>
@keyframes popFadeIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.requests-sent {
  padding: 20px;
  color: #333;
}

h3 {
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.request-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.request-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  width: 250px;
  opacity: 0;
  transform: scale(0.9);
  animation: popFadeIn 0.4s forwards;
}
@media (max-width: 1005px) {
  .request-list {
    justify-content: center; /* 2 items per row for medium screens */
  }
}
.request-item img {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

.info-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.details {
  flex-grow: 1;
}

.details h4 {
  font-weight: bold;
  color: #333;
  margin: 0;
}

.details p {
  color: #666;
  margin: 0;
}

.actions {
  display: flex; 
  justify-content: flex-start;
  gap: 10px;
  margin-top: 5px;
}

.cancel-button {
  background-color: #ddd;
  color: #333;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cancel-button:hover {
  background-color: #bbb;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.cancel-button:active {
  transform: scale(0.98);
}
</style>