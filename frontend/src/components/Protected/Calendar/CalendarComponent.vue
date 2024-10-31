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

        <!-- Show Custom Events Filter -->
        <div class="show-custom-events">
            <h4>Show Custom Events?</h4>
            <label>
              <input type="radio" value="yes" v-model="showCustomEvents" /> Yes
            </label>
            <label>
              <input type="radio" value="no" v-model="showCustomEvents" /> No
            </label>
        </div>

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
    :class="[
        isEventDate(date.date, date.isCurrentMonth),
        {
            'current-date': isCurrentDate(date.date, date.isCurrentMonth),
            'clickable-date': true,
            'current-month': date.isCurrentMonth,
            'other-month': !date.isCurrentMonth
        }
    ]"
    @click="showEventDetails(date.date, date.isCurrentMonth)"
>
    <span class="date">{{ date.date }}</span>
</td>
          </tr>
        </tbody>
      </table>

      <EventPopup
  v-if="showPopup"
  :event="selectedEvent"
  @close="showPopup = false"
  @delete-event="deleteEvent"
/>
    </div>
    <!-- CUSTOMEVENTFORM -->
    <div v-if="showAddEventPopup" class="popup-overlay">
      <div class="popup-content">
        <h3>Create Custom Event</h3>
        <label for="title">Title:</label>
        <input type="text" v-model="newCustomEvent.title" id="title" required />

        <label for="description">Description:</label>
        <textarea v-model="newCustomEvent.description" id="description" required></textarea>

        <label for="date">Date:</label>
        <input type="date" v-model="newCustomEvent.date" id="date" required />

        <label for="location">Location:</label>
        <input type="text" v-model="newCustomEvent.location" id="location" required />

        <div class="popup-buttons">
          <button @click="createCustomEvent">Create Event</button>
          <button @click="closeAddEventPopup">Cancel</button>
        </div>
      </div>
    </div>
    <!-- END CUSTOM EVENT FORM -->
  </div>
</template>

<script>
import EventPopup from './EventPopup.vue';
import { db, auth } from '../../../../firebase';

