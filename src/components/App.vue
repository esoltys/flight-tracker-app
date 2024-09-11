<template>
  <div class="max-w-4xl mx-auto p-6 font-sans">
    <h1 class="text-3xl font-bold mb-2">Track Your Journey, Anywhere in the Sky</h1>
    <p class="text-gray-600 mb-6">From takeoff to touchdown, stay informed about any flight's status, real-time
      location, and vital details. Perfect for travelers, meeters and greeters, or aviation enthusiasts.</p>

    <!-- search form -->
    <div class="flex space-x-4 mb-6">
      <div class="flex-1 relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        </span>
        <input v-model="airline" data-testid="airline-input" placeholder="Airline (e.g. WestJet)"
          class="pl-10 pr-4 py-2 w-full border rounded-md">
      </div>
      <div class="flex-1 relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </span>
        <input v-model="flightNumber" data-testid="flight-number-input" placeholder="Flight Number (e.g. WS3041)"
          class="pl-10 pr-4 py-2 w-full border rounded-md">
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
      <button @click="searchFlight" data-testid="search-button"
        class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">SEARCH
        FLIGHT</button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center my-8">
      <svg class="animate-spin h-20 w-20 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
        <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
        <path fill="currentColor" d="M12 22.5L2 17.5V7.5l10 5v10z" />
        <path fill="currentColor" d="M12 22.5l10-5V7.5l-10 5v10z" />
        <path fill="currentColor" d="M12 12l-10-5 10-5 10 5-10 5z" />
      </svg>
    </div>


    <div v-if="!isLoading && flights.length > 0" class="mt-6">
      <div v-for="(flight, index) in flights" :key="index" class="bg-white shadow-md rounded-lg overflow-hidden mb-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h2 class="text-2xl font-bold">{{ flight.flight.iata }}</h2>
              <p class="text-gray-600">{{ flight.airline.name }} ({{ flight.airline.iata }})</p>
              <p class="text-sm text-gray-500">Flight Date: {{ formatDate(flight.flight_date) }}</p>
            </div>
            <div :class="getStatusClass(flight.flight_status)" class="px-4 py-2 rounded-md text-center">
              <p class="font-bold">{{ flight.flight_status }}</p>
              <p class="text-sm">{{ getStatusMessage(flight.flight_status) }}</p>
            </div>
          </div>

          <!-- Detailed flight information -->
          <div class="flex justify-between items-center mb-6">
            <div class="text-center">
              <p class="text-xl font-bold">{{ flight.departure.iata }}</p>
              <p class="text-sm text-gray-600">{{ flight.departure.airport }}</p>
            </div>
            <svg class="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div class="text-center">
              <p class="text-xl font-bold">{{ flight.arrival.iata }}</p>
              <p class="text-sm text-gray-600">{{ flight.arrival.airport }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-gray-500 mb-2">Departure</p>
              <h3 class="text-lg font-bold mb-1">{{ flight.departure.airport }}</h3>
              <p class="text-sm text-gray-600 mb-4">IATA: {{ flight.departure.iata }} • ICAO: {{ flight.departure.icao
                }}</p>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="font-bold">Scheduled</p>
                  <p>{{ formatDate(flight.departure.scheduled) }}</p>
                </div>
                <div>
                  <p class="font-bold">Estimated</p>
                  <p>{{ formatDate(flight.departure.estimated) }}</p>
                </div>
                <div>
                  <p class="font-bold">Actual</p>
                  <p>{{ formatDate(flight.departure.actual) || 'N/A' }}</p>
                </div>
                <div>
                  <p class="font-bold">Runway</p>
                  <p>{{ formatDate(flight.departure.actual_runway) || 'N/A' }}</p>
                </div>
              </div>
              <div class="mt-4 flex space-x-4">
                <div class="bg-gray-200 px-3 py-1 rounded">
                  <span class="font-bold">Terminal</span> {{ flight.departure.terminal || 'N/A' }}
                </div>
                <div class="bg-gray-200 px-3 py-1 rounded">
                  <span class="font-bold">Gate</span> {{ flight.departure.gate || 'N/A' }}
                </div>
              </div>
            </div>
            <div>
              <p class="text-gray-500 mb-2">Arrival</p>
              <h3 class="text-lg font-bold mb-1">{{ flight.arrival.airport }}</h3>
              <p class="text-sm text-gray-600 mb-4">IATA: {{ flight.arrival.iata }} • ICAO: {{ flight.arrival.icao }}
              </p>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="font-bold">Scheduled</p>
                  <p>{{ formatDate(flight.arrival.scheduled) }}</p>
                </div>
                <div>
                  <p class="font-bold">Estimated</p>
                  <p>{{ formatDate(flight.arrival.estimated) }}</p>
                </div>
                <div>
                  <p class="font-bold">Actual</p>
                  <p>{{ formatDate(flight.arrival.actual) || 'N/A' }}</p>
                </div>
                <div>
                  <p class="font-bold">Runway</p>
                  <p>{{ formatDate(flight.arrival.actual_runway) || 'N/A' }}</p>
                </div>
              </div>
              <div class="mt-4 flex space-x-4">
                <div class="bg-gray-200 px-3 py-1 rounded">
                  <span class="font-bold">Terminal</span> {{ flight.arrival.terminal || 'N/A' }}
                </div>
                <div class="bg-gray-200 px-3 py-1 rounded">
                  <span class="font-bold">Gate</span> {{ flight.arrival.gate || 'N/A' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-100 px-6 py-4 text-sm text-gray-600">
          <p>Departure Timezone: {{ flight.departure.timezone }} • Arrival Timezone: {{ flight.arrival.timezone }}</p>
        </div>
      </div>

      <!-- Pagination controls -->
      <div class="flex justify-between items-center mt-4">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300">
          Next
        </button>
      </div>
    </div>

    <div v-else-if="!isLoading && searched" class="mt-6 text-center">
      No flights found for the given criteria.
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
      date: new Date().toISOString().split('T')[0],
      flights: [],
      apiKey: process.env.VUE_APP_AVIATION_STACK_API_KEY,
      currentPage: 1,
      totalPages: 1,
      limit: 10, // Number of results per page
      searched: false,
      isLoading: false
    };
  },
  methods: {
    async searchFlight() {
      this.searched = true;
      this.isLoading = true;
      try {
        const response = await axios.get('http://api.aviationstack.com/v1/flights', {
          params: {
            access_key: this.apiKey,
            flight_iata: this.flightNumber,
            airline_name: this.airline,
            date: this.formatDateForAPI(this.date),
            limit: this.limit,
            offset: (this.currentPage - 1) * this.limit
          }
        });
        this.flights = response.data.data;
        this.totalPages = Math.ceil(response.data.pagination.total / this.limit);
      } catch (error) {
        console.error('Error fetching flight data:', error);
        alert('An error occurred while fetching flight data.');
      } finally {
        this.isLoading = false;
      }
    },
    formatDateForAPI(dateString) {
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
    },
    getStatusClass(status) {
      switch (status.toLowerCase()) {
        case 'active': return 'bg-blue-500 text-white';
        case 'scheduled': return 'bg-yellow-500 text-white';
        case 'landed': return 'bg-green-600 text-white';
        case 'cancelled': return 'bg-red-500 text-white';
        default: return 'bg-gray-500 text-white';
      }
    },
    getStatusMessage(status) {
      switch (status.toLowerCase()) {
        case 'active': return 'In Flight';
        case 'scheduled': return 'On Schedule';
        case 'landed': return 'Arrived';
        case 'cancelled': return 'Cancelled';
        default: return '';
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.searchFlight();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.searchFlight();
      }
    }
  }
};
</script>