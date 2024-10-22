<template>
  <div class="calendar-container">
    <div class="side-panel">
      <div class="calendar-img">
        <img src="../../assets/images/sus_cat_calendar.png" alt="">
      </div>
      <div class="current-day">
        <h2>{{ currentDay }}</h2>
        <h3>{{ currentDate }}</h3>
      </div>
      <hr>
      <div class="filters">
        <h3>Filter Events</h3>

        <!-- Pet Type Filter -->
        <div class="pet-type">
          <h4>Pet Type</h4>
          <div>
            <label>
              <input type="checkbox" value="Dog" v-model="selectedPetTypes" />
              Dog
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" value="Cat" v-model="selectedPetTypes" />
              Cat
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" value="Hamster" v-model="selectedPetTypes" />
              Hamster
            </label>
          </div>
        </div>

        <!-- Event Size Filter -->
        <div class="event-size">
          <h4>Event Size</h4>
          <div>
            <label>
              <input type="checkbox" value="Small" v-model="selectedEventSizes" />
              Small
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" value="Large" v-model="selectedEventSizes" />
              Large
            </label>
          </div>
        </div>

        <!-- Location Filter -->
        <div class="location">
          <h4>Location</h4>
          <div>
            <label>
              <input type="checkbox" value="Central Park" v-model="selectedLocations" />
              Central Park
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" value="City Hall" v-model="selectedLocations" />
              City Hall
            </label>
          </div>
        </div>
        
        <!-- Display selected filters -->
        <div class="filter-display">
          <p>{{ selectedPetTypes }}</p>
          <p>{{ selectedEventSizes }}</p>
          <p>{{ selectedLocations }}</p>
        </div>
        
      </div>

    </div>
    <div class="calendar">
      <div class="calendar-header">
        <button @click="prevMonth">Prev</button>
        <h1>{{ currentMonth }}</h1>
        <button @click="nextMonth">Next</button>
      </div>
      <table>
        <tr>
          <th v-for="day in days" :key="day">{{ day }}</th>
        </tr>
        <tr v-for="(week, index) in calendar" :key="index">
          <td
            v-for="date in week"
            :key="date.date"
            :class="{
              'event-date': isEventDate(date.date, date.isCurrentMonth),
              'current-date': isCurrentDate(date.date, date.isCurrentMonth),
              'clickable-date': true,
              'current-month': date.isCurrentMonth,
              'other-month': !date.isCurrentMonth,
            }"
            @click="showEventDetails(date.date, date.isCurrentMonth)"
          >
            {{ date.date }}
          </td>
        </tr>
      </table>
      <EventPopup v-if="showPopup" :event="selectedEvent" @close="showPopup = false" />
    </div>
  </div>
</template>

<script>
import EventPopup from './Events/EventPopup.vue';

