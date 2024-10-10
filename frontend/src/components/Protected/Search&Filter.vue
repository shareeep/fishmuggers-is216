<template>
    <div class="search_filter">
        <!-- Search Bar -->
        <div class="search-bar">
            <img src="../../assets/images/search.png" alt="Search Icon" class="search-icon" width="20px" />
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
                <input type="text" id="rangeDate" placeholder="Date Range" data-input />
            </div>
            <!-- Reset Filters -->
            <span class="reset-filters" @click="resetFilters">Reset Filters</span>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        resetFilters() {
            const customSelects = this.$el.getElementsByClassName("custom-select");

            for (let i = 0; i < customSelects.length; i++) {
                const selectElement = customSelects[i].getElementsByTagName("select")[0];
                selectElement.selectedIndex = 0; // Reset to the first option (default)

                // Update the displayed text of the custom select
                const selectedDiv = customSelects[i].getElementsByClassName("select-selected")[0];
                selectedDiv.innerHTML = selectElement.options[selectElement.selectedIndex].innerHTML;

                // Reset background color to default
                selectedDiv.style.backgroundColor = '#FFF3B3';

                // Ensure hover class is maintained
                selectedDiv.classList.remove("same-as-selected"); // Remove hover effect only if needed, keep it for hover state
                selectedDiv.classList.add("select-selected"); // Always keep this class for hover effect
            }

            const rangeDateInput = document.getElementById('rangeDate');
            rangeDateInput.value = ""; // Clear the input value
            rangeDateInput.placeholder = "Date Range"; // Set placeholder text
            rangeDateInput.style.backgroundColor = '#FFF3B3'; // Reset background color
        }


    },
    mounted() {
        // Add Bootstrap and Flatpickr scripts

        $(document).ready(() => {
            // Initialize Flatpickr for date range selection
            $("#rangeDate").flatpickr({
                mode: 'range',
                dateFormat: "Y-m-d",
                onChange: (selectedDates) => {
                    const rangeDateInput = document.getElementById('rangeDate');

                    // Change the background color if two dates are selected
                    rangeDateInput.style.backgroundColor = selectedDates.length === 2 ? 'goldenrod' : '#FFF3B3';
                }
            });

            // Initialize custom select dropdown
            var customSelects = document.getElementsByClassName("custom-select");
            Array.from(customSelects).forEach(select => {
                const selectElement = select.getElementsByTagName("select")[0];
                const selectedDiv = document.createElement("DIV");
                selectedDiv.setAttribute("class", "select-selected");
                selectedDiv.innerHTML = selectElement.options[selectElement.selectedIndex].innerHTML;
                select.appendChild(selectedDiv);

                const optionsDiv = document.createElement("DIV");
                optionsDiv.setAttribute("class", "select-items select-hide");

                for (let j = 1; j < selectElement.length; j++) {
                    const optionDiv = document.createElement("DIV");
                    optionDiv.innerHTML = selectElement.options[j].innerHTML;

                    optionDiv.addEventListener("click", function () {
                        selectElement.selectedIndex = j;
                        selectedDiv.innerHTML = this.innerHTML;
                        selectedDiv.style.backgroundColor = 'goldenrod'; // Set selected background color

                        Array.from(optionsDiv.getElementsByClassName("same-as-selected")).forEach(item => {
                            item.classList.remove("same-as-selected");
                        });
                        this.classList.add("same-as-selected");
                        selectedDiv.click(); // Close the options
                    });

                    optionsDiv.appendChild(optionDiv);
                }

                select.appendChild(optionsDiv);

                selectedDiv.addEventListener("click", function (e) {
                    e.stopPropagation();
                    closeAllSelect(this);
                    optionsDiv.classList.toggle("select-hide");
                    this.classList.toggle("select-arrow-active");
                });
            });

            function closeAllSelect(elmnt) {
                var items = document.getElementsByClassName("select-items");
                var selecteds = document.getElementsByClassName("select-selected");
                for (let i = 0; i < selecteds.length; i++) {
                    if (elmnt !== selecteds[i]) {
                        selecteds[i].classList.remove("select-arrow-active");
                    }
                }
                for (let i = 0; i < items.length; i++) {
                    items[i].classList.add("select-hide");
                }
            }
            // Close all select boxes if the user clicks outside
            document.addEventListener("click", closeAllSelect);
        });
    }
};
</script>

<style>

#rangeDate {
    margin-right: 7px;
    position: relative;
    font-family: Arial;
    border-radius: 9px;
    background-color: #FFF3B3;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    color: black;
    padding: 8px 16px;
}

#rangeDate[type="text"]::placeholder {
    color: black;
    opacity: 1;
}

.custom-select {
    margin-right: 7px;
    position: relative;
    font-family: 'Poppins', sans-serif;
    border-radius: 9px;
    background-color: #FFF3B3;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.custom-select select {
    display: none;
    /* Hide the original SELECT element */
}

.select-selected {
    background-color: #FFF3B3;
}

.select-selected:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

#rangeDate:hover {
    background-color: #e8dca4;
}

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

.select-selected.select-arrow-active:after {
    border-color: transparent transparent #fff transparent;
    /* Arrow color when active */
    top: 7px;
}

.select-items div,
.select-selected {
    color: black;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 9px;
}

.select-items {
    position: absolute;
    border-radius: 9px;
    background-color: #FFF3B3;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 99;
}

.select-hide {
    display: none;
}

.select-items div:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

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

.search-bar input::placeholder {
    color: #777;
    font-size: 16px;
    font-family: 'Rubik', sans-serif;
}

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
    font-size: 18px;
    font-weight: 600;
    color: #C99F25;
}

.reset-filters {
    color: #C99F25;
    cursor: pointer;
    font-weight: 600;
    margin-left: 10px;
}

.reset-filters:hover {
    color: #a1883d;
}
</style>
