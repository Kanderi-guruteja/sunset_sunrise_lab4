"use strict";

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

  fetchSunriseSunset(location);
}

/**
 * A REST call to obtain time events.
 *
 * @param {String} location location to search.
 */
function fetchSunriseSunset(location) {
  const today = new Date();
  const yyyyMMdd =
    `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const sunriseSunsetUrl = `https://api.sunrisesunset.io/json?q=${encodeURIComponent(location)}&date=${yyyyMMdd}&formatted=0`;

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
        alert('Location not found.');
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
