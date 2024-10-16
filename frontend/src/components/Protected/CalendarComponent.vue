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
      <div class="filters">
        <h3>Filter Events</h3>
        <div>
          <label>
            <input type="checkbox" value="Dog" v-model="selectedFilters" />
            Dog
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" value="Cat" v-model="selectedFilters" />
            Cat
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" value="Hamster" v-model="selectedFilters" />
            Hamster
          </label>
        </div>
        <!-- Add more filters as needed -->
         <p>{{ selectedFilters }}</p>
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
import EventPopup from './EventPopup.vue';

export default {
  data() {
    return {
      events: [
        { EventId: "1", UserId: "123", Title: "Dog Walking", Description: "Walk the dog in the park", EventDate: "2024-10-13", Location: "Central Park" },
        { EventId: "2", UserId: "124", Title: "Pet Adoption Fair", Description: "Adoption event for pets", EventDate: "2024-10-20", Location: "City Hall" },
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
      selectedFilters: [],
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

      // Fill the first week with the previous month's dates if needed
      for (let i = 0; i < startDate.getDay(); i++) {
        const prevMonthDate = new Date(startDate);
        prevMonthDate.setDate(startDate.getDate() - (startDate.getDay() - i));
        week.push({ date: prevMonthDate.getDate(), isCurrentMonth: false });
      }

      // Fill the calendar with the current month's dates
      for (let day = 1; day <= daysInMonth; day++) {
        week.push({ date: day, isCurrentMonth: true });

        if (week.length === 7) {
          calendar.push(week);
          week = [];
        }
      }

      // Fill the last week with the next month's dates if needed
      let dayCounter = 1;
      while (week.length < 7) {
        week.push({ date: dayCounter++, isCurrentMonth: false });
      }
      if (week.length > 0) {
        calendar.push(week);
      }

      // Remove the last week if it's completely from the next month
      if (calendar[calendar.length - 1].every(day => !day.isCurrentMonth)) {
        calendar.pop();
      }

      return calendar;
    },
    eventDates() {
      return this.events.map(event => event.EventDate);
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
      const event = this.events.find(event => event.EventDate === formattedDate);
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
  max-width: 930px;
  
  margin: auto;
  margin-top: 7vh;
  border: solid 4px #c8c7c7;
  border-radius: 12px;
  overflow: hidden;
}

/* sidepanel */
.side-panel {
  width: 200px;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}
.current-day {
  font-size: 30px;
  padding-left: 5px;
  font-weight: bolder;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  -webkit-text-stroke-width: 0.1px;
  -webkit-text-stroke-color: white;
  border-top: 4px solid #c8c7c7;
}
.filters {

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
  height: 150px;
  background-image: url(../../assets/images/pet_calendar.avif);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center bottom;
}
.calendar-header h1 {
  font-size: 48px;
  font-weight: bolder;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  color: black;
  text-shadow: 6px 6px 6px white;
}
.calendar-header button {
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.calendar-header button:hover {
  background-color: #f0f0f0;
}
table {
  width: 100%;
  background-color: white;
  height: 350px;
  border-collapse: separate;
  border-spacing: 4px;
}
th {
  background-color: rgba(54, 242, 242, 0.368);
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
  background-color: rgba(255, 192, 203, 0.429);
  border-radius: 12px;
  padding: 6px;
  text-align: center;
}
.event-date {
  background-color: rgba(21, 86, 239, 0.2);
  color: #000;
  cursor: pointer;
}
.current-date {
  font-weight: bolder;
  text-decoration: underline;
}
.clickable-date:hover {
  cursor: pointer;
  background-color: rgb(126, 165, 255);
}
.current-month {
  color: #000;
}
.other-month {
  color: #d3d3d3;
}
</style>
