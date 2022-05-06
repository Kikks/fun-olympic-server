const { model, Schema } = require("mongoose");

const bradcastSchema = new Schema({
	name: String
});

module.exports = model("Broadcast", bradcastSchema);
