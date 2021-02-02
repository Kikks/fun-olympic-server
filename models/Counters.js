const { model, Schema } = require("mongoose")

const countersSchema = new Schema({
	fairDollar: Number,
	forexBeta: Number
})

module.exports = model("Counters", countersSchema)
