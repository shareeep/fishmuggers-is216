<template>
    <div class="carousel">
        <h1 class="title">Events Near You</h1>

        <!-- Vertical Cards for Small Screens (1 Column) -->
        <div class="flex flex-col md:hidden">
            <div v-for="(event, index) in nearyouevents" :key="index" class="mb-4 mx-auto">
                <router-link :to="{ name: 'eventDetail', params: { id: event.id } }">
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

        <!-- Carousel for Medium Screens (1 Item) -->
        <div class="hidden md:block lg:hidden">
            <Carousel :itemsToShow="1" :wrapAround="true" :transition="500" class="mx-auto" style="width:600px;">
                <Slide v-for="(event, index) in nearyouevents" :key="index">
                    <router-link :to="{ name: 'eventDetail', params: { id: event.id } }">
                        <div class="carousel__item mx-1 lg:mx-2">
                            <div class="card">
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
                        </div>
                    </router-link>
                </Slide>
                <template #addons>
                    <Navigation />
                    <Pagination />
                </template>
            </Carousel>
        </div>

        <div class="hidden lg:block">
            <Carousel :itemsToShow="3" :wrapAround="true" :transition="500" :partialVisible="false">
                <Slide v-for="(event, index) in nearyouevents" :key="index">
                    <router-link :to="{ name: 'eventDetail', params: { id: event.id } }">
                        <div class="carousel__item">
                            <div class="card">
                                <img :src="event.image" alt="Event Image">
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
                        </div>
                    </router-link>
                </Slide>
                <template #addons>
                    <Navigation />
                    <Pagination />
                </template>
            </Carousel>
        </div>

        <h1 class="title">Trending</h1>
        <!-- Vertical Cards for Small Screens (1 Column) -->
        <div class="flex flex-col md:hidden">
            <div v-for="(event, index) in trending" :key="index" class="mb-4 mx-auto">
                <router-link :to="{ name: 'eventDetail', params: { id: event.id } }">
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

        <!-- Carousel for Medium Screens (1 Item) -->
        <div class="hidden md:block lg:hidden">
            <Carousel :itemsToShow="1" :wrapAround="true" :transition="500" class="mx-auto" style="width:600px;">
                <Slide v-for="(event, index) in trending" :key="index">
                    <router-link :to="{ name: 'eventDetail', params: { id: event.id } }">
                        <div class="carousel__item mx-1 lg:mx-2">
                            <div class="card">
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
                        </div>
                    </router-link>
                </Slide>
                <template #addons>
                    <Navigation />
                    <Pagination />
                </template>
            </Carousel>
        </div>

        <div class="hidden lg:block">
            <Carousel :itemsToShow="3" :wrapAround="true" :transition="500" :partialVisible="false">
                <Slide v-for="(event, index) in trending" :key="index">
                    <router-link :to="{ name: 'eventDetail', params: { id: event.id } }">
                        <div class="carousel__item">
                            <div class="card">
                                <img :src="event.image" alt="Event Image">
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
                        </div>
                    </router-link>
                </Slide>
                <template #addons>
                    <Navigation />
                    <Pagination />
                </template>
            </Carousel>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

export default defineComponent({
    name: 'EventCarousel',
    components: {
        Carousel,
        Navigation,
        Pagination,
        Slide,
    },
    data() {
        return {
            nearyouevents: [
                {
                    id: 1,
                    title: "Near You Event 1",
                    image: "https://via.placeholder.com/300x150",
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
                    date: "2024-10-24",
                    year: '2024',
                    month: 'OCT',
                    time: "1:00pm - 3:00pm",
                    address: "123 Sample St, Sample City, ST 12345",
                    slots: 3,
                    numinterested: 5,
                },
                {
                    id: 2,
                    title: "Near You Event 2",
                    image: "https://via.placeholder.com/300x150",
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
                    date: "2024-10-24",
                    year: '2024',
                    month: 'OCT',
                    time: "1:00pm - 3:00pm",
                    address: "123 Sample St, Sample City, ST 12345",
                    slots: 3,
                    numinterested: 5,
                },
                {
                    id: 3,
                    title: "Near You Event 3",
                    image: "https://via.placeholder.com/300x150",
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
                    date: "2024-10-24",
                    year: '2024',
                    month: 'OCT',
                    time: "1:00pm - 3:00pm",
                    address: "123 Sample St, Sample City, ST 12345",
                    slots: 3,
                    numinterested: 5,
                },
                {
                    id: 4,
                    title: "Near You Event 4",
                    image: "https://via.placeholder.com/300x150",
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
                    date: "2024-10-24",
                    year: '2024',
                    month: 'OCT',
                    time: "1:00pm - 3:00pm",
                    address: "123 Sample St, Sample City, ST 12345",
                    slots: 3,
                    numinterested: 5,
                }
            ],
            trending: [
                {
                    id: 5,
                    title: "Trending Event 5",
                    image: "https://via.placeholder.com/300x150",
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
                    date: "2024-10-24",
                    year: '2024',
                    month: 'OCT',
                    time: "1:00pm - 3:00pm",
                    address: "123 Sample St, Sample City, ST 12345",
                    slots: 3,
                    numinterested: 5,
                },
                {
                    id: 6,
                    title: "Trending Event 6",
                    image: "https://via.placeholder.com/300x150",
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
                    date: "2024-10-24",
                    year: '2024',
                    month: 'OCT',
                    time: "1:00pm - 3:00pm",
                    address: "123 Sample St, Sample City, ST 12345",
                    slots: 3,
                    numinterested: 5,
                },
                {
                    id: 7,
                    title: "Trending Event 7",
                    image: "https://via.placeholder.com/300x150",
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
                    date: "2024-10-24",
                    year: '2024',
                    month: 'OCT',
                    time: "1:00pm - 3:00pm",
                    address: "123 Sample St, Sample City, ST 12345",
                    slots: 3,
                    numinterested: 5,
                },
                {
                    id: 8,
                    title: "Trending Event 8",
                    image: "https://via.placeholder.com/300x150",
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
                    date: "2024-10-24",
                    year: '2024',
                    month: 'OCT',
                    time: "1:00pm - 3:00pm",
                    address: "123 Sample St, Sample City, ST 12345",
                    slots: 3,
                    numinterested: 5,
                },
            ]
        };
    },
});
</script>
<style scoped>
/* ARROW STYLES */
.carousel__prev,
.carousel__next {
    box-sizing: content-box;
    background: transparent;
    /* Make the default background transparent */
    border-radius: var(--vc-nav-border-radius);
    width: var(--vc-nav-width);
    height: var(--vc-nav-height);
    text-align: center;
    font-size: var(--vc-nav-height);
    padding: 0;
    color: var(--vc-nav-color);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    border: 0;
    cursor: pointer;
    margin: 0 10px;
    top: 50%;
    transform: translateY(-50%);
    transition: color 0.3s ease
}

