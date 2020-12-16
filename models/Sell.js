const { model, Schema } = require("mongoose")

const sellSchema = new Schema({
	amount: Number,
	platform: String,
	status: String,
	firstName: String,
	middleName: String,
	lastName: String,
	email: String,
	bank: {
		name: String,
		acctNo: String,
		acctName: String
	}
})

module.exports = model("Sell", sellSchema)
