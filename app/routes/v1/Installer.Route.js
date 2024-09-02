module.exports = function (app) {
	const InstallerController = app.controllers.Installer;

	app.get(
		"/installer/allow",
		[],
		InstallerController.allowInstallation
	);

	app.post(
		"/installer/migrate",
		[],
		InstallerController.startMigration
	);

	app.post(
		"/installer/create/administrator",
		[],
		InstallerController.createAdministrator
	);

	app.post(
		"/installer/update/database",
		[],
		InstallerController.updateDatabaseConnection
	);

	app.get(
		"/installer/check/database",
		[],
		InstallerController.checkDatabaseConnection
	);

	app.post(
		"/installer/update/redis",
		[],
		InstallerController.updateRedisConnection
	);

	app.get(
		"/installer/check/redis",
		[],
		InstallerController.checkRedisConnection
	);

};
