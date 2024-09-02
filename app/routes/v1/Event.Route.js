module.exports = function (app) {
	const EventController = app.controllers.Event;

	app.post(
		"/api/v1/event",
		[],
		EventController.createEvent
	);

	app.get(
		"/api/v1/event/count",
		[],
		EventController.getEventCount
	);
	
	app.get(
		"/api/v1/event/statistics",
		[],
		EventController.getEventStatistics
	)

	app.get(
		"/api/v1/event/channels",
		[],
		EventController.getChannels
	);

};
