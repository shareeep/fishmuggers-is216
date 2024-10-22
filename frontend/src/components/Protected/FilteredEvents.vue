<template>
    <div class="filtered-events">
        <!-- Only display the title if there are events to display -->
        <div v-if="filteredEvents.length > 0">
            <h1 class="title">Explore <span class="numEvents">{{ filteredEvents.length }}</span> Events</h1>
            <div class="events-grid">
                <router-link v-for="event in filteredEvents" :key="event.id"
                    :to="{ name: 'eventDetail', params: { id: event.id } }" class="event-card-link">
                    <div class="card" style="width:300px;">
                        <img :src="event.image" alt="Event Image" />
                        <div class="card-body">
                            <div class="card-left">
                                <div class="date">{{ event.month }}</div>
                                <div class="date-month">{{ event.year }}</div>
                            </div>
                            <div class="card-right">
                                <div class="event-title">{{ event.title }}</div>
                                <div class="event-subtitle">{{ event.time }}</div>
                                <div class="event-subtitle">
                                    <i class="fas fa-star star-icon"></i> {{ event.numinterested }} Interested
                                </div>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
        <div v-else>
            <p class="noevents">Uh oh...no events found.</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        filters: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            events: [
                {
                    id: 1,
                    title: "Pet Walk",
                    image: "https://via.placeholder.com/800x400",
                    description: "Lorem ipsum dolor sit amet.",
                    host: {
                        profilePic: "https://via.placeholder.com/50",
                        username: "@Username1",
                    },
                    pettype: ['Dog', 'Cat'],
                    eventsize: '50-100',
                    day: "Monday",
                    date: "2024-10-24",
                    year: '2024',
                    month: 'OCT',
                    time: "1:00pm - 3:00pm",
                    address: "Bishan Park",
                    slots: 3,
                    numinterested: 5,
                },
                {
                    id: 2,
                    title: "Dog Expo",
                    image: "https://via.placeholder.com/800x400",
                    description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    host: {
                        profilePic: "https://via.placeholder.com/50",
                        username: "@Username2",
                    },
                    pettype: ['Dog'],
                    eventsize: '10-50',
                    day: "Tuesday",
                    date: "2024-10-25",
                    year: '2024',
                    month: 'OCT',
                    time: "2:00pm - 4:00pm",
                    address: "Singapore EXPO",
                    slots: 10,
                    numinterested: 7,
                },
                {
                    id: 3,
                    title: "Cat Expo",
                    image: "https://via.placeholder.com/800x400",
                    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
                    host: {
                        profilePic: "https://via.placeholder.com/50",
                        username: "@Username3",
                    },
                    pettype: ['Cat'],
                    eventsize: '50-100',
                    day: "Wednesday",
                    date: "2024-10-26",
                    year: '2024',
                    month: 'OCT',
                    time: "3:00pm - 5:00pm",
                    address: "Singapore Expo",
                    slots: 15,
                    numinterested: 12,
                },
                {
                    id: 4,
                    title: "Puppies 4 Life",
                    image: "https://via.placeholder.com/800x400",
                    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
                    host: {
                        profilePic: "https://via.placeholder.com/50",
                        username: "@Username4",
                    },
                    pettype: ['Dog'],
                    eventsize: '10-50',
                    day: "Wednesday",
                    date: "2024-10-26",
                    year: '2024',
                    month: 'OCT',
                    time: "3:00pm - 5:00pm",
                    address: "City Hall",
                    slots: 3,
                    numinterested: 10,
                }
            ],
        };
    },
    computed: {
        filteredEvents() {
            return this.events.filter(event => {
                const { searchQuery, petType, eventSize, dateRange, location } = this.filters;

                // Search query filter
                const searchMatch = searchQuery
                    ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase())
                    : true;

                // If no petType is selected, allow all pet types
                const petTypeMatch = (petType.cats || petType.dogs)
                    ? (petType.cats && event.pettype.includes('Cat')) ||
                    (petType.dogs && event.pettype.includes('Dog'))
                    : true;

                // If no eventSize is selected, allow all event sizes
                const eventSizeMatch = eventSize ? event.eventsize === eventSize : true;

                // If no dateRange is selected, allow all dates
                const startDateMatch = dateRange.startDate ? new Date(event.date) >= new Date(dateRange.startDate) : true;
                const endDateMatch = dateRange.endDate ? new Date(event.date) <= new Date(dateRange.endDate) : true;

                // If no end date is selected, allow events after the start date without upper limit

                // If no location is selected, allow all locations
                const locationMatch = location ? event.address.toLowerCase().includes(location.toLowerCase()) : true;

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


/*  Card Styles */
.card {
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.8s ease, box-shadow 0.8s ease;
}

.card img {
    width: 100%;
    height: auto;
}

.card-body {
    display: flex;
    padding: 20px;
    background-color: white;
}

.card-left {
    flex: 1;
    text-align: left;
}

.card-right {
    flex: 2;
    padding-left: 20px;
}

.date {
    font-size: 16px;
    font-weight: bold;
}

.date-month {
    font-size: 14px;
}

.event-title {
    font-size: 20px;
    font-weight: bold;
}

.event-subtitle {
    font-size: 14px;
    color: #777;
}

.star-icon {
    color: gold;
    margin-right: 5px;
}

.card:hover {
    transform: scale(1.03);
    /* Scale up on hover */
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    /* Increase shadow on hover */

}
</style>