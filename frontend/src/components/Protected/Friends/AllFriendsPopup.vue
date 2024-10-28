<template>
    <div class="popup-overlay" @click.self="$emit('close')">
        <div class="popup-content">
            <button class="close-button" @click="$emit('close')">✕</button>
            <h2>Friends</h2>

            <div class="search-bar">
                <input v-model="searchQuery" placeholder="Search" type="search"/>
            </div>

            <!-- Scrollable friends list -->
            <div class="friends-list">
                <div v-for="friend in filteredFriends" :key="friend.id" class="friend-item">
                    <img :src="friend.avatar" alt="Friend Avatar" class="avatar" />
                    <div class="friend-info">
                        <p class="friend-name">{{ friend.name }}</p>
                        <p class="friend-username">{{ friend.username }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AllFriendsPopup",
    props: {
        friends: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            searchQuery: ""
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
    }
};
</script>

<style scoped>
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
    display:flex;
    flex-direction: column;
    background-color: #fff;
    width: 400px;
    height: 400px;
    /* Fixed height */
    padding: 20px;
    border-radius: 15px;
    /* Border radius */
    position: relative;
    text-align: center;
    overflow: hidden;
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
    position: relative;
    margin-bottom: 15px;
}

input[type="search"] {
    width: 100%;
    padding: 10px;
    border: 2px solid #FFD700;
    border-radius: 25px;
    padding-left: 15px;
    transition: border-color 0.3s, box-shadow 0.3s;

}

input[type="search"]:focus {
    border-color: #FAE588;
    /* Change border color on focus (blue) */
    box-shadow: 0 0 0 2px #FFD700;
    /* Blue focus outline */
    color: black;
}

.search-bar input::placeholder {
    color: #bbb;
}

.friends-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    /* Enable vertical scrolling */
    max-height: 350px;
    /* Adjust to fit within popup */
    padding-right: 5px;
    /* Extra padding for scrollbar */
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
</style>