function getLocationCoordinates(address) {
  if (address) {
    // Forward geocoding for specified address
    const params = {
      q: address,
      format: 'json'
    };

    const url = new URL('https://geocode.maps.co/search');
    url.search = new URLSearchParams(params).toString();

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Geocoding data:', data);

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
        console.error('Error fetching coordinates from geocoding:', error);
      });
  } else {
    // Reverse geocoding for current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          console.log('Current location coordinates:', { latitude, longitude });

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
