function searchLocation() {
  const locationInput = document.getElementById('location');
  const location = locationInput.value;

  // Use the geocode API to get latitude and longitude
  const geocodeUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`;

  fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const latitude = data.results[0].lat;
        const longitude = data.results[0].lon;

        // Replace 'YOUR_SUNRISE_SUNSET_API_KEY' with your actual API key
        const apiKey = 'YOUR_SUNRISE_SUNSET_API_KEY';
        const sunriseSunsetUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=today&formatted=0&apiKey=${apiKey}`;

        fetch(sunriseSunsetUrl)
          .then(response => response.json())
          .then(sunriseSunsetData => {
            // Display sunrise and sunset data
            const infoContainer = document.getElementById('sunrise-sunset-info');
            infoContainer.innerHTML = `
              <p>Sunrise: ${new Date(sunriseSunsetData.results.sunrise).toLocaleTimeString()}</p>
              <p>Sunset: ${new Date(sunriseSunsetData.results.sunset).toLocaleTimeString()}</p>
              <!-- Add more information as needed -->
            `;
          })
          .catch(error => displayError("Error fetching sunrise sunset data"));
      } else {
        displayError("Location not found");
      }
    })
    .catch(error => displayError("Error fetching geocode data"));
}

function displayError(message) {
  const infoContainer = document.getElementById('sunrise-sunset-info');
  infoContainer.innerHTML = `<p class="error">${message}</p>`;
}
