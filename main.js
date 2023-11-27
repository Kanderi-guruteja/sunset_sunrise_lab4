"use strict";

// Constants for New York coordinates
const NEW_YORK_LATITUDE = 40.7128;
const NEW_YORK_LONGITUDE = -74.0060;

// Geocoding API endpoints
const GEOCODE_API_ENDPOINT = 'https://geocode.maps.co';
const FORWARD_GEOCODE_URL = `${GEOCODE_API_ENDPOINT}/search?q=`;
const REVERSE_GEOCODE_URL = `${GEOCODE_API_ENDPOINT}/reverse?lat={latitude}&lon={longitude}`;

// static fields
const MILLIS_SECOND = 1000;
const MILLIS_MINUTE = 60 * MILLIS_SECOND;
const MILLIS_HOUR = 60 * MILLIS_MINUTE;
const MILLIS_DAY = 24 * MILLIS_HOUR;

// main
document.addEventListener('DOMContentLoaded', () => {
  // Load default location (New York) on page load
  const defaultLocation = 'New York';
  document.getElementById('location').value = defaultLocation;
  searchLocation();
});

function searchLocation() {
  const locationInput = document.getElementById('location');
  const location = locationInput.value.trim();

  if (!location) {
    alert('Please enter a location.');
    return;
  }

  fetchCoordinates(location);
}

/**
 * Fetch coordinates using forward geocoding.
 *
 * @param {String} address Location to search.
 */
function fetchCoordinates(address) {
  const forwardGeocodeUrl = `${FORWARD_GEOCODE_URL}${encodeURIComponent(address)}`;

  quickFetch(
    forwardGeocodeUrl,
    response => {
      if (response.features && response.features.length > 0) {
        const coordinates = response.features[0].geometry.coordinates;
        fetchSunriseSunset(address, coordinates[1], coordinates[0]);
      } else {
        alert('Location not found.');
      }
    },
    error => {
      console.error('Error fetching coordinates:', error);
      alert('An error occurred while fetching coordinates.');
    }
  );
}

/**
 * A REST call to obtain time events.
 *
 * @param {String} location Location to search.
 * @param {Number} latitude Latitude of the location.
 * @param {Number} longitude Longitude of the location.
 */
function fetchSunriseSunset(location, latitude, longitude) {
  const today = new Date();
  const yyyyMMdd =
    `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const sunriseSunsetUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${yyyyMMdd}&formatted=0`;

  quickFetch(
    sunriseSunsetUrl,
    response => {
      if (response.results) {
        // Display sunrise and sunset data
        const infoContainer = document.getElementById('sunrise-sunset-info');
        infoContainer.innerHTML = `
          <p>Location: ${location}</p>
          <p>Sunrise: ${new Date(response.results.sunrise).toLocaleTimeString()}</p>
          <p>Sunset: ${new Date(response.results.sunset).toLocaleTimeString()}</p>
          <!-- Add more information as needed -->
        `;
      } else {
        alert('Sunrise/sunset information not available.');
      }
    },
    error => {
      console.error('Error fetching sunrise/sunset:', error);
      alert('An error occurred while fetching sunrise/sunset information.');
    }
  );
}

/**
 * A wrapper of `fetch` function in default GET method.
 *
 * @param {String} url URL to fetch.
 * @param {Function} successListener callback to handle the successful response.
 * @param {Function} errorListener callback to handle errors.
 */
function quickFetch(url, successListener, errorListener) {
  fetch(url)
    .then(result => result.json())
    .then(successListener)
    .catch(error => errorListener(error));
}
