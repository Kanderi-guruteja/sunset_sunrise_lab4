$(document).ready(function () {
    function getLatLongFromLocation(location) {
      const geocodeApiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(
        location
      )}`;
  
      $.ajax({
        url: geocodeApiUrl,
        method: "GET",
        success: function (geocodeData) {
          const results = geocodeData;
          console.log(results);
  
          if (results && results.length > 0) {
            const firstResult = results[0];
            const latitude = firstResult.lat;
            const longitude = firstResult.lon;
            const selectedDate = $("#dateSelector").val();
            getSunriseSunset(latitude, longitude, selectedDate);
          } else {
            showError("Location not found.");
          }
        },
        error: function (error) {
          showError(`Geocode API Error: ${error.responseJSON.status}`);
        },
      });
    }
  
    function getSunriseSunset(latitude, longitude, date) {
      const sunriseSunsetApiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=0&date=${date}`;
  
      $.ajax({
        url: sunriseSunsetApiUrl,
        method: "GET",
        success: function (data) {
          updateDashboard(data.results);
        },
        error: function (error) {
          showError(`Sunrise Sunset API Error: ${error.responseJSON.status}`);
        },
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
  
    function showError(message) {
      const resultElement = $("#result");
      resultElement.html(`<p class="error-message">${message}</p>`);
    }
  
    $("#getCurrentLocation").click(function () {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const selectedDate = $("#dateSelector").val();
          getSunriseSunset(latitude, longitude, selectedDate);
        },
        function (error) {
          showError(`Geolocation Error: ${error.message}`);
        }
      );
    });
  
    $("#searchLocation").click(function () {
      const location = $("#locationInput").val();
      getLatLongFromLocation(location);
    });
  
    $("#dateSelector").change(function () {
      const selectedDate = $("#dateSelector").val();
      const location = $("#locationInput").val();
      if (location) {
        getLatLongFromLocation(location);
      }
    });
  });
  
