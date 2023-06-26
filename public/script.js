function initializeMap() {
  const map = L.map('map').setView([0, 0], 2);
  const users = {};
  let routePolyline = null;
  let distancePolyline = null;
  let currentUserId = null;
  let control = null;
<<<<<<< HEAD
  let whatsappButton = null;
  let smsButton = null;
=======
>>>>>>> 12ac0c46cc9ea53ed9b59a8a0dce29c330509433

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);
<<<<<<< HEAD
  
  
  // Event listener for marker click events
  function handleMarkerClick(userId) {
    return function () {
      if (currentUserId && currentUserId !== userId) {
        const { lat: lat1, lon: lon1 } = users[currentUserId];
        const { lat: lat2, lon: lon2 } = users[userId];
        const distance = calculateDistance(lat1, lon1, lat2, lon2);
        console.log(`Distance between user ${currentUserId} and user ${userId}: ${distance} km`);

        // Display the distance on the page
        const distanceOutput = document.createElement('p');
        distanceOutput.textContent = `Distance: ${distance} km`;
        document.body.appendChild(distanceOutput);

=======

  // Event listener for marker click events
  function handleMarkerClick(userId) {
    return function () {
      if (currentUserId && currentUserId !== userId) {
        const { lat: lat1, lon: lon1 } = users[currentUserId];
        const { lat: lat2, lon: lon2 } = users[userId];
        const distance = calculateDistance(lat1, lon1, lat2, lon2);
        console.log(`Distance between user ${currentUserId} and user ${userId}: ${distance} km`);

        // Display the distance on the page
        const distanceOutput = document.createElement('p');
        distanceOutput.textContent = `Distance: ${distance} km`;
        document.body.appendChild(distanceOutput);

>>>>>>> 12ac0c46cc9ea53ed9b59a8a0dce29c330509433
        // Highlight the distance polyline
        if (distancePolyline) {
          map.removeLayer(distancePolyline);
        }
        distancePolyline = L.polyline([[lat1, lon1], [lat2, lon2]], { color: 'red' }).addTo(map);

        // Add the route calculation
        if (routePolyline) {
          map.removeLayer(routePolyline);
        }
        calculateRoute([lat1, lon1], [lat2, lon2]);
      }
    };
  }

  function calculateRoute(startPoint, endPoint) {
    if (control) {
      map.removeControl(control);
    }

    const lineOptions = { color: 'blue', opacity: 0.6, weight: 4 };

<<<<<<< HEAD
    L.Routing.control({
=======
    control = L.Routing.control({
>>>>>>> 12ac0c46cc9ea53ed9b59a8a0dce29c330509433
      waypoints: [
        L.latLng(startPoint[0], startPoint[1]),
        L.latLng(endPoint[0], endPoint[1])
      ],
      routeWhileDragging: true,
      lineOptions,
      createMarker: function () {
        return null;
      }
<<<<<<< HEAD
    }).addTo(map).on('routesfound', function (e) {
      const routes = e.routes;
      const route = routes[0];
      const coordinates = route.coordinates;

      if (routePolyline) {
        map.removeLayer(routePolyline);
      }

      routePolyline = L.polyline(coordinates, lineOptions).addTo(map);
    });
=======
    }).addTo(map);

    routePolyline = L.polyline([startPoint, endPoint], lineOptions).addTo(map);
>>>>>>> 12ac0c46cc9ea53ed9b59a8a0dce29c330509433
  }

  function updateUserLocation(userId, lat, lon) {
    console.log(`User ${userId} location: ${lat}, ${lon}`);

    // Send location update to the server via WebSocket
    const message = JSON.stringify({ userId, lat, lon });
    socket.send(message);

    // Update the user's location in the users object
    users[userId] = { lat, lon };

    if (currentUserId === userId) {
      // Create or update the marker for the current user
      let marker = users[currentUserId]?.marker;

      if (!marker) {
        marker = L.marker([lat, lon]).addTo(map);
        users[currentUserId].marker = marker;
      }

      marker.setLatLng([lat, lon]);
      marker.bindTooltip(userId, { permanent: true }).openTooltip(); // Display the user ID as a tooltip

      // Add click event listener to the marker
      marker.on('click', handleMarkerClick(userId));
    }

    // Remove the route polyline
    if (routePolyline) {
      map.removeLayer(routePolyline);
    }
  }

  map.on('locationfound', (e) => {
    const { lat, lng } = e.latlng;
    if (currentUserId) {
      updateUserLocation(currentUserId, lat, lng);
    }
  });

<<<<<<< HEAD
=======
  // Function to handle the button click event for calculating the route
  const calculateRouteBtn = document.createElement('button');
  calculateRouteBtn.textContent = 'Calculate Route';
  document.body.appendChild(calculateRouteBtn);

  // Event listener for the "Calculate Route" button
  calculateRouteBtn.addEventListener('click', () => {
    const startUserId = prompt('Enter the starting user ID');
    const endUserId = prompt('Enter the ending user ID');
    if (startUserId && endUserId) {
      const { lat: startLat, lon: startLon } = users[startUserId];
      const { lat: endLat, lon: endLon } = users[endUserId];
      calculateRoute([startLat, startLon], [endLat, endLon]);
    } else {
      console.log('Invalid user IDs entered.');
    }
  });
>>>>>>> 12ac0c46cc9ea53ed9b59a8a0dce29c330509433

  const startTrackingBtn = document.createElement('button');
  startTrackingBtn.textContent = 'Start Tracking';
  document.body.appendChild(startTrackingBtn);

  const userIdInput = document.createElement('input');
  userIdInput.type = 'text';
  userIdInput.placeholder = 'Enter User ID';
  document.body.appendChild(userIdInput);

  startTrackingBtn.addEventListener('click', () => {
    const enteredUserId = userIdInput.value;
    if (enteredUserId && !users[enteredUserId]) {
      if (currentUserId) {
        updateUserLocation(currentUserId, 0, 0);
      }
      currentUserId = enteredUserId;
      console.log(`Start tracking for user ID: ${currentUserId}`);
      map.locate({ setView: true, watch: true });
    } else {
      alert('User with the same ID already exists or no ID entered. Please choose a different ID.');
    }
  });

  // Function to handle the button click event for checking user location
  const checkLocationBtn = document.createElement('button');
  checkLocationBtn.textContent = 'Check Location';
  document.body.appendChild(checkLocationBtn);
<<<<<<< HEAD
  
  checkLocationBtn.addEventListener('click', () => {
  const inputUserId = prompt('Enter the desired user ID');

  if (inputUserId !== null && inputUserId !== '') {
    // Perform authorization before accessing the location
    const authorizationCode = prompt('Enter authorization code');

    if (authorizationCode === '1234') { // Replace '1234' with your desired authorization code
      console.log(`Checking location for user ID: ${inputUserId}`);
=======

  checkLocationBtn.addEventListener('click', () => {
    const inputUserId = prompt('Enter the desired user ID'); // Prompt the user to enter the desired user ID
    if (inputUserId !== null && inputUserId !== '') {
      console.log(`Checking location for user ID: ${inputUserId}`);
      // Send the desired user ID to the server or perform any desired action
      // You can modify this part according to your server-side implementation
>>>>>>> 12ac0c46cc9ea53ed9b59a8a0dce29c330509433

      // Remove existing markers from the map
      Object.values(users).forEach((user) => {
        if (user.marker) {
          map.removeLayer(user.marker);
        }
      });

      const desiredUser = users[inputUserId];
<<<<<<< HEAD

      if (desiredUser) {
        const { lat, lon } = desiredUser;
        console.log(`Desired user ${inputUserId} location: ${lat}, ${lon}`);

        // Set the view of the map to the desired user's location with a zoom level of 14 and enable animation
        map.setView([lat, lon], 14, { animate: true });
=======
      if (desiredUser) {
        const { lat, lon } = desiredUser;
        console.log(`Desired user ${inputUserId} location: ${lat}, ${lon}`);
        map.setView([lat, lon], 14, { animate: true }); // Set the view of the map to the desired user's location with a zoom level of 14 and enable animation
>>>>>>> 12ac0c46cc9ea53ed9b59a8a0dce29c330509433

        // Create a marker for the desired user
        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindTooltip(inputUserId, { permanent: true }).openTooltip(); // Display the user ID as a tooltip
        users[inputUserId].marker = marker;
      } else {
        console.log(`User ${inputUserId} not found.`);
        // Display an error message on the page
        const errorOutput = document.createElement('p');
        errorOutput.textContent = `User ${inputUserId} not found.`;
        document.body.appendChild(errorOutput);
      }
<<<<<<< HEAD
    } else {
      console.log('Invalid authorization code.');
    }
  }
});

  

  // Function to handle the button click event for calculating the route
  const calculateRouteBtn = document.createElement('button');
  calculateRouteBtn.textContent = 'Calculate Route';
  document.body.appendChild(calculateRouteBtn);

  calculateRouteBtn.addEventListener('click', () => {
    // Perform authorization before calculating the route
    const authorizationCode = prompt('Enter authorization code');
    if (authorizationCode === '1234') { // Replace '1234' with your desired authorization code
      const startUserId = prompt('Enter the starting user ID');
      const endUserId = prompt('Enter the ending user ID');
      if (startUserId && endUserId) {
        const { lat: startLat, lon: startLon } = users[startUserId];
        const { lat: endLat, lon: endLon } = users[endUserId];
        calculateRoute([startLat, startLon], [endLat, endLon]);
      } else {
        console.log('Invalid user IDs entered.');
      }
    } else {
      console.log('Invalid authorization code.');
    }
  })
  
  // Function to handle the button click event for using the app as normal maps
  const useAsNormalMapsBtn = document.createElement('button');
  useAsNormalMapsBtn.textContent = 'Search Location';
  document.body.appendChild(useAsNormalMapsBtn);

  useAsNormalMapsBtn.addEventListener('click', () => {
    const locationName = prompt('Enter a location name'); // Prompt the user to enter the desired location name
    if (locationName !== null && locationName !== '') {
      // Use a geocoding service to convert the location name to coordinates
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`;

      fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            if (!isNaN(lat) && !isNaN(lon)) {
              map.setView([lat, lon], 14, { animate: true }); // Set the view of the map to the desired location with a zoom level of 14 and enable animation
            } else {
              console.log('Invalid location coordinates.');
            }
          } else {
            console.log('Location not found.');
          }
        })
        .catch(error => {
          console.log('Error retrieving location data:', error);
        });
    }
  });
  
  let compassElement;

  function initializeMap() {
    // Initialize your map instance here
    // Replace the following line with your own map initialization code
    map = L.map('map');

    // Add map layers, set view, etc.
  }

  function toggleCompassControl() {
    compassElement = document.getElementById('compass');

    if (!compassElement) {
      // Create the compass element
      compassElement = document.createElement('div');
      compassElement.id = 'compass';
      compassElement.classList.add('leaflet-control');
      compassElement.innerHTML = 'N';

      // Add the compass element to the map
      map._controlContainer.appendChild(compassElement);

      // Request access to geolocation and track position and orientation changes
      if (navigator.geolocation && window.DeviceOrientationEvent) {
        navigator.geolocation.watchPosition(handlePositionUpdate, handlePositionError, {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 30000
        });

        window.addEventListener('deviceorientation', handleOrientationUpdate);
      } else {
        alert('Geolocation or device orientation is not supported by your browser.');
      }
    } else {
      // Remove the compass element
      compassElement.parentNode.removeChild(compassElement);
      compassElement = null;
    }
  }

  function handlePositionUpdate(position) {
    if (compassElement) {
      const { latitude, longitude } = position.coords;

      // Calculate the bearing angle between current location and north
      const bearing = calculateBearing(latitude, longitude);

      // Adjust compass rotation based on the bearing angle
      compassElement.style.transform = `rotate(${360 - bearing}deg)`;

      // Update map center and zoom to the current location
      map.setView([latitude, longitude], 15);
    }
  }

  function calculateBearing(latitude, longitude) {
    const destinationLatitude = 90; // North pole latitude
    const destinationLongitude = 0; // North pole longitude

    const phi1 = latitude * (Math.PI / 180);
    const phi2 = destinationLatitude * (Math.PI / 180);
    const deltaLambda = (destinationLongitude - longitude) * (Math.PI / 180);

    const y = Math.sin(deltaLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360; // Normalize bearing to 0-360 degrees

    return bearing;
  }

  function handlePositionError(error) {
    alert(`Error accessing geolocation: ${error.message}`);
  }

  function handleOrientationUpdate(event) {
    if (compassElement) {
      const { alpha } = event;

      // Adjust compass rotation based on device orientation
      compassElement.style.transform = `rotate(${360 - alpha}deg)`;
    }
  }

  // Button to toggle the compass control
  const toggleCompassBtn = document.createElement('button');
  toggleCompassBtn.textContent = 'Compass';
  document.body.appendChild(toggleCompassBtn);

  toggleCompassBtn.addEventListener('click', () => {
    toggleCompassControl();
  });

  
  // Function to handle the button click event for sharing location details
  const shareLocationBtn = document.createElement('button');
  shareLocationBtn.textContent = 'Share Location';
  document.body.appendChild(shareLocationBtn);

  shareLocationBtn.addEventListener('click', () => {
  if (currentUserId) {
    const { lat, lon } = users[currentUserId];
    const locationLink = `https://www.google.com/maps?q=${lat},${lon}`;
    const message = `Check out my location: ${locationLink}`;

    // Share via WhatsApp
    if (!whatsappButton) {
      const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      whatsappButton = createShareButton('Share via WhatsApp', whatsappLink);
      document.body.appendChild(whatsappButton);
    }

    // Share via SMS
    if (!smsButton) {
      const smsLink = `sms:?body=${encodeURIComponent(message)}`;
      smsButton = createShareButton('Share via SMS', smsLink);
      document.body.appendChild(smsButton);
    }
  } else {
    alert('No user is currently being tracked. Please start tracking a user first.');
  }
});

function createShareButton(label, link) {
  const button = document.createElement('button');
  button.textContent = label;
  button.addEventListener('click', () => {
    window.open(link);
  });
  return button;
}




=======
    }
  });

  // Function to handle the button click event for calculating distance
  const distanceBtn = document.createElement('button');
  distanceBtn.textContent = 'Calculate Distance';
  document.body.appendChild(distanceBtn);

  // Event listener for the "Calculate Distance" button
  distanceBtn.addEventListener('click', () => {
    const desiredUserId = prompt('Enter the desired user ID');
    if (desiredUserId !== null && desiredUserId !== '') {
      console.log(`Calculating distance for user ID: ${desiredUserId}`);
      const desiredUser = users[desiredUserId];
      if (desiredUser) {
        const { lat: lat1, lon: lon1 } = users[currentUserId];
        const { lat: lat2, lon: lon2 } = desiredUser;
        const distance = calculateDistance(lat1, lon1, lat2, lon2);
        console.log(`Distance between user ${currentUserId} and user ${desiredUserId}: ${distance} km`);

        // Display the distance on the page
        const distanceOutput = document.createElement('p');
        distanceOutput.textContent = `Distance between user ${currentUserId} and user ${desiredUserId}: ${distance} km`;
        document.body.appendChild(distanceOutput);

        // Highlight the distance polyline
        if (distancePolyline) {
          map.removeLayer(distancePolyline);
        }
        distancePolyline = L.polyline([[lat1, lon1], [lat2, lon2]], { color: 'red' }).addTo(map);
      } else {
        console.log(`User ${desiredUserId} not found.`);
        // Display an error message on the page
        const errorOutput = document.createElement('p');
        errorOutput.textContent = `User ${desiredUserId} not found.`;
        document.body.appendChild(errorOutput);
      }
    }
  });

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance.toFixed(2);
  }

  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

>>>>>>> 12ac0c46cc9ea53ed9b59a8a0dce29c330509433
  // WebSocket connection
  const socket = new WebSocket('wss://find-me-now.glitch.me/'); // Replace with your Glitch project URL;

  socket.addEventListener('open', () => {
    console.log('WebSocket connection established');
  });

  socket.addEventListener('message', (event) => {
    const { userId, lat, lon } = JSON.parse(event.data);
    if (userId !== currentUserId) {
      console.log(`Location update received for user ID: ${userId}`);
      updateUserLocation(userId, lat, lon);
    }
  });

  socket.addEventListener('close', () => {
    console.log('WebSocket connection closed');
  });
}

// Add the script tag to the HTML document
const scriptTag = document.createElement('script');
scriptTag.textContent = initializeMap.toString() + '; initializeMap();';
<<<<<<< HEAD
document.body.appendChild(scriptTag);
=======
document.body.appendChild(scriptTag);
>>>>>>> 12ac0c46cc9ea53ed9b59a8a0dce29c330509433
