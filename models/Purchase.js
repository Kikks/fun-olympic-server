const { model, Schema } = require("mongoose")

const purchaseSchema = new Schema({
	amount: Number,
	platform: String,
	walletId: String,
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

module.exports = model("Purchase", purchaseSchema)
