<template>
    <div class="filtered-events">
        <div v-if="loading">
            <p class="loading-message">Finding events...</p>
        </div>
        <!-- Only display the title if there are events to display -->
        <div v-else-if="filteredEvents.length > 0">
            <h1 class="title">Explore <span class="numEvents">{{ filteredEvents.length }}</span> Events</h1>
            <div class="events-grid">
                <div v-for="(event, index) in filteredEvents" :key="index" class="mb-4 mx-auto">
                    <router-link :to="{ name: 'eventDetail', params: { id: event.eventId } }">
                        <div class="carousel__item">
                            <div class="card">
                                <img :src="event.eventImage || 'https://via.placeholder.com/300x150'" alt="Event Image">
                                <div class="card-body">
                                    <div class="card-left">
                                        <div class="event-date">
                                            <div class="month">{{ formatEventMonth(event.date) }}</div>
                                            <div class="year">{{ formatEventYear(event.date) }}</div>
                                        </div>
                                    </div>
                                    <div class="card-right">
                                        <div class="event-title">{{ event.title }}</div>
                                        <div class="event-details">
                                            {{ formatEventOrdinalDay(event.date) }} {{ formatEventMonthFull(event.date)
                                            }} at
                                            {{ formatEventTime(event.date) }}
                                        </div>
                                        <div class="event-subtitle">
                                            <i class="fas fa-star star-icon"></i>
                                            {{ event.interestedUsers ? event.interestedUsers.length : 0 }} Interested
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>

        <div v-else>
            <p class="noevents">Uh oh...no events found.</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    props: {
        filters: {
            type: Object,
            required: true,
        },
        selectedEventType: {
            type: String,
            required: true,
        },
    },
    data() { 
        return {
            events: [],
            errorMessage: '',
            loading: true,
            geocodedEvents: [],
            radius: 3000, // 3 km radius for location filtering
        };
    },
    methods: {
        async fetchEvents() {
            this.loading = true;
            try {
                const response = await axios.get('http://localhost:3000/api/events');
                this.events = response.data;
                console.log(this.events);
            } catch (error) {
                console.error('Error fetching events:', error);
                this.errorMessage = 'Failed to load events.';
            } finally {
                this.loading = false;
            }
        },
        calculateDistance(lat1, lng1, lat2, lng2) {
            const toRadians = (degrees) => degrees * (Math.PI / 180);
            const R = 6371; // Earth's radius in kilometers
            const dLat = toRadians(lat2 - lat1);
            const dLng = toRadians(lng2 - lng1);
            const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in kilometers
        },

        formatEventMonth(dateInput) {
            const dateObj = this.convertToDate(dateInput);
            return dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        },
        formatEventYear(dateInput) {
            const dateObj = this.convertToDate(dateInput);
            return dateObj.getFullYear();
        },
        convertToDate(dateInput) {
            if (dateInput && dateInput._seconds) {
                // If date is a Firestore Timestamp object
                return new Date(dateInput._seconds * 1000);
            } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
                // If date is a string or number
                return new Date(dateInput);
            } else {
                return new Date();
            }
        },
        formatEventOrdinalDay(dateInput) {
            const dateObj = this.convertToDate(dateInput);
            const day = dateObj.getDate();
            const suffix = day % 10 === 1 && day !== 11 ? "st" :
                day % 10 === 2 && day !== 12 ? "nd" :
                    day % 10 === 3 && day !== 13 ? "rd" : "th";
            return `${day}${suffix}`;
        },
        formatEventMonthFull(dateInput) {
            const dateObj = this.convertToDate(dateInput);
            return dateObj.toLocaleString('en-US', { month: 'long' });
        },
        formatEventTime(dateInput) {
            const dateObj = this.convertToDate(dateInput);
            const hours = dateObj.getHours();
            const minutes = dateObj.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; // Convert to 12-hour format

            return `${formattedHours}:${minutes}${ampm.toLowerCase()}`;
        },
        // Helper function to check if event size falls within selected range
        isEventSizeInRange(eventSize, range) {
            eventSize = Number(eventSize); // Ensure eventSize is a number for comparison
            // console.log("Event Size Filter:", range);
            // console.log("Event Size in Data:", eventSize);

            if (range === "<10") {
                return eventSize < 10;
            } else if (range === "10-50") {
                // console.log(eventSize >= 10 && eventSize <= 50);
                return eventSize >= 10 && eventSize <= 50;
            } else if (range === "50-100") {
                return eventSize > 50 && eventSize <= 100;
            } else if (range === ">100") {
                return eventSize > 100;
            }
            return true;
        },
    },
    mounted() {
        this.fetchEvents();
    },
    computed: {
        filteredEvents() {
            if (!this.filters || !this.events || !this.selectedEventType) return [];

            const typeFilteredEvents = this.events.filter(event => event.eventType === this.selectedEventType);

            return typeFilteredEvents.filter(event => {
                const { searchQuery, petType, eventSize, dateRange, location } = this.filters;

                const searchMatch = searchQuery
                    ? event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (Array.isArray(event.petType) && event.petType.some(type => type.toLowerCase().includes(searchQuery.toLowerCase())))
                    : true;

                const petTypeMatch = petType && (petType.cats || petType.dogs)
                    ? (petType.cats && event.petType?.includes('Cat')) ||
                    (petType.dogs && event.petType?.includes('Dog'))
                    : true;

                const eventSizeMatch = eventSize
                    ? this.isEventSizeInRange(Number(event.eventSize), eventSize)
                    : true;

                const startDateMatch = dateRange?.startDate
                    ? new Date(event.date) >= new Date(dateRange.startDate)
                    : true;
                const endDateMatch = dateRange?.endDate
                    ? new Date(event.date) <= new Date(dateRange.endDate)
                    : true;

                let locationMatch = true;

                // Adjust location match to use locationData array
                if (location && event.locationData && event.locationData.length === 2) {
                    const [eventLat, eventLng] = event.locationData;
                    const distance = this.calculateDistance(location.lat, location.lng, eventLat, eventLng);
                    console.log(`Event at [${eventLat}, ${eventLng}] is ${distance} km away from selected location (within 3km? ${distance <= 3})`);

                    locationMatch = distance <= 3; // Check within 3 km radius
                } else {
                    console.log('Location data missing or incomplete for event');
                }

                return searchMatch && petTypeMatch && eventSizeMatch && startDateMatch && endDateMatch && locationMatch;
            });
        }
    }


};
</script>

