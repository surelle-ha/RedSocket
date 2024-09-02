const express = require("express");
const http = require("http");
const cors = require("cors");
const redis = require("redis");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

let connectedClients = 0;
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
	url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});
const subscriptions = new Map();

const connectRedisClients = async () => {
	try {
		await client
			.on("error", (err) => console.log("Redis Client Error:", err))
			.connect();

		const subscriber = client.duplicate();
		await subscriber.connect();

		io.on("connection", (socket) => {
			console.log("A client connected");
			connectedClients++;

			io.emit("updateClientCount", connectedClients);

			socket.on("subscribe", async (channel) => {
				console.log(`Client subscribed to channel: ${channel}`);

				if (!subscriptions.has(socket.id)) {
					subscriptions.set(socket.id, []);
				}

				const clientSubscriptions = subscriptions.get(socket.id);

				if (!clientSubscriptions.includes(channel)) {
					clientSubscriptions.push(channel);

					await subscriber.pSubscribe(channel, (message, channel) => {
						console.log(
							`Received message from Redis channel ${channel}:`,
							message
						);
						try {
							const parsedMessage = JSON.parse(message);
							socket.emit("redis_message", { channel, data: parsedMessage });
						} catch (e) {
							console.error("Error parsing message:", e);
						}
					});
				}
			});

			socket.on("unsubscribe", async (channel) => {
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

			socket.on("disconnect", () => {
				connectedClients--;
				console.log("A client disconnected");
				io.emit("updateClientCount", connectedClients);
				subscriptions.delete(socket.id);
			});
		});
	} catch (err) {
		console.error("Redis Connection Error:", err);
	}
};

connectRedisClients();

app.use(cors());

server.listen(4000, () => {
	console.log("Server is running on port 4000");
});
