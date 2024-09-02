const uuid = require("uuid");
const { Model, DataTypes, UUIDV4 } = require("sequelize");

module.exports = function (sequelize) {
	class Event extends Model {}

	Event.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4,
			},
			channel: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			data: {
				type: DataTypes.JSON,
				allowNull: true,
			},
			timestamp: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Event",
			timestamps: true,
		}
	);

	return Event;
};
