function searchLocation() {
  const locationInput = document.getElementById('location');
  const location = locationInput.value;

  // Replace 'YOUR_OPENCAGE_API_KEY' with your actual OpenCage API key
  const geocodeApiKey = 'YOUR_OPENCAGE_API_KEY';
  const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${geocodeApiKey}`;

  fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const latitude = data.results[0].geometry.lat;
        const longitude = data.results[0].geometry.lng;

        // Replace 'YOUR_SUNRISE_SUNSET_API_KEY' with your actual API key
        const sunriseSunsetApiKey = 'YOUR_SUNRISE_SUNSET_API_KEY';
        const sunriseSunsetUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=today&formatted=0&key=${sunriseSunsetApiKey}`;

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
