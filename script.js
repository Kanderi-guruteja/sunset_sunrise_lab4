$(document).ready(function () {
  function fetchLocationCoordinates(location) {
    const geocodeApiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`;

    $.get(geocodeApiUrl)
      .done(function (geocodeData) {
        if (geocodeData.results && geocodeData.results.length > 0) {
          const { lat, lon } = geocodeData.results[0];
          const selectedDate = $("#dateSelector").val();
          fetchSunriseSunsetData(lat, lon, selectedDate);
        } else {
          displayError("Location not found.");
        }
      })
      .fail(function (error) {
        console.error("Geocode API Error:", error.status);
        displayError(`Geocode API Error: ${error.status}`);
      });
  }

  function fetchSunriseSunsetData(latitude, longitude, date) {
    const sunriseSunsetApiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=0&date=${date}`;

    $.get(sunriseSunsetApiUrl)
      .done(function (data) {
        if (data.results) {
          updateDashboard(data.results);
        } else {
          displayError("Sunrise Sunset data not available for the selected location.");
        }
      })
      .fail(function (error) {
        console.error("Sunrise Sunset API Error:", error.status);
        displayError(`Sunrise Sunset API Error: ${error.status}`);
      });
  }

  function updateDashboard(results) {
    const resultElement = $("#result");

    resultElement.html(`
      <h2>Sunrise Sunset Based on Location</h2>
      <p>Sunrise: ${results.sunrise}</p>
      <p>Sunset: ${results.sunset}</p>
      <p>Dawn: ${results.dawn}</p>
      <p>Dusk: ${results.dusk}</p>
      <p>Day Length: ${results.day_length}</p>
      <p>Solar Noon: ${results.solar_noon}</p>
      <p>Time Zone: ${results.timezone}</p>
    `);
  }

  function displayError(message) {
    const resultElement = $("#result");
    resultElement.html(`<p class="error-message">${message}</p>`);
  }

  $("#getCurrentLocation").click(function () {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude, longitude } = position.coords;
        const selectedDate = $("#dateSelector").val();
        fetchSunriseSunsetData(latitude, longitude, selectedDate);
      },
      function (error) {
        console.error("Geolocation Error:", error.message);
        displayError(`Geolocation Error: ${error.message}`);
      }
    );
  });

  $("#searchLocation").click(function () {
    const location = $("#locationInput").val();
    fetchLocationCoordinates(location);
  });

  $("#dateSelector").change(function () {
    const selectedDate = $("#dateSelector").val();
    const location = $("#locationInput").val();
    if (location) {
      fetchLocationCoordinates(location);
    }
  });
});
