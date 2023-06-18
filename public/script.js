function initializeMap() {
  const map = L.map('map').setView([0, 0], 2);
  const users = {};
  let routePolyline = null;
  let distancePolyline = null;
  let currentUserId = null;
  let control = null;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

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

    control = L.Routing.control({
      waypoints: [
        L.latLng(startPoint[0], startPoint[1]),
        L.latLng(endPoint[0], endPoint[1])
      ],
      routeWhileDragging: true,
      lineOptions,
      createMarker: function () {
        return null;
      }
    }).addTo(map);

    routePolyline = L.polyline([startPoint, endPoint], lineOptions).addTo(map);
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

  checkLocationBtn.addEventListener('click', () => {
    const inputUserId = prompt('Enter the desired user ID'); // Prompt the user to enter the desired user ID
    if (inputUserId !== null && inputUserId !== '') {
      console.log(`Checking location for user ID: ${inputUserId}`);
      // Send the desired user ID to the server or perform any desired action
      // You can modify this part according to your server-side implementation

      // Remove existing markers from the map
      Object.values(users).forEach((user) => {
        if (user.marker) {
          map.removeLayer(user.marker);
        }
      });

      const desiredUser = users[inputUserId];
      if (desiredUser) {
        const { lat, lon } = desiredUser;
        console.log(`Desired user ${inputUserId} location: ${lat}, ${lon}`);
        map.setView([lat, lon], 14, { animate: true }); // Set the view of the map to the desired user's location with a zoom level of 14 and enable animation

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
document.body.appendChild(scriptTag);
