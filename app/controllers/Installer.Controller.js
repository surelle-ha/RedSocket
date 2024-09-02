const fs = require("fs");
const os = require("os");
const redis = require('redis');
const { execSync } = require('child_process');
const bcrypt = require("bcrypt");
const saltRounds = 10;

function setEnv(key, value) {
	const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);
	const target = ENV_VARS.indexOf(
		ENV_VARS.find((line) => {
			return line.match(new RegExp(key));
		})
	);
	ENV_VARS.splice(target, 1, `${key}=${value}`);
	fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));
}

module.exports = function (app) {
	const { User } = app.models;
	const Controller = {
		name: "Installer",
	};

	Controller.allowInstallation = async (req, res) => {
		const ReqIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		console.log(ReqIP === app.env.ADMIN_IP)
		return res.status(200).json({ allowed: ReqIP === app.env.ADMIN_IP });
	}

	Controller.startMigration = async (req, res) => {
		try {
            execSync('npm run db:reset', { stdio: 'inherit' });
            return res.status(200).json({ message: 'Database reset completed successfully.' });
        } catch (error) {
            return res.status(500).json({ error: 'Database reset failed.', details: error.message });
        }
	}

	Controller.createAdministrator = async (req, res) => {
		try {
			const existingUser = await User.findOne({
				where: { email: req.body.email },
			});
			if (existingUser) {
				return res
					.status(400)
					.send({ status: "error", message: "Email already registered" });
			}

			bcrypt.hash(
				req.body.password,
				saltRounds,
				async function (err, hashedPassword) {
					if (err) {
						return res
							.status(500)
							.send({
								status: "error",
								message: "Error hashing password",
								message: err.message,
							});
					}

					const userData = {
						...req.body,
						role_id: 1,
						email_verified: true,
						status: "Active",
						password: hashedPassword,
					};
					const result = await User.create(userData);
					res
						.status(201)
						.send({
							status: "success",
							message: "Successfully registered your account.",
							userData: result,
						});
				}
			);
		} catch (err) {
			console.error(error);
			return res
				.status(500)
				.send({ status: "error", message: error.message });
		}
	}

	Controller.updateDatabaseConnection = async (req, res) => {
		setEnv("DATABASE_HOST", req.body.DATABASE_HOST);
		setEnv("DATABASE_PORT", req.body.DATABASE_PORT);
		setEnv("DATABASE_NAME", req.body.DATABASE_NAME);
		setEnv("DATABASE_USER", req.body.DATABASE_USER);
		setEnv("DATABASE_PASS", req.body.DATABASE_PASS);
		fs.writeFileSync("./null.js", "1");
	};

	Controller.checkDatabaseConnection = async (req, res) => {
		try {
			await app.sequelize.authenticate();
			return res.status(200).json({
				connection: 1,
				message: "Database connection successful.",
			});
		} catch (error) {
			return res.status(200).json({
				connection: 0,
				message:
					"Database connection failed. Please check the database server.",
			});
		}
	};

	Controller.updateRedisConnection = async (req, res) => {
		setEnv("REDIS_HOST", req.body.REDIS_HOST);
		setEnv("REDIS_PORT", req.body.REDIS_PORT);
		fs.writeFileSync("./null.js", "1");
	};

	Controller.checkRedisConnection = async (req, res) => {
		try {
			const client = redis.createClient({
				url: `redis://${app.env.REDIS_HOST}:${app.env.REDIS_PORT}`,
			});
			const subscriber = client.duplicate();
    		await subscriber.connect();
			return res.status(200).json({
				connection: 1,
				message: "Redis connection successful.",
			});
		} catch (error) {
			return res.status(200).json({
				connection: 0,
				message:
					"Redis connection failed. Please check the Redis server.",
			});
		}
	};

	return Controller;
};
