<template>
  <div class="calendar-container">
    <div class="side-panel">
      <div class="calendar-img">
        <img src="../../../assets/images/sus_cat_calendar.png" alt="" />
      </div>
      <div class="current-day">
        <h2>{{ currentDay }}</h2>
        <h3>{{ currentDate }}</h3>
      </div>
      <hr />
      <div class="filters">
        <h3>Filter Events</h3>

        <!-- Pet Type Filter -->
        <div class="pet-type">
          <h4>Pet Type</h4>
          <select v-model="selectedPetType">
            <option value="">All</option>
            <option v-for="type in uniquePetTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>

        <!-- Event Size Filter -->
        <div class="event-size">
          <h4>Event Size</h4>
          <select v-model="selectedEventSize">
            <option value="">All</option>
            <option v-for="size in uniqueEventSizes" :key="size" :value="size">{{ size }}</option>
          </select>
        </div>

        <!-- Location Filter -->
        <div class="location">
          <h4>Location</h4>
          <select v-model="selectedLocation">
            <option value="">All</option>
            <option v-for="location in uniqueLocations" :key="location" :value="location">{{ location }}</option>
          </select>
        </div>

        <!-- Date Range Filter -->
        <div class="date-range">
          <h4>Date Range</h4>
          <label for="start-date">From:</label>
          <input id="start-date" type="date" v-model="startDate" />

          <label for="end-date">To:</label>
          <input id="end-date" type="date" v-model="endDate" />
        </div>
      </div>
      <button class="add-event-button" @click="showAddEventPopup = true">Add Custom Event</button>
    </div>

    <div class="calendar">
      <div class="calendar-header">
        <button @click="prevMonth">Prev</button>
        <h1>{{ currentMonth }}</h1>
        <button @click="nextMonth">Next</button>
      </div>
      <table>
        <thead>
          <tr>
            <th v-for="day in days" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index) in calendar" :key="index">
            <td
              v-for="date in week"
              :key="date.date"
              :class="{
                'event-date': isEventDate(date.date, date.isCurrentMonth),
                'current-date': isCurrentDate(date.date, date.isCurrentMonth),
                'clickable-date': true,
                'current-month': date.isCurrentMonth,
                'other-month': !date.isCurrentMonth
              }"
              @click="showEventDetails(date.date, date.isCurrentMonth)"
            >
              {{ date.date }}
            </td>
          </tr>
        </tbody>
      </table>

      <EventPopup v-if="showPopup" :event="selectedEvent" @close="showPopup = false" />
    </div>
  </div>
</template>

<script>
import EventPopup from './EventPopup.vue';
import { db, auth } from '../../../../firebase';

export default {
  data() {
    return {
      events: [],
      selectedEvent: null,
      showPopup: false,
      currentYear: new Date().getFullYear(),
      currentMonthIndex: new Date().getMonth(),
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      today: new Date().getDate(),
      todayMonth: new Date().getMonth(),
      todayYear: new Date().getFullYear(),
      selectedPetType: '',
      selectedEventSize: '',
      selectedLocation: '',
      startDate: '',
      endDate: '',
      showAddEventPopup: false,
      customEvent: { title: '', description: '', date: '', location: '' }
    };
  },

  async mounted() {
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const response = await fetch(`http://localhost:3000/api/calendar/joined-events/${uid}`);
        const events = await response.json();
        
        // Map timestamp to Date object
        this.events = events.map(event => ({
          ...event,
          EventDate: new Date(event.date._seconds * 1000)
        }));

        console.log("Fetched events:", this.events); // Console log for debugging
      } else {
        console.error("User is not authenticated");
      }
    } catch (error) {
      console.error("Error fetching joined events:", error);
    }
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
    const prevMonthDays = startDate.getDay();

    // Fill in days from the previous month
    for (let i = prevMonthDays; i > 0; i--) {
      const prevMonthDate = new Date(startDate);
      prevMonthDate.setDate(startDate.getDate() - i);
      week.push({ date: prevMonthDate.getDate(), isCurrentMonth: false });
    }

    // Fill in days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ date: day, isCurrentMonth: true });
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // Fill in days from the next month to complete the last week
    let nextMonthDay = 1;
    while (week.length < 7) {
      week.push({ date: nextMonthDay++, isCurrentMonth: false });
    }

    // Only push the last week if it contains at least one date from the current month
    if (week.some(day => day.isCurrentMonth)) {
      calendar.push(week);
    }

    return calendar;
  },
  uniquePetTypes() {
    return [...new Set(this.events.flatMap(event => event.petType))];
  },
  uniqueEventSizes() {
    return [...new Set(this.events.map(event => event.eventSize))];
  },
  uniqueLocations() {
    return [...new Set(this.events.map(event => event.location))];
  },
  filteredEvents() {
    return this.events.filter(event => {
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      return (
        (!this.selectedPetType || event.petType.includes(this.selectedPetType)) &&
        (!this.selectedEventSize || event.eventSize === this.selectedEventSize) &&
        (!this.selectedLocation || event.location === this.selectedLocation) &&
        (!start || event.EventDate >= start) &&
        (!end || event.EventDate <= end)
      );
    });
  },
  eventDates() {
    return this.filteredEvents.map(event => event.EventDate.toDateString());
  }
}
,

  methods: {
    isEventDate(date, isCurrentMonth) {
      if (!isCurrentMonth || !date) return false;
      const formattedDate = new Date(this.currentYear, this.currentMonthIndex, date).toDateString();
      return this.eventDates.includes(formattedDate);
    },
    isCurrentDate(date, isCurrentMonth) {
      return isCurrentMonth && this.currentYear === this.todayYear && this.currentMonthIndex === this.todayMonth && date === this.today;
    },
    showEventDetails(date, isCurrentMonth) {
      if (!isCurrentMonth || !date) return;
      const selectedDate = new Date(this.currentYear, this.currentMonthIndex, date).toDateString();
      this.selectedEvent = this.filteredEvents.find(event => event.EventDate.toDateString() === selectedDate);
      if (this.selectedEvent) this.showPopup = true;
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
    addCustomEvent() {
      alert(`Event added: ${this.customEvent.title}`);
      this.showAddEventPopup = false;
      this.customEvent = { title: '', description: '', date: '', location: '' };
    }
  },

  components: { EventPopup }
};
</script>



