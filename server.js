const express = require('express');
const http = require('http');
const cors = require('cors');
const redis = require('redis');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
});

const client = redis.createClient();
const subscriptions = new Map(); // Keeps track of active subscriptions for each client

const connectRedisClients = async () => {
  try {
    await client.on('error', err => console.log('Redis Client Error:', err)).connect();

    const subscriber = client.duplicate();
    await subscriber.connect();

    io.on('connection', (socket) => {
      console.log('A client connected');

      socket.on('subscribe', async (channel) => {
        console.log(`Client subscribed to channel: ${channel}`);

        if (!subscriptions.has(socket.id)) {
          subscriptions.set(socket.id, []);
        }

        const clientSubscriptions = subscriptions.get(socket.id);

        if (!clientSubscriptions.includes(channel)) {
          clientSubscriptions.push(channel);

          await subscriber.pSubscribe(channel, (message, channel) => {
            console.log(`Received message from Redis channel ${channel}:`, message);
            try {
              const parsedMessage = JSON.parse(message);
              socket.emit('redis_message', { channel, data: parsedMessage });
            } catch (e) {
              console.error('Error parsing message:', e);
            }
          });
        }
      });

      socket.on('unsubscribe', async (channel) => {
        console.log(`Client unsubscribed from channel: ${channel}`);

        if (subscriptions.has(socket.id)) {
          const clientSubscriptions = subscriptions.get(socket.id);
          const index = clientSubscriptions.indexOf(channel);
          if (index !== -1) {
            clientSubscriptions.splice(index, 1);
            await subscriber.pUnsubscribe(channel);
          }
        }
      });

      socket.on('disconnect', () => {
        console.log('A client disconnected');
        subscriptions.delete(socket.id);
      });
    });

  } catch (err) {
    console.error('Redis Connection Error:', err);
  }
};

// Start Redis connection
connectRedisClients();

// Enable CORS for Express routes
app.use(cors());

// Serve a simple EJS template
app.get('/', (req, res) => {
  res.render('index', { message: 'Server is running' });
});

// Static files (if needed)
app.use(express.static('public'));

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