.carousel__prev:hover,
.carousel__next:hover {
    color: white;
    /* Change arrow color on hover */
    background-color: #FFF3B3;
    /* Circle color when hovering */
    border-radius: 50%;
    /* Make it a circle */
    width: 60px;
    /* Slightly increase the width to accommodate the circle */
    height: 60px;
    /* Slightly increase the height to accommodate the circle */
    padding: 0;
    /* Reset padding to fit the new size */
}

.carousel__next--disabled,
.carousel__prev--disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.carousel__prev {
    left: 0;
}

.carousel__next {
    right: 0;
}

.carousel--rtl .carousel__prev {
    left: auto;
    right: 0;
}

.carousel--rtl .carousel__next {
    right: auto;
    left: 0;
}



/* PAGINATION STYLES */
.carousel {
    --vc-pgn-margin: 5px;
    /* Adjust margin as needed */
    --vc-pgn-width: 15px;
    /* Width of the pagination dots */
    --vc-pgn-height: 15px;
    /* Height of the pagination dots */
    --vc-pgn-border-radius: 50%;
    /* Rounded pagination dots */
    --vc-pgn-background-color: white;
    /* Default background color */
    --vc-pgn-active-color: gold;
    /* Active pagination dot color */
}

.carousel__pagination {
    display: flex;
    justify-content: center;
    list-style: none;
    line-height: 0;
    margin: 10px 0 0;
    padding: 0;
}

.carousel__pagination-button {
    display: block;
    border: 0;
    margin: 0;
    cursor: pointer;
    padding: var(--vc-pgn-margin);
    background: transparent;
}

.carousel__pagination-button::after {
    display: block;
    content: '';
    width: var(--vc-pgn-width);
    height: var(--vc-pgn-height);
    border-radius: var(--vc-pgn-border-radius);
    background-color: var(--vc-pgn-background-color);
    /* Use your custom color */
}

.carousel__pagination-button--active::after {
    background-color: gold;
    /* Use your custom active color */
}

@media(hover: hover) {
    .carousel__pagination-button:hover::after {
        background-color: gold;
        /* Hover effect */
    }
}

/* * {
    box-sizing: border-box;
} */

.title {
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-size: 30px;
    font-weight: bold;
    margin-top: 40px;
    color: black;
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

/* CAROUSEL */

.carousel {
    padding: 0;
    width: 1200px;
    color: #2c3e50;
    overflow: hidden;
}

.carousel__item {
    margin: 0 5px;
    /* Consistent horizontal spacing */
    flex: 0 0 280px;
    /* Make sure items take equal width */
    max-width: 400px;
    /* Ensure items do not exceed this width */
}

.carousel__slide {
    padding: 25px 5px;
}

.carousel__viewport {
    perspective: 2000px;
}

.carousel__track {
    transform-style: preserve-3d;
}

.carousel__slide--sliding {
    transition: transform 0.5s ease, opacity 1.0s ease;
}

.carousel__slide {
    opacity: 0.9;
    transform: scale(0.9);
}

.carousel__slide--active~.carousel__slide {
    transform: scale(0.9);

}

.carousel__slide--prev {
    opacity: 1;
    transform: scale(0.95);

}

.carousel__slide--next {
    opacity: 1;
    transform: scale(0.95);

}

.carousel__slide--active {
    opacity: 1;
    transform: scale(1.1);

}
</style>