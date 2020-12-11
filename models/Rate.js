const { model, Schema } = require("mongoose")

const rateSchema = new Schema({
	bitcoin: {
		buy: Number,
		sell: Number
	},
	ethereum: {
		buy: Number,
		sell: Number
	},
	paypal: {
		buy: Number,
		sell: Number
	},
	webMoney: {
		buy: Number,
		sell: Number
	},
	perfectMoney: {
		buy: Number,
		sell: Number
	}
})

module.exports = model("Rate", rateSchema)
