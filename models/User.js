const { model, Schema } = require("mongoose");

const userSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	createdAt: String,
	broadcasts: [String],
	lastLogin: String,
	lastLogout: String
});

module.exports = model("User", userSchema);
