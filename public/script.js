const map = L.map('map').setView([0, 0], 2);
const users = {};
let distancePolyline = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

function updateUserMarker(userId, lat, lon) {
  let marker = users[userId]?.marker;

  if (!marker) {
    marker = L.marker([lat, lon]).addTo(map);
    users[userId] = { marker };
  }

  marker.setLatLng([lat, lon]);
  marker.off('click'); // Remove previous click event handler
  marker.on('click', () => {
    if (distancePolyline) {
      map.removeLayer(distancePolyline);
    }
    const { lat: lat1, lon: lon1 } = users[currentUserId];
    const { lat: lat2, lon: lon2 } = users[userId];
    distancePolyline = L.polyline([[lat1, lon1], [lat2, lon2]], { color: 'red' }).addTo(map);
  });
}

function updateUserLocation(userId, lat, lon) {
  updateUserMarker(userId, lat, lon);
  console.log(`User ${userId} location: ${lat}, ${lon}`);

  // Send location update to the server via WebSocket
  const message = JSON.stringify({ userId, lat, lon });
  socket.send(message);
}

let currentUserId = null;

map.on('locationfound', (e) => {
  const { lat, lng } = e.latlng;
  if (currentUserId) {
    updateUserLocation(currentUserId, lat, lng);
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
  currentUserId = userIdInput.value;
  console.log(`Start tracking for user ID: ${currentUserId}`);
  map.locate({ setView: true, watch: true });
});

// Function to handle the button click event for checking user location
const checkLocationBtn = document.createElement('button');
checkLocationBtn.textContent = 'Check Location';
document.body.appendChild(checkLocationBtn);

checkLocationBtn.addEventListener('click', () => {
  const desiredUserId = prompt('Enter the desired user ID'); // Prompt the user to enter the desired user ID
  if (desiredUserId !== null && desiredUserId !== '') {
    console.log(`Checking location for user ID: ${desiredUserId}`);
    // Send the desired user ID to the server or perform any desired action
    // You can modify this part according to your server-side implementation
    console.log('Desired User ID:', desiredUserId);
  }
});

// Function to handle the button click event for calculating distance
const distanceBtn = document.createElement('button');
distanceBtn.textContent = 'Calculate Distance';
document.body.appendChild(distanceBtn);

// Function to calculate the distance between two sets of coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance.toFixed(2); // Round the distance to 2 decimal places
}

// Helper function to convert degrees to radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

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
      distanceOutput.textContent = `Distance: ${distance} km`;
      document.body.appendChild(distanceOutput);

      // Highlight the distance polyline
      if (distancePolyline) {
        map.removeLayer(distancePolyline);
      }
      distancePolyline = L.polyline([[lat1, lon1], [lat2, lon2]], { color: 'red' }).addTo(map);
    } else {
      console.log(`User ${desiredUserId} not found.`);
    }
  }
});

// WebSocket connection
const socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}`);

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
