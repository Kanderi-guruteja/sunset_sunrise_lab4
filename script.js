const API_URL = 'https://api.sunrisesunset.io/json';
const GEOCODING_API_URL = 'https://geocode.maps.co/search';

function getLocationCoordinates(address) {
  const params = {
    q: address,
    format: 'json'
  };

  const url = new URL(GEOCODING_API_URL);
  url.search = new URLSearchParams(params).toString();

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'OK') {
        const results = data.results[0];
        const latitude = results.latitude;
        const longitude = results.longitude;

        return { latitude, longitude };
      } else {
        throw new Error('Geocoding failed');
      }
    })
    .catch(error => {
      console.error('Error fetching coordinates:', error);
    });
}

function getSunriseSunsetData(coordinates) {
  const { latitude, longitude } = coordinates;

  const params = {
    lat: latitude,
    lng: longitude,
    format: 'json'
  };

  const url = new URL(API_URL);
  url.search = new URLSearchParams(params).toString();

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'OK') {
        const results = data.results;
        const sunrise = results.sunrise;
        const sunset = results.sunset;
        const dawn = results.dawn;
        const dusk = results.dusk;
        const solarNoon = results.solar_noon;
        const dayLength = results.day_length;

        updateSunriseSunsetData(sunrise, sunset, dawn, dusk, solarNoon, dayLength);
      } else {
        throw new Error('Fetching sunrise and sunset data failed');
      }
    })
    .catch(error => {
      console.error('Error fetching sunrise and sunset data:', error);
    });
}

function updateSunriseSunsetData(sunrise, sunset, dawn, dusk, solarNoon, dayLength) {
  document.getElementById('sunrise').innerHTML = sunrise;
  document.getElementById('sunset').innerHTML = sunset;
  document.getElementById('dawn').innerHTML = dawn;
  document.getElementById('dusk').innerHTML = dusk;
  document.getElementById('solarNoon').innerHTML = solarNoon;
  document.getElementById('dayLength').innerHTML = dayLength;
}

function initialize() {
  const searchBtn = document.getElementById('search-btn');
  searchBtn.addEventListener('click', () => {
    const locationInput = document.getElementById('location').value;
    if (locationInput) {
      getLocationCoordinates(locationInput)
        .then(coordinates => getSunriseSunsetData(coordinates));
    }
  });
}

initialize();
