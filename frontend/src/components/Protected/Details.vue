
<template>
    <div class="event-detail" v-if="event">
        <router-link to="/events" class="back-button"><img src="../../assets/images/back_arrow.png" alt="back" width="40px"></router-link>

        <img class="event-image" :src="event.image" alt="Event Image" />

        <h1 class="event-title">{{ event.title }}</h1>

        <div class="event-info">
            <div class="left-block">
                <h3>About</h3>
                <p>{{ event.description }}</p>

                <h3 style="padding-top:15px;">Hosted by:</h3>
                <div class="host-info">
                    <img class="profile-pic" :src="event.host.profilePic" alt="Profile Picture" />
                    <div class="host-details">
                        <strong>{{ event.host.username }}</strong>
                        <div class="host-buttons">
                            <button class="contact-button">Contact</button>
                            <button class="follow-button">+ Follow</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="right-block">
                <h3>Date & Time</h3>
                <div class="date-time">
                    <div class="date">
                        <span class="icon calendar-icon">📅</span>
                        <span>{{ event.day }}, {{ event.date }}</span>
                    </div>
                    <div class="time">
                        <span class="icon clock-icon">⏰</span>
                        <span>{{ event.time }}</span>
                    </div>
                </div>
                <p class="add-to-calendar">+Add to Calendar</p>

                <h3>Location</h3>
                <div class="location">
                    <span class="icon location-icon">📍</span>
                    <span>{{ event.address }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
export default {
    name: "EventDetail",
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

h3 {
    font-weight: bold;
    padding-bottom: 7px;
    padding-top: 3px;
}

.event-detail {
    padding: 20px;
}

.back-button {
    text-decoration: none;
    color: #007bff;
    font-size: 16px;
}

.event-image {
    width: 800px;
    border-radius: 10px;
    margin: auto;
}

.event-title {
    font-family: 'Poppins', sans-serif;
    font-size: 32px;
    font-weight: bold;
    margin: 20px 0;
    text-align: center;
}

.event-info {
    display: flex;
    gap: 20px;
}

.left-block,
.right-block {
    flex: 1;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    height: 100%;
}

.host-info {
    display: flex;
    align-items: center;
    margin-top: 7px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 290px;
    height: 90px;
}

.profile-pic {
    margin-left: 10px;
    border-radius: 50%;
    margin-right: 10px;
    height: 70px;
    width: 70px;
}

.host-details {
    flex-grow: 1;
}

.host-buttons {
    display: flex;
    gap: 10px;
    padding-top: 8px;
    padding-bottom: 10px;
}

.contact-button,
.follow-button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.contact-button {
    background-color: white;
    color: #C99F25;
    border: 1px solid #C99F25;
}

.follow-button {
    background-color: #FBD157;
    color: black;
}

.date,
.time {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}


.add-to-calendar {
    margin-left: 25px;
    color: #7B61FF;
    cursor: pointer;
    margin-bottom: 10px;
}

.location {
    display: flex;
    align-items: center;
}
</style>
