<template>
  <div class="home-container">
    <Navbar /> 
    <main id="scrollable-element">
      <ProfileMain 
      
        @edit-event="openEditEventModal" 
        @event-updated="fetchEvents" 
      />
    </main>
    <!-- Edit Event Modal -->
    <EditEventModal 
      v-if="showEditModal" 
      :eventData="editEventData" 
      @close="closeEditEventModal" 
      @event-updated="handleEventUpdated" 
    />
  </div>
</template>

<script setup>
// Any Home page-specific logic
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Protected/Navbar.vue';
import ProfileMain from '@/components/Protected/Profile/ProfileMain.vue';
import EditEventModal from '@/components/Protected/EventsAdmin/EditEventModal.vue';

const showEditModal = ref(false);
const editEventData = ref(null);

const openEditEventModal = (event) => {
  editEventData.value = event;
  showEditModal.value = true;
};

const closeEditEventModal = () => {
  showEditModal.value = false;
  editEventData.value = null;
};

import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
Scrollbar.use(OverscrollPlugin);

onMounted(() => {
  const scrollbar = Scrollbar.init(document.querySelector('#scrollable-element'), {
    damping: 0.05,
    renderByPixels: true,
    alwaysShowTracks: false,
    continuousScrolling: true,
    plugins: {
      overscroll: {
        effect: 'bounce',
        damping: 0.2,
        maxOverscroll: 70,
      },
    },
  });

  // Hide the scrollbar track by setting its opacity to 0
  scrollbar.track.xAxis.element.style.opacity = '0';
  scrollbar.track.yAxis.element.style.opacity = '0';
});
</script>

<style scoped>
#scrollable-element {
  width: 100%;
  height: 100%;
  overflow-y: scroll;

}

.navbar {
  width: 250px;
  /* Width of the navbar */
  height: 100vh;
  /* Full height of the viewport */
  position: fixed;
}

.home-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

main {
  align-items: center;
  margin-left: 250px;
  flex-grow: 1;

  flex-direction: column;
  gap: 5px;
  background-color: #FCEFB4;
  height: 100vh;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}

/* Responsive Adjustments */
@media (max-width: 991px) {
  .navbar {
    width: 80px;
  }

  main {
    margin-left: 80px;
    padding: 15px;
  }

  .floating-btn {
    width: 45px;
    height: 45px;
    font-size: 26px;
  }
}

@media (max-width: 767px) {
  .home-container {
    flex-direction: column;
  }

  .navbar {
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #f9f9f9;
    z-index: 10;
  }

  main {
    margin-left: 0;
    margin-top: 0;
    padding: 15px;
    height: calc(100vh - 50px);
    /* Account for navbar height on mobile */
    overflow-y: auto;
  }

  .floating-btn {
    bottom: 70px;
    /* Place above mobile navbar */
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
}
</style>