<style scoped>
.events-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 3 equal-width columns */
    gap: 20px;
    /* Space between the cards */
}

@media (max-width: 1024px) {
    .events-grid {
        grid-template-columns: repeat(2, 1fr);
        /* 2 columns on smaller screens */
    }
}

@media (max-width: 640px) {
    .events-grid {
        grid-template-columns: 1fr;
        /* 1 column on mobile */
    }
}

.loading-message,
.title,
.numEvents,
.noevents {
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-size: 30px;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 20px;
    color: black;
}

.numEvents {
    color: #7B61FF;
}


/* Card Styles */
.card {
    transform: scale(0.95);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.8s ease, box-shadow 0.8s ease;
    height: 100%;
    width: 100%;
    max-width: 550px;
}

.card:hover {
    transform: scale(1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.card img {
    width: 100%;
    height: auto;
}

/* Card Body Styles */
.card-body {
    display: flex;
    padding: 20px;
    background-color: white;
}

/* Card Left Section */
.card-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.month {
    font-size: 20px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: -5px;
    color: black;
}

.year {
    font-size: 17px;
    color: #777;
    color: black;
    font-weight: none;
}

/* Card Right Section */
.card-right {
    flex: 2;
    padding-left: 20px;
}

.date,
.date-month {
    font-size: 16px;
    font-weight: bold;

}

.event-details {
    font-size: 14px;
    color: #555;
    margin-top: 5px;
    font-weight: bold;
}

.event-title {
    color: black;
    font-size: 16px;
    font-weight: bold;
    display: -webkit-box;
    /* Required for multi-line truncation */
    -webkit-line-clamp: 1;
    /* Limit to 2 lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    /* Allows wrapping of text */
}

.event-subtitle {
    font-size: 14px;
    color: #777;
    font-weight: bold;
}

.star-icon {
    color: gold;
    margin-right: 5px;
}
</style>