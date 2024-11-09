<!-- SearchedUsers.vue -->
<template>
    <div class="friends-list">
        <div class="header">
            <h3>Searched Users ({{ userCount }})</h3>
        </div>

        <div class="friends-scroll">
            <!-- Display searched users -->
            <div v-for="user in users" :key="user.id" class="friend-item">
                <router-link :to="{ name: 'friendProfile', params: { id: user.id } }">
                    <img :src="user.profileImage || 'default-avatar.jpg'" alt="User Profile Image" />
                    <p class="friend-username">{{ user.username }}</p>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SearchedUsers",
    props: {
        users: {
            type: Array,
            required: true
        }
    },
    computed: {
        // Computed property to get the count of searched users
        userCount() {
            return this.users.length;
        }
    },
    methods: {
        emitSearchQuery() {
            this.$emit("search-query", this.searchQuery);
        },
        applySearch() {
            this.emitSearchQuery();
        },
        handleSearchInput(event) {
            this.emitSearchQuery();
        }
    }

};
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 15px;
}

.friends-list {
    padding: 20px;
}

h3 {
    font-weight: bold;
    color: #333;
}

.friends-scroll {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    overflow-x: hidden;
    padding: 10px 0;
    overflow: visible;
}

.friend-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.3s ease;
    flex-basis: 100px;
    flex: 0 0 auto;
    overflow: visible;
}

.friend-item:hover {
    transform: scale(1.05);
}

.friend-item img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.friend-name {
    font-weight: bold;
    color: #333;
    font-size: 1rem;
    margin-top: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80px;
}

.friend-username {
    color: #777;
    font-size: 0.85rem;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* RESPONSIVENESS */
@media (max-width: 1024px) {
    .friends-scroll {
        max-width: 600px;
        margin: 0 auto;
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .friends-scroll {
        max-width: 600px;
        justify-content: center;
        text-align: center;
    }
}

@media (max-width: 640px) {
    .friends-scroll {
        max-width: 600px;
        justify-content: center;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .friends-scroll {
        max-width: 600px;
        justify-content: center;
        text-align: center;
    }
}
</style>