<style scoped>
  .calendar-container {
    display: flex;
    width: 90%;
    margin: auto;
    height: 80vh;
    min-height: 550px;
    max-height: 80vh;
    border: solid 4px #c8c7c7;
    border-radius: 12px;
    overflow: hidden;
  }
  /* sidepanel */
  .side-panel {
    width: 15vw;
    min-width: 100px;
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
    font-size: 2vw;
    font-weight: bolder;
    font-family: 'Arial Rounded MT';
  }
  .current-day h3{
    font-size: 1.5vw;
    /* text-align: center; */
    font-weight: bolder;
    font-family: 'Arial Rounded MT';
    color:#414141bf;
  }
  .side-panel hr{
    border: 1px solid #c8c7c7;
  }
  select {
    width: 90%;
    margin-left: 4%;
    padding: 0.4vw;
    font-family: 'Arial Rounded MT';
    font-size: 1vw;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  .filters h3{
    text-align: center;
    font-family: 'Arial Rounded MT';
    font-size: 1.2vw;
  }
  .filters h4{
    font-family: 'Arial Rounded MT';
    font-size: 1.2vw;
    padding-left: 5%;
    margin-top: 8px;
    text-decoration: underline;
  }

  /* Date Range Filter styling */
  .date-range{
    margin-bottom: 10px;
  }
  .date-range h4 {
    font-family: 'Arial Rounded MT';
    font-size: 1.2vw;
    text-decoration: underline;
  }

  .date-range label {
    font-family: 'Arial Rounded MT';
    font-weight: bold;
    font-size: 1vw;
    display: block;
    margin-top:3px;
    margin-left: 6%;
  }

  .date-range input {
    width: 85%;
    height: 3vw;
    margin-left: 6%;
    font-family: 'Arial Rounded MT';
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1.2vw;
    margin-bottom: 0px;
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
  background-image: url(../../../assets/images/pet_calendar.avif);
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

  /* calendar */
  .calendar {
    flex: 1;
    border-left: 4px solid #c8c7c7;
    width: 80%;
    overflow-y: auto;
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
    background-image: url(../../../assets/images/pet_calendar.avif);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center bottom;
    border-bottom: 4px solid #c8c7c7;
  }
  @font-face {
    font-family: pawfont;
    src: url(../../../assets/fonts/PawWowBlock-VGMDl.otf);
  }
  .calendar-header h1 {
    font-size: 7vw; /* Font size is now relative to the container size */
    font-weight: bolder;
    font-family: pawfont;
    color: black;
    text-shadow: 4px 3px white;
    text-transform: uppercase;
  }

  .calendar-header button {
    background-color: #48434B;
    font-size: 1.3vw;
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
    table-layout: fixed; /* Ensures consistent column width */
  }

  /* Header styling */
  thead{
    height:17%;
  }
  th {
    background-color: #ffd700;
    border: 1.5px solid black;
    border-radius: 12px;
    /* Slightly bigger padding for the header */
    font-size: 2.2vw; /* Larger font size for the header */
    font-family: "Arial Rounded MT";
    text-align: center;
    width: calc(100% / 7);
  }

  /* Day cell styling */
  td {
    background-color: #FCEFB4;
    border: 1px solid black;
    border-radius: 12px;
    font-size: 1.5vw; /* Smaller font size for the day cells */
    font-family: "Arial Rounded MT";
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
    background-color: #6b4200e7;
    color: white;
    /* border: 2px solid #7b61ff; */
  }
  .current-month {
    color: #000;
  }
  .other-month {
    color: #bdbdbd;
  }


/* ADD CUSTOM EVENTS CSSS */
.add-event-button {
  background-color: #ffd700; /* Date header color */
  border: 1px solid black;
  color: black;
  font-size: 1.2vw;
  font-family: "Arial Rounded MT";
  padding: 12px 0px;
  border-radius: 8px;
  cursor: pointer;
  margin: 10px auto;
  display: block;
  width: 90%;
  text-align: center;
  transition: background-color 0.3s;
}

.add-event-button:hover {
  background-color: #e6c200; /* Slightly darker shade */
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.popup-content h3 {
  text-align: center;
  font-family: "Arial Rounded MT";
  font-size: 1.5vw;
  margin-bottom: 20px;
}

.popup-content label {
  display: block;
  font-family: "Arial Rounded MT";
  font-size: 1.1vw;
  margin-top: 10px;
}

.popup-content input, .popup-content textarea {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  font-family: "Arial Rounded MT";
  font-size: 1vw;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.popup-buttons button {
  background-color: #ffd700; /* Same color scheme */
  border: 1px solid black;
  color: black;
  font-family: "Arial Rounded MT";
  font-size: 1vw;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.popup-buttons button:hover {
  background-color: #e6c200;
}
/* END ADD CUSTOM EVENTS CSS */
</style>  