export default {
  data() {
    return {
        events: [],
        customEvents: [],
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
        customEvent: { title: '', description: '', date: '', location: '' },
        showCustomEvents: 'yes', // New filter property for showing/hiding custom events
        //NEW CUSTOM EVENT FORM
        newCustomEvent: {
        title: '',
        description: '',
        date: '',
        location: ''
      },
      showAddEventPopup: false,
      //NEW CUSTOM EVENT FORM
    };
},

async mounted() {
    try {
        const user = auth.currentUser;
        if (user) {
            const uid = user.uid;

            // Fetch joined events
            const eventsResponse = await fetch(`http://localhost:3000/api/calendar/joined-events/${uid}`);
            const events = await eventsResponse.json();
            this.events = events.map(event => ({
                ...event,
                EventDate: new Date(event.date._seconds * 1000)
            }));

            // Fetch custom events
            const customEventsResponse = await fetch(`http://localhost:3000/api/calendar/custom-events/${uid}`);
            const customEvents = await customEventsResponse.json();
            this.customEvents = customEvents.map(event => ({
                ...event,
                EventDate: new Date(event.date._seconds * 1000)
            }));

            console.log("Fetched events:", this.events);
            console.log("Fetched custom events:", this.customEvents);
        } else {
            console.error("User is not authenticated");
        }
    } catch (error) {
        console.error("Error fetching joined or custom events:", error);
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
  },
  //ADD CUSTOM EVENT DATES
  customEventDates() {
        return this.customEvents.map(event => event.EventDate.toDateString());
    }
    //ADD CUSTOM EVENT DATES
}
,

  methods: {
    isEventDate(date, isCurrentMonth) {
        if (!isCurrentMonth || !date) return false;
        const formattedDate = new Date(this.currentYear, this.currentMonthIndex, date).toDateString();

        // Show or hide custom events based on the filter
        if (this.showCustomEvents === 'yes' && this.customEventDates.includes(formattedDate)) {
            return 'custom-event-date'; // Blue highlight for custom events
        }
        if (this.eventDates.includes(formattedDate)) {
            return 'joined-event-date'; // Orange highlight for joined events
        }

        return false;
    },

    isCurrentDate(date, isCurrentMonth) {
        return isCurrentMonth && this.currentYear === this.todayYear && this.currentMonthIndex === this.todayMonth && date === this.today;
    },
    showEventDetails(date, isCurrentMonth) {
        if (!isCurrentMonth || !date) return;
        const selectedDate = new Date(this.currentYear, this.currentMonthIndex, date).toDateString();
        this.selectedEvent = this.filteredEvents.find(event => event.EventDate.toDateString() === selectedDate) ||
                             (this.showCustomEvents === 'yes' && this.customEvents.find(event => event.EventDate.toDateString() === selectedDate)); // Support both event types, respecting the filter
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
    },
    //ADD CUSTOM EVENT FORM FUNCTION
    closeAddEventPopup() {
      this.showAddEventPopup = false;
      this.newCustomEvent = { title: '', description: '', date: '', location: '' };
    },
    async createCustomEvent() {
      try {
        const user = auth.currentUser;
        if (user) {
            const uid = user.uid;
            const response = await fetch(`http://localhost:3000/api/calendar/custom-events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...this.newCustomEvent,
                    uid: uid
                })
            });

            const result = await response.json();
            if (response.ok) {
                // Add the new event to customEvents and update the calendar
                this.customEvents.push({
                    ...this.newCustomEvent,
                    EventDate: new Date(this.newCustomEvent.date),
                    customEventId: result.customEventId
                });

                // Close the popup
                this.showAddEventPopup = false;
                
                // Clear the form fields
                this.newCustomEvent = { title: '', description: '', date: '', location: '' };
            } else {
                console.error("Failed to create custom event:", result.error);
            }
        } else {
            console.error("User is not authenticated");
        }
    } catch (error) {
        console.error("Error creating custom event:", error);
    }
    },
    //ADD CUSTOM EVENT FORM FUNCTION

    //DELETE EVENT
    async deleteEvent(event) {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const uid = user.uid;
      const isCustomEvent = this.customEvents.some(e => e.customEventId === event.customEventId);

      // Send delete request to the backend
      await fetch(`http://localhost:3000/api/calendar/delete-event`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          eventId: isCustomEvent ? event.customEventId : event.eventId,
          isCustomEvent,
        }),
      });

      // Remove the event from the local data
      if (isCustomEvent) {
        this.customEvents = this.customEvents.filter(e => e.customEventId !== event.customEventId);
      } else {
        this.events = this.events.filter(e => e.eventId !== event.eventId);
      }

      // Refresh calendar
      this.showPopup = false;
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  },
  //DELETE EVENT
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

  .joined-event-date {
    /* background-color: rgba(21, 86, 239, 0.2); */
    background-color: #d1c8ff;
    color: #000;
    cursor: pointer;
  }

  .current-date .date{
    padding: 10px;
    border-radius: 50%;
    /* background-color: #ff47dd8c; */
    background-color: rgba(0, 0, 255, 0.539);
    color: white;
    text-decoration: underline;
  }

  /* CUSTOM EVENT DATE */
  .custom-event-date {
      background-color: #d1c8ff; /* Light blue for custom events */
      color: #000;
      cursor: pointer;
  }
  /* CUSTOM EVENT DATE */

  .clickable-date:hover {
    cursor: pointer;
    /* background-color: rgb(126, 165, 255); */
    background-color: rgba(0, 0, 255, 0.539);
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




/* CUSTOM EVENTS FILTER */
.show-custom-events {

    margin-top: 8px;
}

.show-custom-events h4 {
    font-family: 'Arial Rounded MT';
    font-size: 1.2vw;
    text-decoration: underline;
}

.show-custom-events label {
    font-family: 'Arial Rounded MT';
    font-size: 1vw;
    margin-right: 1vw;
    display: inline-block;
}
.show-custom-events input {
  margin-left: 10px;
  outline: none;
  box-shadow: none;
}

/* CUSTOM EVENTS FORM CSS */
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
  background-color: #ffd700;
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
/* CUSTOM EVENTS FORM CSS */
</style>  
