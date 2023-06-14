const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// Broadcast location updates to all connected clients
function broadcastLocation(userId, lat, lon) {
  const message = JSON.stringify({ userId, lat, lon });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const { userId, lat, lon } = JSON.parse(message);
    broadcastLocation(userId, lat, lon);
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});
