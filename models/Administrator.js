const { model, Schema } = require("mongoose")

const adminSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	admin: Boolean
})

module.exports = model("Administrator", adminSchema)
