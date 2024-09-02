module.exports = function (app) {
	const { Event } = app.models;

	const Controller = {
		name: "Event",
	};

	Controller.createEvent = async (req, res) => {
		try {
			const { channel, data, timestamp } = req.body;

			if (!channel || !timestamp) {
				return res.status(400).json({ error: "Missing required fields." });
			}

			const event = await Event.create({
				channel,
				data,
				timestamp,
			});

			return res.status(201).json({
				success: true,
				data: event,
			});
		} catch (error) {
			console.error("Error creating event:", error);
			return res.status(500).json({
				success: false,
				error: "An error occurred while creating the event.",
			});
		}
	};

	Controller.getChannels = async (req, res) => {
		try {
			const Channels = await Event.findAll({
				attributes: [
					[
						app.sequelize.fn("DISTINCT", app.sequelize.col("channel")),
						"channel",
					],
				],
			});
			return res.status(200).json({
				success: true,
				data: Channels,
			});
		} catch (error) {
			return res.status(500).json({
				success: false,
				error: "An error occurred while retrieving the channels.",
			});
		}
	};

	Controller.getEventCount = async (req, res) => {
		try {
			const count = await Event.count();
			return res.status(200).json({
				success: true,
				data: { count },
			});
		} catch (error) {
			console.error("Error counting events:", error);
			return res.status(500).json({
				success: false,
				error: "An error occurred while counting the events.",
			});
		}
	};

	Controller.getEventStatistics = async (req, res) => {
		try {
			// Query for per-hour statistics
			const [results] = await app.sequelize.query(`
				SELECT DATE_FORMAT(timestamp, '%Y-%m-%d %H:00:00') AS hour, 
					   channel, 
					   COUNT(*) AS count
				FROM Events
				GROUP BY hour, channel
				ORDER BY hour, channel
			`);
	
			// Query for distinct channels
			const [channelsResult] = await app.sequelize.query(`
				SELECT DISTINCT channel
				FROM Events
			`);
	
			// Process distinct channels
			const distinctChannels = channelsResult.map(row => row.channel);
	
			// Process per-hour statistics
			const statistics = {};
	
			results.forEach((result) => {
				if (!statistics[result.hour]) {
					statistics[result.hour] = {};
				}
				statistics[result.hour][result.channel] = result.count;
			});
	
			const formattedStatistics = Object.keys(statistics).map((hour) => {
				const entry = { hour };
				distinctChannels.forEach((channel) => {
					entry[channel] = statistics[hour] && statistics[hour][channel] ? statistics[hour][channel] : 0;
				});
				return entry;
			});
	
			return res.status(200).json({
				success: true,
				data: {
					statistics: formattedStatistics,
					channels: distinctChannels
				},
			});
		} catch (error) {
			console.error("Error retrieving event statistics:", error);
			return res.status(500).json({
				success: false,
				error: "An error occurred while retrieving event statistics.",
			});
		}
	};
	

	return Controller;
};