export default {
  data() {
  return {
    events: [
      { EventId: "1", UserId: "123", Title: "Dog Walking", Description: "Walk the dog in the park", EventDate: "2024-10-13", Location: "Central Park", PetType: "Dog", EventSize: "Small" },
      { EventId: "2", UserId: "124", Title: "Pet Adoption Fair", Description: "Adoption event for pets", EventDate: "2024-10-20", Location: "City Hall", PetType: "Cat", EventSize: "Large" },
      // Add more events as needed
    ],
    selectedEvent: null,
    showPopup: false,
    currentYear: new Date().getFullYear(),
    currentMonthIndex: new Date().getMonth(),
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    today: new Date().getDate(),
    todayMonth: new Date().getMonth(),
    todayYear: new Date().getFullYear(),
    selectedPetTypes: [],
    selectedEventSizes: [],
    selectedLocations: [],
  };
},
computed: {
  currentMonth() {
    return new Date(this.currentYear, this.currentMonthIndex).toLocaleString('default', { month: 'long', year: 'numeric' });
  },
  currentDay() {
    return new Date().toLocaleDateString('default', { weekday: 'long' });
  },
  currentDate() {
    return new Date().toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' });
  },
  calendar() {
    const startDate = new Date(this.currentYear, this.currentMonthIndex, 1);
    const endDate = new Date(this.currentYear, this.currentMonthIndex + 1, 0);
    const daysInMonth = endDate.getDate();

    const calendar = [];
    let week = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < startDate.getDay(); i++) {
      const prevMonthDate = new Date(startDate);
      prevMonthDate.setDate(startDate.getDate() - (startDate.getDay() - i));
      week.push({ date: prevMonthDate.getDate(), isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ date: day, isCurrentMonth: true });

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    let dayCounter = 1;
    while (week.length < 7) {
      week.push({ date: dayCounter++, isCurrentMonth: false });
    }
    if (week.length > 0) {
      calendar.push(week);
    }

    if (calendar[calendar.length - 1].every(day => !day.isCurrentMonth)) {
      calendar.pop();
    }

    return calendar;
  },
  filteredEvents() {
    return this.events.filter(event => {
      return (this.selectedPetTypes.length === 0 || this.selectedPetTypes.includes(event.PetType)) &&
             (this.selectedEventSizes.length === 0 || this.selectedEventSizes.includes(event.EventSize)) &&
             (this.selectedLocations.length === 0 || this.selectedLocations.includes(event.Location));
    });
  },
  eventDates() {
    return this.filteredEvents.map(event => event.EventDate);
  },
},
methods: {
  isEventDate(date, isCurrentMonth) {
    if (!isCurrentMonth) return false;
    const formattedDate = `${this.currentYear}-${String(this.currentMonthIndex + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return this.eventDates.includes(formattedDate);
  },
  isCurrentDate(date, isCurrentMonth) {
    return isCurrentMonth && this.currentYear === this.todayYear && this.currentMonthIndex === this.todayMonth && date === this.today;
  },
  showEventDetails(date, isCurrentMonth) {
    if (!isCurrentMonth) return;
    const formattedDate = `${this.currentYear}-${String(this.currentMonthIndex + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    const event = this.filteredEvents.find(event => event.EventDate === formattedDate);
    if (event) {
      this.selectedEvent = event;
      this.showPopup = true;
    }
  },
  prevMonth() {
    if (this.currentMonthIndex === 0) {
      this.currentMonthIndex = 11;
      this.currentYear--;
    } else {
      this.currentMonthIndex--;
    }
  },
  nextMonth() {
    if (this.currentMonthIndex === 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    } else {
      this.currentMonthIndex++;
    }
  },
},
components: {
  EventPopup,
},

};
</script>

<style scoped>
.calendar-container {
  display: flex;
  width: 100%;
  max-width: 70vw;
  margin: auto;
  height: 80vh;
  margin-top: 5vh;
  border: solid 4px #c8c7c7;
  border-radius: 12px;
  overflow: hidden;
}
/* sidepanel */
.side-panel {
  width: 25%;
  height: 100%;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}
.calendar-img {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5%;
  padding-bottom: 0px;
  width: 75%;
  border-radius: 50%;
  margin: 0 auto; /* Center the container horizontally */

}
.calendar-img img {
  /* width: 90%; */
  height: auto ;
  display: block;
  border-radius: 50%;
}
.current-day{
  text-align: center;
}
.current-day h2{
  font-size: 28px;

  font-weight: bolder;
  font-family: 'Arial Rounded MT';
}
.current-day h3{
  font-size: 20px;
  /* text-align: center; */
  font-weight: bolder;
  font-family: 'Arial Rounded MT';
  color:#414141bf;
}
.side-panel hr{
  border: 1px solid #c8c7c7;
}
.filters {
  /* padding-left: 8%; */
}
.filters h3{
  font-family: 'Arial Rounded MT';
  font-weight: bolder;
  font-size: 20px;
  padding-left: 4%;
}
.filters .pet-type, .event-size, .location{
  padding-left: 8%;
}
.filters .filter-display{
  padding-left: 4%;
}
input[type="checkbox"]:focus {
  outline: none; /* Ensure the outline remains removed on focus */
  box-shadow: none; /* Customize the focus style */
}

/* calendar */
.calendar {
  flex: 1;
  border-left: 4px solid #c8c7c7;
  
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: lightgray;
  color: #000;
  padding: 10px 20px;
  /* border-radius: 0px 12px 0 0;
  border: 3px solid #c8c7c7;
  border-bottom: 0px; */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 30%;
  background-image: url(../../assets/images/pet_calendar.avif);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center bottom;
  border-bottom: 4px solid #c8c7c7;
}
.calendar-header h1 {
  font-size: 48px;
  font-weight: bolder;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  color: black;
  text-shadow: 6px 6px 6px white;
}
.calendar-header button {
  background-color: #48434B;
  color: white;
  border: none;
  padding: 8px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.calendar-header button:hover {
  background-color: #89848c;
}
table {
  width: 100%;
  background-color: white;
  height: 70%;
  border-collapse: separate;
  border-spacing: 4px;
}
th {
  background-color: #ffd700;
  border: 1.5px solid black;
  border-radius: 12px;
  padding: 6px;
  padding-bottom: 3px;
  font-size: x-large;
  /* text-decoration: underline; */
  font-family: "Arial Rounded MT";
  min-width: 50px;
  max-width: 50px;
  text-align: center;
}

td {
  /* background-color: rgba(255, 192, 203, 0.429); */
  background-color: #FCEFB4;
  border-radius: 12px;
  border: 1px solid black;
  padding: 6px;
  text-align: center; 
}
.event-date {
  /* background-color: rgba(21, 86, 239, 0.2); */
  background-color: rgba(234, 148, 0, 0.559);
  color: #000;
  cursor: pointer;
}
.current-date {
  font-weight: bolder;
  text-decoration: underline;
}
.clickable-date:hover {
  cursor: pointer;
  /* background-color: rgb(126, 165, 255); */
  background-color: #b97200e7;
  color: white;
  /* border: 2px solid #7b61ff; */
}
.current-month {
  color: #000;
}
.other-month {
  color: #bdbdbd;
}
</style>
