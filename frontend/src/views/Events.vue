<template>
    <div class="container">
        <!-- Search Bar -->
        <div class="search-bar">
            <img src="/search.png" alt="Search Icon" class="search-icon" width="20px" />
            <input type="text" placeholder="Search for an event" />
        </div>

        <!-- Sort by -->
        <div class="sort-by d-flex align-items-center mt-3">
            <span class="sort-by-text me-3">Sort by:</span>

            <!-- Select filters -->
            <div class="custom-select" style="width:200px">
                <select>
                    <option value="Location" selected disabled>Location</option>
                </select>
            </div>
            <div class="custom-select" style="width:200px;">
                <select>
                    <option value="default" selected disabled>Pet Type</option>
                    <option value="dogs">Dogs</option>
                    <option value="cats">Cats</option>
                </select>
            </div>

            <div class="custom-select" style="width:200px;">
                <select>
                    <option value="default" selected disabled>Event Size</option>
                    <option value="less-10">&lt;10</option>
                    <option value="10-50">10-50</option>
                    <option value="50-100">50-100</option>
                    <option value="more-100">&gt;100</option>
                </select>
            </div>

            <!-- Date Range Picker -->
            <div class="custom-input">
                <input type="text" id="rangeDate" placeholder="Date Range" data-input>
            </div>
            <!-- Reset Filters -->
            <span class="reset-filters" @click="resetFilters">Reset Filters</span>
        </div>

        <!-- "Events Near You" -->
        <h1 class="title">Events Near You</h1>

        <!-- Events Owl Carousel -->
        <div class="eventscarousel owl-carousel owl-theme" style="width:1000px;">
            <div class="item" v-for="(event, index) in events" :key="index">
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
    </div>
</template>

<script>

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
            // Initialize Flatpickr for date range selection
            $("#rangeDate").flatpickr({
                mode: 'range',
                dateFormat: "Y-m-d",
                onChange: function (selectedDates) {
                    const rangeDateInput = document.getElementById('rangeDate');

                    // Change the background color if two dates are selected
                    if (selectedDates.length === 2) {
                        rangeDateInput.style.backgroundColor = '#C99F25'; // Set to desired color
                    } else {
                        rangeDateInput.style.backgroundColor = '#FFF3B3'; // Reset to default color
                    }
                }
            });
            // Dropdown colors
            var x, i, j, l, ll, selElmnt, a, b, c;
            x = document.getElementsByClassName("custom-select");
            l = x.length;

            for (i = 0; i < l; i++) {
                selElmnt = x[i].getElementsByTagName("select")[0];
                ll = selElmnt.length;

                // Create a new DIV for the selected item
                a = document.createElement("DIV");
                a.setAttribute("class", "select-selected");
                a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
                x[i].appendChild(a);

                // Create a new DIV for the option list
                b = document.createElement("DIV");
                b.setAttribute("class", "select-items select-hide");

                for (j = 1; j < ll; j++) {
                    c = document.createElement("DIV");
                    c.innerHTML = selElmnt.options[j].innerHTML;

                    c.addEventListener("click", function (e) {
                        var y, i, k, s, h, sl, yl;
                        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                        sl = s.length;
                        h = this.parentNode.previousSibling;

                        for (i = 0; i < sl; i++) {
                            if (s.options[i].innerHTML == this.innerHTML) {
                                s.selectedIndex = i;
                                h.innerHTML = this.innerHTML;

                                // Change the selected item background color to red
                                h.style.backgroundColor = '#C99F25';

                                y = this.parentNode.getElementsByClassName("same-as-selected");
                                yl = y.length;
                                for (k = 0; k < yl; k++) {
                                    y[k].removeAttribute("class");
                                }
                                this.setAttribute("class", "same-as-selected");
                                break;
                            }
                        }
                        h.click();
                    });

                    b.appendChild(c);
                }
                x[i].appendChild(b);

                a.addEventListener("click", function (e) {
                    e.stopPropagation();
                    closeAllSelect(this);
                    this.nextSibling.classList.toggle("select-hide");
                    this.classList.toggle("select-arrow-active");
                });
            }

            function closeAllSelect(elmnt) {
                var x, y, i, xl, yl, arrNo = [];
                x = document.getElementsByClassName("select-items");
                y = document.getElementsByClassName("select-selected");
                xl = x.length;
                yl = y.length;

                for (i = 0; i < yl; i++) {
                    if (elmnt == y[i]) {
                        arrNo.push(i);
                    } else {
                        y[i].classList.remove("select-arrow-active");
                    }
                }
                for (i = 0; i < xl; i++) {
                    if (arrNo.indexOf(i)) {
                        x[i].classList.add("select-hide");
                    }
                }
            }


            // Close all select boxes if the user clicks outside
            document.addEventListener("click", closeAllSelect);

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
/* Custom styles */

