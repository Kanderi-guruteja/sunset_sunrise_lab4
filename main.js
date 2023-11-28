const API_URL = "https://api.sunrise-sunset.org/json";

// Get location from user input or geolocation
function getLocation() {
  let locationInput = document.getElementById('location').value;
  if (locationInput) {
    return locationInput;
  } else {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
}

// Display location and current date and time
function showPosition(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  getSunriseSunsetData(lat, lng);

  let currentDateTime = new Date();
  let formattedDate = currentDateTime.toLocaleDateString();
  let formattedTime = currentDateTime.toLocaleTimeString();
  document.getElementById('location-name').innerHTML = 'Your Current Location';
  document.getElementById('current-date-time').innerHTML = formattedDate + ' ' + formattedTime;
}

// Display error message for geolocation failure
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert('You have denied access to your location.');
      break;
    case error.POSITION_UNAVAILABLE:
      alert('Your location information is unavailable.');
      break;
    case error.TIMEOUT:
      alert('The request to get your location timed out.');
      break;
    default:
      alert('An unknown error occurred.');
  }
}

// Fetch sunrise and sunset data from the API
function getSunriseSunsetData(lat, lng) {
  let params = {
    lat: lat,
    lng: lng,
    date: new Date().toISOString().slice(0, 10),
    formatted: '1'
  };

  let url = new URL(API_URL);
  url.search = new URLSearchParams(params).toString();

  fetch(url)
    .then(response => response.json())
    .then(data => {
      let sunriseToday = data.results.sunrise;
      let sunsetToday = data.results.sunset;
      let dawnToday = data.results.civilTwilightBegin;
      let duskToday = data.results.civilTwilightEnd;
      let dayLengthToday = data.results.dayLength;

       let sunriseTomorrow = data.results.sunrise.slice(0, 10) + data.results.sunrise.slice(11);
      let sunsetTomorrow = data.results.sunset.slice(0, 10) + data.results.sunset.slice(11);
      let dawnTomorrow = data.results.civilTwilightBegin.slice(0, 10) + data.results.civilTwilightBegin.slice(11);
      let duskTomorrow = data.results.civilTwilightEnd.slice(0, 10) + data.results.civilTwilightEnd.slice(11);
      let dayLengthTomorrow = data.results.dayLength;

      document.getElementById('sunrise-today').innerHTML = sunriseToday;
      document.getElementById('sunset-today').innerHTML = sunsetToday;
      document.getElementById('dawn-today').innerHTML = dawnToday;
      document.getElementById('dusk-today').innerHTML = duskToday;
      document.getElementById('day-length-today').innerHTML = dayLengthToday;

      document.getElementById('sunrise-tomorrow').innerHTML = sunriseTomorrow;
      document.getElementById('sunset-tomorrow').innerHTML = sunsetTomorrow;
      document.getElementById('dawn-tomorrow').innerHTML = dawnTomorrow;
      document.getElementById('dusk-tomorrow').innerHTML = duskTomorrow;
      document.getElementById('day-length-tomorrow').innerHTML = dayLengthTomorrow;
    })
    .catch(error => {
      console.error('Error fetching sunrise and sunset data:', error);
    });
}

// Add event listener for search button
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
  let locationInput = document.getElementById('location').value;
  if (locationInput) {
    getSunriseSunsetData(locationInput);
  }
});

// Add event listener for geolocation button
const geolocationBtn = document.getElementById('geolocation-btn');
geolocationBtn.addEventListener('click', () => {
  getLocation();
});
