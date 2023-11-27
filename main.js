"use strict";

// static fields
const MILLIS_SECOND = 1000;
const MILLIS_MINUTE = 60 * MILLIS_SECOND;
const MILLIS_HOUR = 60 * MILLIS_MINUTE;
const MILLIS_DAY = 24 * MILLIS_HOUR;
const DEFAULT_POSITION = {
  coords: {
    latitude: 37.7749,
    longitude: -122.4194,
  },
};

// main
function searchLocation() {
  const locationInput = document.getElementById('location');
  const location = locationInput.value;

  if (!location) {
    alert('Please enter a location.');
    return;
  }

  fetchGeocode(location);
}

/**
 * A REST call to obtain location.
 *
 * @param {String} location location to search.
 */
function fetchGeocode(location) {
  const geocodeApiKey = ''; // Replace with your OpenCage API key
  const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${geocodeApiKey}`;

  quickFetch(
    geocodeUrl,
    response => {
      const position = {
        coords: {
          latitude: response.results[0].geometry.lat,
          longitude: response.results[0].geometry.lng,
        },
      };
      fetchSunriseSunset(position);
    },
  );
}

/**
 * A REST call to obtain time events.
 *
 * @param {Object} position a parameter of Geolocation API.
 */
function fetchSunriseSunset(position) {
  const today = new Date();

  fetchSunriseSunsetForDate(position, today);
}

/**
 * A REST call to obtain time events for a specific date.
 *
 * @param {Object} position a parameter of Geolocation API.
 * @param {Date} date target date.
 */
function fetchSunriseSunsetForDate(position, date) {
  const yyyyMMdd =
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const sunriseSunsetApiKey = ''; // Replace with your Sunrise Sunset API key

  const sunriseSunsetUrl = `https://api.sunrisesunset.io/json?lat=${position.coords.latitude}&lng=${position.coords.longitude}&date=${yyyyMMdd}&formatted=0&key=${sunriseSunsetApiKey}`;

  quickFetch(
    sunriseSunsetUrl,
    response => {
      // Display sunrise and sunset data
      const infoContainer = document.getElementById('sunrise-sunset-info');
      infoContainer.innerHTML = `
        <p>Sunrise: ${new Date(response.results.sunrise).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(response.results.sunset).toLocaleTimeString()}</p>
        <!-- Add more information as needed -->
      `;
    },
  );
}

/**
 * A wrapper of `fetch` function in default GET method.
 *
 * @param {String} url ampersand-separated key-value pairs.
 * @param {Function} listener callback to handle the response.
 */
function quickFetch(url, listener) {
  fetch(url)
    .then(result => result.json())
    .then(listener)
    .catch(error => console.error('Error:', error));
}
