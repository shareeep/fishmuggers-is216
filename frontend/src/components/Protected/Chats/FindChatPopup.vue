<template>
    <div class="popup-overlay" @click.self="$emit('close')">
        <div class="popup-content">
            <button class="close-button" @click="$emit('close')">✕</button>
            <h2>Find a Friend to Chat!</h2>

            <div class="search-bar">
                <input v-model="searchQuery" placeholder="Search" type="search" />
            </div>

            <div class="friends-list">
                <div v-for="friend in filteredFriends" :key="friend.id" class="friend-item">
                    <img :src="friend.avatar" alt="Friend Avatar" class="avatar" />
                    <div class="friend-info">
                        <p class="friend-name">{{ friend.name }}</p>
                        <p class="friend-username">{{ friend.username }}</p>
                    </div>
                    <button class="see-profile-button" @click="startChat(friend)"
                        :disabled="loadingFriendId === friend.id">
                        {{ loadingFriendId === friend.id ? "Starting Chat..." : "Chat" }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "FindChatPopup",
    props: {
        friends: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            searchQuery: "",
            loadingFriendId: null // Track the loading state for a specific friend
        };
    },
    computed: {
        filteredFriends() {
            const query = this.searchQuery.toLowerCase();
            return this.friends.filter(friend =>
                friend.name.toLowerCase().startsWith(query) ||
                friend.username.toLowerCase().startsWith(query)
            );
        }
    },
    methods: {
        async startChat(friend) {
            this.loadingFriendId = friend.id; // Set loading state
            try {
                // Emit and await for `startChat` in parent component
                await this.$emit("startChat", friend);
            } finally {
                // Reset loading state only after all chat start processes complete
                this.loadingFriendId = null;
            }
        }
    }
};
</script>





<style scoped>
/* Same styling as provided */
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.popup-content {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    width: 500px;
    height: 500px;
    padding: 20px;
    border-radius: 15px;
    position: relative;
    text-align: center;
    overflow-y: auto;
}

.close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
}

h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 15px;
}

.search-bar {
    margin-bottom: 15px;
}

input[type="search"] {
    width: 100%;
    padding: 10px;
    border: 2px solid #FFD700;
    border-radius: 25px;
    transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="search"]:focus {
    border-color: #FAE588;
    box-shadow: 0 0 0 2px #FFD700;
    color: black;
}

.friends-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    max-height: 60vh;
}

.friend-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #f0f0f0;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.friend-info {
    flex-grow: 1;
    text-align: left;
}

.friend-name {
    font-weight: bold;
    margin: 0;
}

.friend-username {
    color: #888;
    font-size: 0.9rem;
    margin: 0;
}

.see-profile-button {
    padding: 5px 15px;
    font-size: 1rem;
    font-weight: bold;
    color: #5A45D6;
    background-color: #f5f0ff;
    border: 2px solid #7B61FF;
    border-radius: 30px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.see-profile-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2);
}

.see-profile-button:active {
    transform: scale(0.98);
}

.friends-list::-webkit-scrollbar {
    display: none;
}

@media (max-width: 768px) {
    .popup-content {
        width: 400px;
    }
}
</style>
