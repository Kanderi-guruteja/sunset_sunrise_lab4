const API_URL = 'https://api.sunrisesunset.io/json';

function getLocationCoordinates(address) {
  if (address) {
    // Forward geocoding for the specified address
    const params = {
      q: address,
      format: 'json'
    };

    const url = new URL('https://geocode.maps.co/search');
    url.search = new URLSearchParams(params).toString();

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK' && data.results.length > 0) {
          const results = data.results[0];
          const latitude = results.latitude;
          const longitude = results.longitude;

          getSunriseSunsetData({ latitude, longitude });
        } else {
          throw new Error('Geocoding failed or no results found');
        }
      })
      .catch(error => {
        console.error('Error fetching coordinates:', error);
      });
  } else {
    // Reverse geocoding for the current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          getSunriseSunsetData({ latitude, longitude });
        },
        error => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation not supported by this browser');
    }
  }
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
  document.getElementById('sunrise').textContent = `Sunrise: ${sunrise}`;
  document.getElementById('sunset').textContent = `Sunset: ${sunset}`;
  document.getElementById('dawn').textContent = `Dawn: ${dawn}`;
  document.getElementById('dusk').textContent = `Dusk: ${dusk}`;
  document.getElementById('solarNoon').textContent = `Solar Noon: ${solarNoon}`;
  document.getElementById('dayLength').textContent = `Day Length: ${dayLength}`;
}

function initialize() {
  const searchBtn = document.getElementById('search-btn');
  searchBtn.addEventListener('click', () => {
    const locationInput = document.getElementById('location').value;
    getLocationCoordinates(locationInput);
  });

  const geolocationBtn = document.getElementById('geolocation-btn');
  geolocationBtn.addEventListener('click', () => {
    getLocationCoordinates();
  });
}

initialize();
