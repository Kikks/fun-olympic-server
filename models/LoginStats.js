const { model, Schema } = require("mongoose");

const loginStatsScehma = new Schema({
	date: String,
	numberOfLogins: Number
});

module.exports = model("LoginStats", loginStatsScehma);
