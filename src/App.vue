<template>
  <div class="max-w-4xl mx-auto p-6 font-sans">
    <h1 class="text-3xl font-bold mb-2">Any flight worldwide, at your fingertips</h1>
    <p class="text-gray-600 mb-6">Whether it's building booking platforms, visualizing and monitoring global flights or
      creating popular flight tracking applications — our flight data API is used by thousands every day.</p>

    <div class="flex space-x-4 mb-6">
      <div class="flex-1 relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        </span>
        <input v-model="airline" placeholder="Airline (e.g. WestJet)" class="pl-10 pr-4 py-2 w-full border rounded-md">
      </div>
      <div class="flex-1 relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </span>
        <input v-model="flightNumber" placeholder="WS3041" class="pl-10 pr-4 py-2 w-full border rounded-md">
      </div>
      <div class="flex-1 relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd" />
          </svg>
        </span>
        <input type="date" v-model="date" class="pl-10 pr-4 py-2 w-full border rounded-md">
      </div>
      <button @click="searchFlight"
        class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">SEARCH
        FLIGHT</button>
    </div>

    <div v-if="flightInfo" class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-2xl font-bold">{{ flightInfo.flight.iata }}</h2>
            <p class="text-gray-600">{{ flightInfo.airline.name }} ({{ flightInfo.airline.iata }})</p>
          </div>
          <div class="bg-green-500 text-white px-4 py-2 rounded-md text-center">
            <p class="font-bold">{{ flightInfo.flight_status }}</p>
            <p class="text-sm">{{ statusMessage }}</p>
          </div>
        </div>
        <div class="flex justify-between items-center mb-6">
          <div class="text-center">
            <p class="text-xl font-bold">{{ flightInfo.departure.iata }}</p>
            <p class="text-sm text-gray-600">{{ flightInfo.departure.airport }}</p>
          </div>
          <svg class="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <div class="text-center">
            <p class="text-xl font-bold">{{ flightInfo.arrival.iata }}</p>
            <p class="text-sm text-gray-600">{{ flightInfo.arrival.airport }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <p class="text-gray-500 mb-2">Departure</p>
            <h3 class="text-lg font-bold mb-1">{{ flightInfo.departure.airport }}</h3>
            <p class="text-sm text-gray-600 mb-4">IATA: {{ flightInfo.departure.iata }} • ICAO: {{
              flightInfo.departure.icao }}</p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="font-bold">Scheduled</p>
                <p>{{ formatDate(flightInfo.departure.scheduled) }}</p>
              </div>
              <div>
                <p class="font-bold">Estimated</p>
                <p>{{ formatDate(flightInfo.departure.estimated) }}</p>
              </div>
              <div>
                <p class="font-bold">Actual</p>
                <p>{{ formatDate(flightInfo.departure.actual) || 'N/A' }}</p>
              </div>
              <div>
                <p class="font-bold">Runway</p>
                <p>{{ formatDate(flightInfo.departure.actual_runway) || 'N/A' }}</p>
              </div>
            </div>
            <div class="mt-4 flex space-x-4">
              <div class="bg-gray-200 px-3 py-1 rounded">
                <span class="font-bold">Terminal</span> {{ flightInfo.departure.terminal || 'N/A' }}
              </div>
              <div class="bg-gray-200 px-3 py-1 rounded">
                <span class="font-bold">Gate</span> {{ flightInfo.departure.gate || 'N/A' }}
              </div>
            </div>
          </div>
          <div>
            <p class="text-gray-500 mb-2">Arrival</p>
            <h3 class="text-lg font-bold mb-1">{{ flightInfo.arrival.airport }}</h3>
            <p class="text-sm text-gray-600 mb-4">IATA: {{ flightInfo.arrival.iata }} • ICAO: {{ flightInfo.arrival.icao
              }}</p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="font-bold">Scheduled</p>
                <p>{{ formatDate(flightInfo.arrival.scheduled) }}</p>
              </div>
              <div>
                <p class="font-bold">Estimated</p>
                <p>{{ formatDate(flightInfo.arrival.estimated) }}</p>
              </div>
              <div>
                <p class="font-bold">Actual</p>
                <p>{{ formatDate(flightInfo.arrival.actual) || 'N/A' }}</p>
              </div>
              <div>
                <p class="font-bold">Runway</p>
                <p>{{ formatDate(flightInfo.arrival.actual_runway) || 'N/A' }}</p>
              </div>
            </div>
            <div class="mt-4 flex space-x-4">
              <div class="bg-gray-200 px-3 py-1 rounded">
                <span class="font-bold">Terminal</span> {{ flightInfo.arrival.terminal || 'N/A' }}
              </div>
              <div class="bg-gray-200 px-3 py-1 rounded">
                <span class="font-bold">Gate</span> {{ flightInfo.arrival.gate || 'N/A' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-100 px-6 py-4 text-sm text-gray-600">
        <p>Departure Timezone: {{ flightInfo.departure.timezone }} • Arrival Timezone: {{ flightInfo.arrival.timezone }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      airline: '',
      flightNumber: '',
      date: new Date().toISOString().split('T')[0], // Set default to today's date
      flightInfo: null,
      apiKey: process.env.VUE_APP_AVIATION_STACK_API_KEY
    };
  },
  computed: {
    statusMessage() {
      switch (this.flightInfo?.flight_status) {
        case 'active': return 'On Time';
        case 'scheduled': return 'On Schedule';
        case 'landed': return 'On Time';
        case 'cancelled': return 'Cancelled';
        default: return '';
      }
    }
  },
  methods: {
    async searchFlight() {
      try {
        const response = await axios.get('http://api.aviationstack.com/v1/flights', {
          params: {
            access_key: this.apiKey,
            flight_iata: this.flightNumber,
            airline_name: this.airline,
            date: this.formatDateForAPI(this.date) // Use the formatted date
          }
        });
        if (response.data.data.length > 0) {
          this.flightInfo = response.data.data[0];
        } else {
          alert('No flight found with the given details.');
        }
      } catch (error) {
        console.error('Error fetching flight data:', error);
        alert('An error occurred while fetching flight data.');
      }
    },
    formatDateForAPI(dateString) {
      // Convert the date to YYYY-MM-DD format for the API
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      }).replace(',', '');
    }
  }
};
</script>