#rangeDate {
    margin-right: 7px;
    position: relative;
    font-family: Arial;
    /* border: 1px solid #C99F25; */
    /* Border color */
    border-radius: 9px;
    /* Border radius */
    background-color: #FFF3B3;
    /* Fill color */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    color: black;
    padding: 8px 16px;
}

#rangeDate[type="text"]::placeholder {
    color: black;
    /* Change this to your desired color */
    opacity: 1;
    /* Ensure the opacity is set to 1 for visibility */
}


.custom-select {
    margin-right: 7px;
    position: relative;
    font-family: Arial;
    /* border: 1px solid #C99F25; */
    /* Border color */
    border-radius: 9px;
    /* Border radius */
    background-color: #FFF3B3;
    /* Fill color */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    /* Drop shadow */
}

/* Hide the original SELECT element: */
.custom-select select {
    display: none;
}

.select-selected {
    background-color: #FFF3B3;
    /* Background color */
}

.select-selected:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

#rangeDate:hover {
    background-color: #e8dca4;
    /* Match to .select-selected hover */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* Style the arrow inside the select element: */
.select-selected:after {
    position: absolute;
    content: "";
    top: 17px;
    right: 10px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-color: black transparent transparent transparent;
    /* Arrow color */
}

/* Point the arrow upwards when the select box is open (active): */
.select-selected.select-arrow-active:after {
    border-color: transparent transparent #fff transparent;
    top: 7px;
}

/* Style the items (options), including the selected item: */
.select-items div,
.select-selected {
    color: black;
    padding: 8px 16px;
    /* border: 1px solid transparent; */
    border-color: transparent transparent rgba(0, 0, 0, 0.1) transparent;
    cursor: pointer;
    border-radius: 9px;
}

/* Style items (options): */
.select-items {
    position: absolute;
    border-radius: 9px;
    background-color: #FFF3B3;
    /* Background color */
    top: 100%;
    left: 0;
    right: 0;
    z-index: 99;
}

/* Hide the items when the select box is closed: */
.select-hide {
    display: none;
}

.select-items div:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.card:hover {
    transform: scale(1.03);
    /* Scale up on hover */
    overflow: visible;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    /* Increase shadow on hover */
}

.custom-select::after {
    background-color: #C99F25;
    margin-right: 13px;
    padding: 10px 15px;
    padding-left: 5px;
    border-radius: 9px;
    text-align: left;
}

.container {
    padding-left: 250px;
    padding-top: 30px;
}

/* Search Bar */
.search-bar {
    position: relative;
}

.search-bar input {
    padding: 12px 20px 12px 40px;
    border: 2px solid #C99F25;
    border-radius: 20px;
    width: 400px;
    font-size: 16px;
    outline: none;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Rubik', sans-serif;
}

/* Placeholder Styling */
.search-bar input::placeholder {
    color: #777;
    font-size: 16px;
    font-family: 'Rubik', sans-serif;
}

/* Positioning the search icon inside the search bar */
.search-bar .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #C99F25;
}

.sort-by {
    margin-top: 20px;
}

.sort-by-text {
    font-size: 14px;
    font-family: 'Rubik', sans-serif;
}


.reset-filters {
    color: #C99F25;
    font-size: 14px;
    margin-left: 10px;
    cursor: pointer;
    font-family: 'Rubik', sans-serif;
    font-weight: bold;
}

.title {
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-size: 30px;
    font-weight: bold;
    margin-top: 40px;
}

/* Carousel and Card Styles */
.card {
    border: none;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.5s ease, box-shadow 0.3s ease;
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