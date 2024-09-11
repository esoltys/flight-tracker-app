<template>
  <div class="flight-search">
    <h1>Any flight worldwide, at your fingertips</h1>
    <p class="subtitle">Whether it's building booking platforms, visualizing and monitoring global flights or creating
      popular flight tracking applications — our flight data API is used by thousands every day.</p>

    <div class="search-form">
      <input v-model="airline" placeholder="Airline (e.g. WestJet)">
      <input v-model="flightNumber" placeholder="Flight Number (e.g. WS5024)">
      <input type="date" v-model="date">
      <button @click="searchFlight" class="search-button">SEARCH FLIGHT</button>
    </div>

    <div v-if="flightInfo" class="flight-info">
      <h2>{{ flightInfo.flight_iata }}</h2>
      <p class="airline">{{ flightInfo.airline.name }} ({{ flightInfo.airline.iata }})</p>

      <div class="route-info">
        <span>{{ flightInfo.departure.iata }} → {{ flightInfo.arrival.iata }}</span>
        <span class="status">{{ flightInfo.flight_status }}</span>
      </div>

      <p class="schedule-status">{{ scheduleStatus }}</p>

      <div class="airport-info">
        <div class="departure">
          <h3>Departure</h3>
          <p class="airport-name">{{ flightInfo.departure.airport }}</p>
          <p class="airport-code">IATA: {{ flightInfo.departure.iata }} • ICAO: {{ flightInfo.departure.icao }}</p>

          <div class="time-info">
            <div>
              <p>Scheduled</p>
              <p>{{ formatDate(flightInfo.departure.scheduled) }}</p>
            </div>
            <div>
              <p>Estimated</p>
              <p>{{ formatDate(flightInfo.departure.estimated) }}</p>
            </div>
            <div>
              <p>Actual</p>
              <p>{{ flightInfo.departure.actual || 'N/A' }}</p>
            </div>
            <div>
              <p>Runway</p>
              <p>{{ flightInfo.departure.actual_runway || 'N/A' }}</p>
            </div>
          </div>

          <p class="terminal-gate">Terminal {{ flightInfo.departure.terminal || 'N/A' }}Gate {{
            flightInfo.departure.gate || 'N/A' }}</p>
        </div>

        <div class="arrival">
          <h3>Arrival</h3>
          <p class="airport-name">{{ flightInfo.arrival.airport }}</p>
          <p class="airport-code">IATA: {{ flightInfo.arrival.iata }} • ICAO: {{ flightInfo.arrival.icao }}</p>

          <div class="time-info">
            <div>
              <p>Scheduled</p>
              <p>{{ formatDate(flightInfo.arrival.scheduled) }}</p>
            </div>
            <div>
              <p>Estimated</p>
              <p>{{ formatDate(flightInfo.arrival.estimated) }}</p>
            </div>
            <div>
              <p>Actual</p>
              <p>{{ flightInfo.arrival.actual || 'N/A' }}</p>
            </div>
            <div>
              <p>Runway</p>
              <p>{{ flightInfo.arrival.actual_runway || 'N/A' }}</p>
            </div>
          </div>

          <p class="terminal-gate">Terminal {{ flightInfo.arrival.terminal || 'N/A' }}Gate {{ flightInfo.arrival.gate ||
            'N/A' }}</p>
        </div>
      </div>

      <p class="timezone-info">
        Departure Timezone: {{ flightInfo.departure.timezone }} •
        Arrival Timezone: {{ flightInfo.arrival.timezone }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      airline: "",
      flightNumber: "",
      date: new Date().toISOString().split("T")[0],
      flightInfo: null,
      apiKey: process.env.VUE_APP_AVIATION_STACK_API_KEY
    };
  },
  computed: {
    statusClass() {
      return {
        "status-active": this.flightInfo.flight_status === "active",
        "status-scheduled": this.flightInfo.flight_status === "scheduled",
        "status-landed": this.flightInfo.flight_status === "landed",
        "status-cancelled": this.flightInfo.flight_status === "cancelled",
      };
    },
    statusMessage() {
      switch (this.flightInfo.flight_status) {
        case "active":
          return "On Time";
        case "scheduled":
          return "On Schedule";
        case "landed":
          return "Landed";
        case "cancelled":
          return "Cancelled";
        default:
          return "";
      }
    },
  },
  methods: {
    async searchFlight() {
      try {
        const response = await axios.get(
          "http://api.aviationstack.com/v1/flights",
          {
            params: {
              access_key: this.apiKey,
              flight_iata: this.flightNumber,
              airline_name: this.airline,
              date: this.date,
            },
          }
        );
        if (response.data.data.length > 0) {
          this.flightInfo = response.data.data[0];
        } else {
          alert("No flight found with the given details.");
        }
      } catch (error) {
        console.error("Error fetching flight data:", error);
        alert("An error occurred while fetching flight data.");
      }
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
};
</script>

<style scoped>
.flight-search {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-form input,
.search-form button {
  padding: 10px;
  font-size: 14px;
}

.search-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  cursor: pointer;
}

.flight-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
}

h2 {
  font-size: 24px;
  margin-bottom: 5px;
}

.airline {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.route-info {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  margin-bottom: 10px;
}

.status {
  color: #4a90e2;
}

.schedule-status {
  color: #4a90e2;
  font-weight: bold;
  margin-bottom: 20px;
}

.airport-info {
  display: flex;
  gap: 40px;
}

.departure,
.arrival {
  flex: 1;
}

h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.airport-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.airport-code {
  color: #666;
  margin-bottom: 15px;
}

.time-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.time-info p:first-child {
  font-weight: bold;
}

.terminal-gate {
  font-weight: bold;
}

.timezone-info {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}
</style>
