<template>
    <div class="carousel">
        <!-- "Events Near You" -->
        <h1 class="title">Events Near You</h1>

        <!-- Events Owl Carousel -->
        <div class="eventscarousel owl-carousel owl-theme" style="width:1000px;">
            <div class="item" v-for="(event, index) in events" :key="index">
                <router-link to="/eventdetail">
                    <div class="card">
                        <img :src="event.image" alt="Event Image">
                        <div class="card-body">
                            <div class="card-left">
                                <div class="date">{{ event.date }}</div>
                                <div class="date-month">{{ event.year }}</div>
                            </div>
                            <div class="card-right">
                                <div class="event-title">{{ event.title }}</div>
                                <div class="event-subtitle">{{ event.time }}</div>
                                <div class="event-subtitle"><i class="fas fa-star star-icon"></i> {{ event.interested }}
                                    Interested</div>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>

    <!-- "Trending" -->
    <h1 class="title">Trending</h1>

    <!-- Trending Owl Carousel -->
    <div class="owl-carousel owl-theme trending-carousel" style="width:1000px;">
        <div class="item" v-for="(event, index) in trending" :key="index">
            <div class="card">
                <img :src="event.image" alt="Trending Image">
                <div class="card-body">
                    <div class="card-left">
                        <div class="date">{{ event.date }}</div>
                        <div class="date-month">{{ event.year }}</div>
                    </div>
                    <div class="card-right">
                        <div class="event-title">{{ event.title }}</div>
                        <div class="event-subtitle">{{ event.time }}</div>
                        <div class="event-subtitle"><i class="fas fa-star star-icon"></i> {{ event.interested }}
                            Interested</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>


<script>
import { useRouter } from 'vue-router'; // Import useRouter

export default {
    data() {
        return {
            dateRange: [],
            events: [
                { image: "https://via.placeholder.com/300x150", date: "DEC", year: "2022", title: "Event Title 1", time: "1:00pm - 3:00pm", interested: 5 },
                { image: "https://via.placeholder.com/300x150", date: "DEC", year: "2022", title: "Event Title 2", time: "1:00pm - 3:00pm", interested: 5 },
                { image: "https://via.placeholder.com/300x150", date: "DEC", year: "2022", title: "Event Title 3", time: "1:00pm - 3:00pm", interested: 5 },
                { image: "https://via.placeholder.com/300x150", date: "DEC", year: "2022", title: "Event Title 4", time: "1:00pm - 3:00pm", interested: 5 },
            ],
            trending: [
                { image: "https://via.placeholder.com/300x150", date: "JAN", year: "2023", title: "Trending Event 1", time: "10:00am - 12:00pm", interested: 10 },
                { image: "https://via.placeholder.com/300x150", date: "JAN", year: "2023", title: "Trending Event 2", time: "10:00am - 12:00pm", interested: 10 },
                { image: "https://via.placeholder.com/300x150", date: "JAN", year: "2023", title: "Trending Event 3", time: "10:00am - 12:00pm", interested: 10 },
                { image: "https://via.placeholder.com/300x150", date: "JAN", year: "2023", title: "Trending Event 4", time: "10:00am - 12:00pm", interested: 10 },
            ]
        };
    },
    methods: {
        goToEvent(eventTitle) {
            const router = useRouter(); // Get the router instance
            router.push({ name: 'eventDetail', params: { title: eventTitle } }); // Navigate to the event detail page
        },
        resetFilters() {
            // Reset each custom select to the first option
            const customSelects = this.$el.getElementsByClassName("custom-select");

            for (let i = 0; i < customSelects.length; i++) {
                const selectElement = customSelects[i].getElementsByTagName("select")[0];
                selectElement.selectedIndex = 0; // Reset to the first option (default)

                // Update the displayed text of the custom select
                const selectedDiv = customSelects[i].getElementsByClassName("select-selected")[0];
                selectedDiv.innerHTML = selectElement.options[selectElement.selectedIndex].innerHTML;

                // Reset background color to default
                // Reset class to default
                selectedDiv.style.backgroundColor = '#FFF3B3';
            }

            const rangeDateInput = document.getElementById('rangeDate');
            rangeDateInput.value = ""; // Clear the input value
            rangeDateInput.placeholder = "Date Range"; // Set placeholder text
            rangeDateInput.style.backgroundColor = '#FFF3B3'; // Reset background color
        }


    },
    mounted() {
        $(document).ready(function () {
            // Initialize main events carousel
            const $eventsCarousel = $('.eventscarousel').owlCarousel({
                center: true,
                items: 3,
                loop: true,
                margin: 20,
                nav: true,
                dots: true,
                dotsEach: true,
                navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 3
                    }
                },
                animateOut: 'fadeOut',
                animateIn: 'fadeIn',
                autoplay: false,
                autoplayHoverPause: false,
                smartSpeed: 450,
            });

            // Initialize trending events carousel
            const $trendingCarousel = $('.trending-carousel').owlCarousel({
                center: true,
                items: 3,
                loop: true,
                margin: 20,
                nav: true,
                navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 3
                    }
                },
                animateOut: 'fadeOut',
                animateIn: 'fadeIn',
                autoplay: false,
                autoplayHoverPause: false,
                smartSpeed: 450,
            });


        });
    }
};
</script>

<style>
.carousel {
    overflow: hidden;
    /* Prevents overflow */
}


.title {
    font-family: 'Montserrat', sans-serif;
    font-size: 30px;
    font-weight: bold;
    margin-top: 40px;
    margin-bottom: 10px;
}

/* Carousel and Card Styles */
.card {
    height: 100%;
    border: none;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.5s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: scale(1.03);
    /* Scale up on hover */
    overflow: visible;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    /* Increase shadow on hover */
}

.card img {
    width: 100%;
    height: auto;
}

.card-body {
    display: flex;
    padding: 20px;
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
    color: #C99F25;
    margin-right: 5px;
}

.owl-nav {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    /* Space between left and right buttons */
    padding: 0 10px;
    /* Optional: padding to adjust distance from edges */
}

.owl-nav .owl-prev {
    left: -60px;
    /* Move left button outside */
}

.owl-nav .owl-next {
    right: -60px;
    /* Move right button outside */
}

.owl-nav button {
    color: black !important;
    width: 50px;
    /* Button width */
    height: 50px;
    /* Button height */
    background-color: #C99F25;
    /* Button color */
    border: none;
    /* Remove border */
    border-radius: 50% !important;
    /* Make it circular */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, transform 0.3s ease;
    /* Smooth transitions */
    cursor: pointer;
    /* Change cursor to pointer */
}

.owl-nav button:hover {
    background-color: #C99F25 !important;
    /* Change color on hover */
    transform: scale(1.1);
    /* Slightly enlarge on hover */
}

.owl-nav button i {
    font-size: 50px !important;
    /* Icon size */
    color: white;
    /* Icon color */
}
</style>