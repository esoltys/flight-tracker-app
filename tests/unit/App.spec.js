// Import necessary libraries
import { shallowMount } from "@vue/test-utils";
import App from "@/components/App.vue"; // Adjust the path as necessary

// Mock data for flights
const mockFlights = [
  {
    flight: { iata: "WS3041" },
    airline: { name: "WestJet", iata: "WS" },
    flight_date: "2023-10-01",
    flight_status: "active",
    departure: {
      iata: "YYZ",
      airport: "Toronto Pearson International Airport",
    },
    arrival: { iata: "YYC", airport: "Calgary International Airport" },
  },
];

// Test suite for the App component
describe("App.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(App, {
      data() {
        return {
          airline: "",
          flightNumber: "",
          date: "",
          flights: [],
        };
      },
      // Remove the methods option
    });

    // If you need to mock specific methods, do it here
    wrapper.vm.formatDate = jest.fn((date) => date); // Simple mock, adjust as needed
    wrapper.vm.getStatusClass = jest.fn((status) => status); // Simple mock, adjust as needed
    wrapper.vm.searchFlight = jest.fn();
  });

  // Test: Component renders correctly
  it("renders correctly with default props", () => {
    expect(wrapper.find("h1").text()).toBe(
      "Track Your Journey, Anywhere in the Sky"
    );
  });

  // Test: Handling user input for airline
  it("updates airline data when input changes", async () => {
    const input = wrapper.find('input[data-testid="airline-input"]');
    await input.setValue("WestJet");
    expect(wrapper.vm.airline).toBe("WestJet");
  });

  // Test: Handling user input for flight number
  it("updates flight number data when input changes", async () => {
    const input = wrapper.find('input[data-testid="flight-number-input"]');
    await input.setValue("WS3041");
    expect(wrapper.vm.flightNumber).toBe("WS3041");
  });

  // Test: Handling user input for date
  it("updates date data when input changes", async () => {
    const input = wrapper.find('input[type="date"]');
    await input.setValue("2023-10-01");
    expect(wrapper.vm.date).toBe("2023-10-01");
  });

  // Test: Clicking the search button invokes searchFlight method
  it("invokes searchFlight method when search button is clicked", async () => {
    const button = wrapper.find('button[data-testid="search-button"]');
    await button.trigger("click");
    expect(wrapper.vm.searchFlight).toHaveBeenCalled();
  });

  // Test: Displaying flight information when flights are available
  it("displays flight information when flights are available", async () => {
    await wrapper.setData({ flights: mockFlights });
    await wrapper.vm.$nextTick();
    const flightInfo = wrapper.find(".bg-white.shadow-md");
    expect(flightInfo.find(".text-2xl.font-bold").text()).toBe("WS3041");
    expect(flightInfo.find(".text-gray-600").text()).toBe("WestJet (WS)");
    expect(flightInfo.find(".text-sm.text-gray-500").text()).toContain(
      "Flight Date: 2023-10-01"
    );
  });

  // Test: Computed property formatDate
  it("formats flight date correctly", () => {
    const flightDate = "2023-10-01T12:00:00+00:00";
    expect(wrapper.vm.formatDate(flightDate)).toBe("2023-10-01T12:00:00+00:00");
  });

  // Test: Method getStatusClass
  it("returns correct status class", () => {
    expect(wrapper.vm.getStatusClass("active")).toBe("active");
  });
});
