function searchLocation() {
  const locationInput = document.getElementById('location');
  const location = locationInput.value;

  // Geocode API without an API key
  const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}`;

  fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const latitude = data.results[0].geometry.lat;
        const longitude = data.results[0].geometry.lng;

        // Sunrise Sunset API without an API key
        const sunriseSunsetUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=today&formatted=0`;

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
