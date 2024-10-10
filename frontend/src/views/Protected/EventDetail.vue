<template>
    <div class="event-detail">
        <router-link to="/" class="back-button">Back</router-link>

        <img class="event-image" src="https://via.placeholder.com/800x400" alt="Event Image" />

        <h1 class="event-title">Event Title</h1>

        <div class="event-info">
            <div class="left-block">
                <h2>About</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.</p>

                <h3>Hosted by:</h3>
                <div class="host-info">
                    <img class="profile-pic" src="https://via.placeholder.com/50" alt="Profile Picture" />
                    <div class="host-details">
                        <strong>@Username</strong>
                        <div class="host-buttons">
                            <button class="contact-button">Contact</button>
                            <button class="follow-button">Follow</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="right-block">
                <h2>Date & Time</h2>
                <div class="date-time">
                    <div class="date">
                        <span class="icon calendar-icon">📅</span>
                        <span>Day, Date</span>
                    </div>
                    <div class="time">
                        <span class="icon clock-icon">⏰</span>
                        <span>Time</span>
                    </div>
                </div>
                <p class="add-to-calendar">+Add to Calendar</p>

                <h2>Location</h2>
                <div class="location">
                    <span class="icon location-icon">📍</span>
                    <span>Address</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "EventDetail",
};
</script>

<style scoped>
.event-detail {
    padding: 20px;
}

.back-button {
    text-decoration: none;
    color: #007bff;
    font-size: 16px;
}

.event-image {
    width: 100%;
    border-radius: 10px;
}

.event-title {
    font-family: 'Poppins', sans-serif;
    font-size: 32px;
    font-weight: bold;
    margin: 20px 0;
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
}

.host-info {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.profile-pic {
    border-radius: 50%;
    margin-right: 10px;
}

.host-details {
    flex-grow: 1;
}

.host-buttons {
    display: flex;
    gap: 10px;
}

.contact-button,
.follow-button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.contact-button {
    background-color: #007bff;
    color: white;
}

.follow-button {
    background-color: #28a745;
    color: white;
}

.date-time {
    margin: 10px 0;
}

.date,
.time {
    display: flex;
    align-items: center;
    margin: 5px 0;
}

.icon {
    margin-right: 10px;
}

.add-to-calendar {
    color: purple;
    cursor: pointer;
}

.location {
    display: flex;
    align-items: center;
    margin: 10px 0;
}
</style>