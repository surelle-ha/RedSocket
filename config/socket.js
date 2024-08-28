const http = require("http");
const redis = require("redis");
const { Server } = require("socket.io");

module.exports = (app) => {
  app.server = http.createServer(app);
  const io = new Server(app.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const redisClient = redis.createClient();
  const subscriber = redisClient.duplicate();
  const subscriptions = new Map();

  const connectRedisClients = async () => {
    try {
      await redisClient.connect();
      await subscriber.connect();

      subscriber.on('message', (channel, message) => {
        console.log(`Received message from Redis channel ${channel}:`, message);
        io.emit("redis_message", { channel, data: JSON.parse(message) });
      });

      io.on("connection", (socket) => {
        console.log("A client connected");

        socket.on("subscribe", async (channel) => {
          console.log(`Client subscribed to channel: ${channel}`);

          if (!subscriptions.has(socket.id)) {
            subscriptions.set(socket.id, []);
          }

          const clientSubscriptions = subscriptions.get(socket.id);

          if (!clientSubscriptions.includes(channel)) {
            clientSubscriptions.push(channel);
            await subscriber.subscribe(channel);
          }
        });

        socket.on("unsubscribe", async (channel) => {
          console.log(`Client unsubscribed from channel: ${channel}`);

          if (subscriptions.has(socket.id)) {
            const clientSubscriptions = subscriptions.get(socket.id);
            const index = clientSubscriptions.indexOf(channel);
            if (index !== -1) {
              clientSubscriptions.splice(index, 1);
              if (clientSubscriptions.length === 0) {
                await subscriber.unsubscribe(channel);
              }
            }
          }
        });

        socket.on("disconnect", () => {
          console.log("A client disconnected");
          const channels = subscriptions.get(socket.id);
          if (channels) {
            channels.forEach(async (channel) => {
              await subscriber.unsubscribe(channel);
            });
            subscriptions.delete(socket.id);
          }
        });
      });
    } catch (err) {
      console.error("Redis Connection Error:", err);
    }
  };

  connectRedisClients();
};
