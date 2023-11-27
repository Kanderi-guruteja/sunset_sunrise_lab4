"use strict";

// static fields
const MILLIS_SECOND = 1000;
const MILLIS_MINUTE = 60 * MILLIS_SECOND;
const MILLIS_HOUR = 60 * MILLIS_MINUTE;
const MILLIS_DAY = 24 * MILLIS_HOUR;

// main
function searchLocation() {
  const locationInput = document.getElementById('location');
  const location = locationInput.value.trim();

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
  const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}`;

  quickFetch(
    geocodeUrl,
    response => {
      if (response.results.length > 0) {
        const position = {
          coords: {
            latitude: response.results[0].geometry.lat,
            longitude: response.results[0].geometry.lng,
          },
        };
        fetchSunriseSunset(position);
      } else {
        alert('Location not found.');
      }
    },
    error => {
      console.error('Error fetching geocode:', error);
      alert('An error occurred while fetching geocode information.');
    }
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
  const sunriseSunsetUrl = `https://api.sunrisesunset.io/json?lat=${position.coords.latitude}&lng=${position.coords.longitude}&date=${yyyyMMdd}&formatted=0`;

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
    error => {
      console.error('Error fetching sunrise/sunset:', error);
      alert('An error occurred while fetching sunrise/sunset information.');
    }
  );
}

/**
 * A wrapper of `fetch` function in default GET method.
 *
 * @param {String} url ampersand-separated key-value pairs.
 * @param {Function} successListener callback to handle the successful response.
 * @param {Function} errorListener callback to handle errors.
 */
function quickFetch(url, successListener, errorListener) {
  fetch(url)
    .then(result => result.json())
    .then(successListener)
    .catch(error => errorListener(error));
}
