const { model, Schema } = require("mongoose")

const pendingUserSchema = new Schema({
	firstName: String,
	middleName: String,
	lastName: String,
	dob: String,
	sex: String,
	phoneNumber: String,
	altPhoneNumber: String,
	street: String,
	city: String,
	state: String,
	country: String,
	email: String,
	password: String,
	bank: {
		name: String,
		acctNo: Number,
		acctName: String
	},
	identification: String,
	createdAt: String
})

module.exports = model("PendingUser", pendingUserSchema)
