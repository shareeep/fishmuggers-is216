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
                <input type="text" id="rangeDate" placeholder="Date Range" data-input>
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
        });
    }
};
</script>


<style>
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
</style>
