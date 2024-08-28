require("module-alias/register");
const express = require("express");
const path = require("path");
const compression = require("compression");
const responseTime = require("response-time");

/* Setup Express Application */
const config = require("@/zentinel.config.js").config;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(responseTime());

app.use("/", express.static("public"));

require("@config/environments")(app);
if (config.storage) require("@config/storage.js")(app);
if (config.mailer) require("@config/mailer.js")(app);
if (config.monitor) require("@config/monitor.js")(app);
if (config.database) require("@config/database.js")(app);
if (config.ratelimiter) require("@config/ratelimiter")(app);
if (config.helmet) require("@config/helmet")(app);
if (config.cors) require("@config/cors")(app);
if (config.logger) require("@config/logger")(app);
if (config.cache) require("@config/cache")(app);
if (config.prometheus) require("@config/prometheus")(app);
require("@config/maintenance")(app);
require("@config/bootstrap")(app);
require("@config/exception")(app);
require("@config/socket")(app);

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = app;
