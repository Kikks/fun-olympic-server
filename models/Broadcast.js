const { model, Schema } = require("mongoose");

const bradcastSchema = new Schema({
	name: String,
	category: {
		_id: String,
		name: String,
		airingTime: String,
		link: String
	},
	airingTime: String,
	link: String
});

module.exports = model("Broadcast", bradcastSchema);
