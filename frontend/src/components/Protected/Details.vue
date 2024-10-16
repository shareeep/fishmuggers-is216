<template>
    <div class="event-detail" v-if="event">
        <!--back button-->
        <router-link to="/events" class="back-button"><img src="../../assets/images/back_arrow.png" alt="back"
                width="40px"></router-link>
        <!--image-->
        <img class="event-image" :src="event.image" alt="Event Image" />

        <!--title-->
        <h1 class="event-title">{{ event.title }}</h1>

        <div class="event-info">
            <!--left block-->
            <div class="left-block">

                <!--about-->
                <h3>About</h3>
                <p>{{ event.description }}</p>

                <!--host-->
                <h3 style="padding-top:15px;">Hosted by:</h3>
                <!--host block-->
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

                <h3 style="padding-top:15px;">Pet Type</h3>
                <div class="pet-type-container">
                    <span v-for="(type, index) in event.pettype" :key="index" class="pet-type">
                        {{ type }}
                    </span>
                </div>

                <h3 style="padding-top:15px;">Event Size</h3>
                <p>{{ event.eventsize }}</p>
            </div>

            <!--right block-->
            <div class="right-block">
                <!--date & time-->
                <h3>Date & Time</h3>
                <div class="date-time">
                    <div class="date">
                        <span class="icon calendar-icon"><img src="../../assets/images/calendar_icon.png"
                                alt="calendaricon" style="width:30px;height:30px;"></span>
                        <span> {{ event.day }}, {{ event.date }}</span>
                    </div>
                    <div class="time">
                        <span class="icon clock-icon"><img src="../../assets/images/time_icon.png" alt="timeicon"
                                style="width:30px;height:30px;"></span>
                        <span> {{ event.time }}</span>
                    </div>
                </div>
                <!--add to calendar-->
                <button class="add-to-calendar">+Add to Calendar</button>

                <!--location-->
                <h3>Location</h3>
                <div class="location">
                    <span class="icon location-icon"><img src="../../assets/images/location_icon.png" alt="locationicon"
                            style="width:30px;height:30px;"></span>
                    <span>{{ event.address }}</span>
                </div>

                <!--leaflet.js map-->
                <div id="map">
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import customMarkerIcon from '../../assets/images/paw_marker.png';
export default {
    name: "EventDetail",
    data() {
        return {
            event: null,  // Initialize event as null
            isInterested: false,
            map: null,
            marker: null,
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

        // Initialize the map centered on Singapore
        // (using SMU coordinates for now)
        var map = L.map('map').setView([1.2963, 103.8502], 20);

        // OneMap tile layer
        var basemap = L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
            detectRetina: true,
            maxZoom: 19,
            minZoom: 5,
            attribution: '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;display: inline-block;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
        }).addTo(map);

        // Define the custom marker icon
        var pawIcon = L.icon({
            iconUrl: customMarkerIcon, // Ensure this path is correct
            iconSize: [60, 60], // Size of the icon
            iconAnchor: [30, 60], // Point of the icon which will correspond to marker's location
            popupAnchor: [0, -60] // Point from which the popup should open relative to the iconAnchor
        });

        // Add a marker to the map
        const marker = L.marker([1.2963, 103.8502], { icon: pawIcon }).addTo(map);

        // Bind the popup to the marker
        marker.bindPopup("<b>[insert address here?]</b>");

        // Center the map on the marker when the marker is clicked
        marker.on('click', function (e) {
            map.setView(e.latlng);
        });

    },
    // methods: {
    //     toggleInterested() {
    //         this.isInterested = !this.isInterested; // Toggle interest state
    //     },

    // },
    // Example static event data for now 
    data() {
        return {
            event: {
                title: "Sample Event",
                image: "https://via.placeholder.com/800x400",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                host: {
                    profilePic: "https://via.placeholder.com/50",
                    username: "@Username",
                },
                pettype: [
                    'Dog',
                    'Cat'
                ],
                eventsize: '50-100',
                day: "Monday",
                date: "October 16",
                time: "5:00 PM",
                address: "123 Sample St, Sample City, ST 12345",
                slots: 3,
            },
            isInterested: false,
        };
    },
};
</script>

<style scoped>
.pet-type-container {
    display: flex;
    /* Align items inline */
    gap: 10px;
    /* Space between each pet type */
}

.pet-type {
    border: 2px solid #7B61FF;
    /* Gold border */
    border-radius: 15px;
    /* Rounded corners */
    padding: 5px 15px;
    /* Padding for spacing */
    background-color: transparent;
    /* No fill */
    color: #7B61FF;
    /* Text color */
    font-weight: bold;
    /*Optional: make the text bold */
}


#map {
    /* display: flex;
    flex-grow: 1; */
    margin-top: 15px;
    width: 600px;
    height: 400px;
}

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
    overflow: hidden;
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

.icon {
    padding-right: 10px;
}
</style>
