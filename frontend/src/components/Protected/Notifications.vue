<template>
    <div class="container">
      <div class="row">
        <!-- Right Section -->
        <div class="col-lg-12 right">
          <!-- Recent Box -->
          <div class="box shadow-sm rounded bg-white mb-3" v-if="recentNotifications.length">
            <div class="box-title border-bottom p-3">
              <h6 class="m-0">Recent</h6>
            </div>
            <div class="box-body p-0">
              <div
                v-for="(post, index) in recentNotifications"
                :key="index"
                class="notification-item p-3 d-flex align-items-center bg-white border-bottom osahan-post-header"
              >
                <div class="dropdown-list-image mr-3">
                  <img class="rounded-circle" :src="post.image" alt="Responsive image" />
                </div>
                <div class="font-weight-bold mr-3">
                  <div class="text-truncate">{{ post.title }}</div>
                  <div class="small">{{ post.subtitle }}</div>
                </div>
                <div class="ml-auto mb-auto text-right" style="margin-top: 15px;">
                  <span class="text-muted">{{ getRelativeTime(post.createdAt) }}</span>
                  <button class="btn btn-outline-danger btn-sm ml-3" @click="deleteNotification(index, 'recent')">Delete</button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Earlier Box -->
          <div class="box shadow-sm rounded bg-white mb-3" v-if="earlierNotifications.length">
            <div class="box-title border-bottom p-3">
              <h6 class="m-0">Earlier</h6>
            </div>
            <div class="box-body p-0">
              <div
                v-for="(post, index) in earlierNotifications"
                :key="index"
                class="notification-item p-3 d-flex align-items-center bg-white border-bottom osahan-post-header"
              >
                <div class="dropdown-list-image mr-3">
                  <img v-if="post.image" class="rounded-circle" :src="post.image" alt="Responsive image" />
                  <div v-else class="rounded-circle text-white d-flex align-items-center justify-content-center" :class="post.avatarClass">
                    {{ post.initials }}
                  </div>
                </div>
                <div class="font-weight-bold mr-3">
                  <div class="text-truncate">{{ post.title }}</div>
                  <div class="small">{{ post.subtitle }}</div>
                </div>
                <div class="ml-auto mb-auto text-right" style="margin-top: 15px;">
                  <span class="text-muted">{{ getRelativeTime(post.createdAt) }}</span>
                  <button class="btn btn-outline-danger btn-sm ml-3" @click="deleteNotification(index, 'earlier')">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        notifications: [
          {
            image: "https://bootdey.com/img/Content/avatar/avatar3.png",
            title: "DAILY RUNDOWN: WEDNESDAY",
            subtitle: "Income tax sops on the cards, The bias in VC funding, and other top news for you",
            createdAt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
          },
          {
            image: "https://bootdey.com/img/Content/avatar/avatar1.png",
            title: "We found a job at askbootstrap Ltd...",
            subtitle: "Vivamus imperdiet venenatis est...",
            createdAt: new Date(new Date().getTime() - 48 * 60 * 60 * 1000) // 48 hours ago
          },
          {
            avatarClass: "bg-danger",
            initials: "DRM",
            title: "DAILY RUNDOWN: MONDAY",
            subtitle: "Nunc purus metus, aliquam vitae venenatis sit amet...",
            createdAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
          }
        ],
        recentNotifications: [],
        earlierNotifications: []
      };
    },
    mounted() {
      this.categorizeAndSortNotifications();
    },
    methods: {
      categorizeAndSortNotifications() {
        const now = new Date();
        const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  
        // Categorize and sort by createdAt in descending order (earliest to latest)
        this.recentNotifications = this.notifications
          .filter(notification => now - new Date(notification.createdAt) <= oneDayInMs)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Descending order (earliest at the top)
  
        this.earlierNotifications = this.notifications
          .filter(notification => now - new Date(notification.createdAt) > oneDayInMs)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Descending order (earliest at the top)
      },
      getRelativeTime(createdAt) {
        const now = new Date();
        const diffInMs = now - new Date(createdAt);
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
        if (diffInHours < 24) {
          return `${diffInHours}h ago`; // Less than a day, show in hours
        } else {
          return `${diffInDays}d ago`; // More than a day, show in days
        }
      },
      deleteNotification(index, type) {
        if (type === "recent") {
          this.recentNotifications.splice(index, 1);
        } else if (type === "earlier") {
          this.earlierNotifications.splice(index, 1);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  body {
    margin-top: 20px;
    background-color: #f0f2f5;
  }
  
  .notification-item {
    margin: 0;
    padding: 15px;

    border: 1px solid #e0e0e0;
    background-color: #fff;
  }
  
  .dropdown-list-image {
    position: relative;
    height: 2.5rem;
    width: 2.5rem;
  }
  .dropdown-list-image img {
    height: 2.5rem;
    width: 2.5rem;
  }
  
  .text-muted {
    font-size: 0.9em;
    color: #6c757d;
  }
  
  .btn-outline-danger {
    color: #dc3545;
    border-color: #dc3545;
    border-radius: 12px;
    padding: 5px 10px;
  }
  .btn-outline-danger:hover {
    color: white;
    background-color: #dc3545;
  }
  </style>
  