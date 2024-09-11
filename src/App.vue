<template>
  <div class="flight-search">
    <h1>Any flight worldwide, at your fingertips</h1>
    <p>
      Whether it's building booking platforms, visualizing and monitoring global
      flights or creating popular flight tracking applications — our flight data
      API is used by thousands every day.
    </p>

    <div class="search-form">
      <input v-model="airline" placeholder="Airline (e.g. United Airlines)" />
      <input v-model="flightNumber" placeholder="Flight Number (e.g. UA2402)" />
      <input type="date" v-model="date" />
      <button @click="searchFlight" class="search-button">SEARCH FLIGHT</button>
    </div>

    <div v-if="flightInfo" class="flight-info">
      <div class="flight-header">
        <div>
          <h2>{{ flightInfo.flight.iata }}</h2>
          <p>{{ flightInfo.airline.name }} ({{ flightInfo.airline.iata }})</p>
        </div>
        <div class="flight-route">
          {{ flightInfo.departure.iata }} → {{ flightInfo.arrival.iata }}
        </div>
        <div class="flight-status" :class="statusClass">
          {{ flightInfo.flight_status }}
          <p>{{ statusMessage }}</p>
        </div>
      </div>

      <div class="flight-details">
        <div class="departure">
          <h3>Departure</h3>
          <p>{{ flightInfo.departure.airport }}</p>
          <p>
            IATA: {{ flightInfo.departure.iata }} • ICAO:
            {{ flightInfo.departure.icao }}
          </p>
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
              <p>{{ formatDate(flightInfo.departure.actual) }}</p>
            </div>
            <div>
              <p>Runway</p>
              <p>{{ formatDate(flightInfo.departure.actual_runway) }}</p>
            </div>
          </div>
          <div class="airport-info">
            <span>Terminal {{ flightInfo.departure.terminal }}</span>
            <span>Gate {{ flightInfo.departure.gate }}</span>
          </div>
        </div>

        <div class="arrival">
          <h3>Arrival</h3>
          <p>{{ flightInfo.arrival.airport }}</p>
          <p>
            IATA: {{ flightInfo.arrival.iata }} • ICAO:
            {{ flightInfo.arrival.icao }}
          </p>
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
              <p>{{ formatDate(flightInfo.arrival.actual) }}</p>
            </div>
            <div>
              <p>Runway</p>
              <p>{{ formatDate(flightInfo.arrival.actual_runway) }}</p>
            </div>
          </div>
          <div class="airport-info">
            <span>Terminal {{ flightInfo.arrival.terminal }}</span>
            <span>Gate {{ flightInfo.arrival.gate }}</span>
          </div>
        </div>
      </div>

      <p class="timezone-info">
        Departure Timezone: {{ flightInfo.departure.timezone }} • Arrival
        Timezone: {{ flightInfo.arrival.timezone }}
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
/* Add your CSS styles here to match the layout in the image */
</style>
