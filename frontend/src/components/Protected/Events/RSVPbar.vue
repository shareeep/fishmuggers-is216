<template>
    <!-- Fixed Bottom Bar -->
    <div class="bottom-bar">
        <span @click="toggleInterested" class="icon star-icon" :class="{ 'filled': isInterested }">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="30" height="30">
                <path
                    d="M12 .587l3.668 7.568 8.332 1.203-6.002 5.854 1.417 8.338L12 18.896l-7.415 3.885 1.417-8.338-6.002-5.854 8.332-1.203L12 .587z" />
            </svg>
        </span>
        <button class="icon share-icon"><img src="../../../assets/images/send.png" width="30px" alt="send"></button>
        <span class="slots-left">{{ event.slots }} slots left</span>
        <button class="directions-button">Directions</button>
        <button class="rsvp-button">RSVP</button>
    </div>
</template>

<script>
export default {
    name: "EventDetail",
    data() {
        return {
            event: null,  // Initialize event as null
            isInterested: false,
        };
    },
    mounted() {
        const eventId = this.$route.params.id;
        fetch(`/api/events/${eventId}`)
            .then(response => response.json())
            .then(data => {
                this.event = data;  // Set the event data from the API

            })
            .catch(error => {
                console.error('Failed to fetch event:', error);
            });
    },
    methods: {
        toggleInterested() {
            this.isInterested = !this.isInterested; // Toggle interest state
        },

    },
    data() {
        return {
            // Example event data
            event: {
                title: "Sample Event",
                image: "https://via.placeholder.com/800x400",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                host: {
                    profilePic: "https://via.placeholder.com/50",
                    username: "@Username",
                },
                day: "Monday",
                date: "October 16",
                time: "5:00 PM",
                address: "123 Sample St, Sample City, ST 12345",
                slots: 3,
            },
            isInterested: false,
        };
    },
    methods: {
        toggleInterested() {
            this.isInterested = !this.isInterested; // Toggle interest state
        }
    },
};
</script>

<style scoped>
.share-icon {
    padding-left: 25px;
}

.icon {
    margin-right: 10px;
    padding-left: 15px;
    cursor: pointer;
    transition: fill 0.3s;
    /* Smooth transition for fill */

}

.star-icon {
    color: white;
    /* Default star color */
    stroke: black;
}

.star-icon.filled {
    color: #FFD700;
    /* Gold color when filled */
}

.bottom-bar {

    z-index: 1000000;

    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    background-color: white;
    padding: 10px 20px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    gap: 10px;
}

.slots-left {
    flex-grow: 1;
    padding-left: 550px;
    font-weight: bold;
    font-size: large;
}

.directions-button,
.rsvp-button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}


.directions-button,
.rsvp-button {
    background-color: #FBD157;
    color: black;
    font-family: poppins, sans-serif;
    font-weight: 550;
    margin-right: 20px;
    font-size: large;
}
</style>
