require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const {
	validateLoginInput,
	validateRegisterAdmin,
	validateUploadRate
} = require("../utils/validators")
const mongoose = require("mongoose")
const Administrator = require("../models/Administrator")
const PendingUser = require("../models/PendingUser")
const User = require("../models/User")
const Rate = require("../models/Rate")
const Purchase = require("../models/Purchase")
const Sell = require("../models/Sell")

exports.adminLogin = async (req, res) => {
	const { email, password } = req.body

	const admin = await Administrator.findOne({ email })

	const { errors, valid } = validateLoginInput(email, password)

	if (!valid) return res.status(403).json(errors)

	if (!admin) {
		errors.general = "Admin not found."
		return res.status(400).json(errors)
	}

	const match = await bcrypt.compare(password, admin.password)
	if (!match) {
		errors.general = "Wrong Credentials"
		return res.status(403).json(errors)
	}

	const token = jwt.sign(
		{
			id: admin._id,
			firstName: admin.firstName,
			lastName: admin.lastName,
			email: admin.email,
			admin: admin.admin
		},
		process.env.SECRET_KEY,
		{ expiresIn: "1h" }
	)

	return res.status(201).json({ token })
}

exports.registerAdmin = async (req, res) => {
	const { firstName, lastName, email, password, confirmPassword } = req.body

	const existingAdmin = await Administrator.findOne({ email })

	const { errors, valid } = validateRegisterAdmin(
		firstName,
		lastName,
		password,
		confirmPassword,
		email
	)

	if (!valid) return res.status(400).json(errors)

	if (existingAdmin) {
		errors.general = "Admin with this email already exists"
		return res.status(400).json(errors)
	}

	const cryptPassword = await bcrypt.hash(password, 12)

	const newAdmin = new Administrator({
		firstName,
		lastName,
		email,
		password: cryptPassword,
		admin: true
	})

	const response = await newAdmin.save()
	const token = jwt.sign(
		{
			id: response._id,
			firstName: response.firstName,
			lastName: response.lastName,
			email: response.email,
			admin: response.admin
		},
		process.env.SECRET_KEY,
		{ expiresIn: "1h" }
	)

	return res.status(201).json({ token })
}

exports.verifyUser = async (req, res) => {
	const errors = {}
	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const { pendingUserId } = req.body
		const transformedId = mongoose.Types.ObjectId(pendingUserId)

		const pendingUser = await PendingUser.findById(transformedId)

		if (!pendingUser) {
			errors.general = "No user with this id is pending"
			return res.status(400).json(errors)
		}

		const newUser = new User({
			firstName: pendingUser.firstName,
			lastName: pendingUser.lastName,
			middleName: pendingUser.middleName,
			dob: pendingUser.dob,
			sex: pendingUser.sex,
			street: pendingUser.street,
			city: pendingUser.city,
			email: pendingUser.email,
			password: pendingUser.password,
			phoneNumber: pendingUser.phoneNumber,
			country: pendingUser.country,
			state: pendingUser.state,
			bank: pendingUser.bank,
			identification: pendingUser.identification,
			createdAt: new Date().toISOString()
		})

		await newUser.save()
		await pendingUser.delete()

		return res
			.status(201)
			.json({ message: `User ${newUser._id} has been created successfuly` })
	} catch (error) {
		errors = error
		return res.status(400).json(errors)
	}
}

exports.fetchUsers = async (req, res) => {
	const errors = {}
	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const users = await User.find({})

		return res.status(201).json(users)
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}

exports.fetchPendingUsers = async (req, res) => {
	const errors = {}
	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const pendingUsers = await PendingUser.find({})

		return res.status(201).json(pendingUsers)
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}

exports.fetchUser = async (req, res) => {
	const errors = {}
	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const transformedId = mongoose.Types.ObjectId(req.body.userId)
		const user = await User.findById(transformedId)
		if (!user) {
			errors.general = "No user with this id found."
			return res.status(400).json(errors)
		}

		return res.status(201).json(user)
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}

exports.deleteUser = async (req, res) => {
	const errors = {}
	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const transformedId = mongoose.Types.ObjectId(req.body.userId)
		const user = await User.findById(transformedId)
		if (!user) {
			errors.general = "No user with this id found."
			return res.status(400).json(errors)
		}

		await user.delete()

		return res
			.status(201)
			.json({ message: "User has been deleted Successfully" })
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}

exports.fetchPendingUser = async (req, res) => {
	const errors = {}
	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const transformedId = mongoose.Types.ObjectId(req.body.pendingUserId)
		const pendingUser = await PendingUser.findById(transformedId)
		if (!pendingUser) {
			errors.general = "No pending user with this id found."
			return res.status(400).json(errors)
		}

		return res.status(201).json(pendingUser)
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}

exports.deletePendingUser = async (req, res) => {
	const errors = {}
	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const transformedId = mongoose.Types.ObjectId(req.body.pendingUserId)
		const pendingUser = await PendingUser.findById(transformedId)
		if (!pendingUser) {
			errors.general = "No pending user with this id found."
			return res.status(400).json(errors)
		}

		await pendingUser.delete()

		return res.status(201).json("Pending user has been deleted successfully")
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}

exports.fetchPurchases = async (req, res) => {
	const errors = {}
	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const purchases = await Purchase.find({})

		return res.status(201).json(purchases)
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}

exports.fetchSales = async (req, res) => {
	const errors = {}
	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const sales = await Sell.find({})

		return res.status(201).json(sales)
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}

exports.fetchPurchase = async (req, res) => {
	const errors = {}
	const id = req.body.purchaseId
	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const transformedId = mongoose.Types.ObjectId(id)
		const purchase = await Purchase.findById(transformedId)

		if (!purchase) {
			errors.general = "No purchase with this id found."
			return res.status(400).json(errors)
		}

		return res.status(201).json(purchase)
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}

exports.fetchSale = async (req, res) => {
	const errors = {}

	const id = req.body.saleId

	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const transformedId = mongoose.Types.ObjectId(id)
		const sale = await Sell.findById(transformedId)

		if (!sale) {
			errors.general = "No sale with this id found."
			return res.status(400).json(errors)
		}

		return res.status(201).json(sale)
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}

exports.settleBuy = async (req, res) => {
	const errors = {}
	const id = req.body.purchaseId
	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const transformedId = mongoose.Types.ObjectId(id)

		const purchase = await Purchase.findOneAndUpdate(
			{ _id: transformedId },
			{
				status: "settled"
			},
			{ new: true }
		)

		await purchase.save()

		return res
			.status(201)
			.json({ message: "Purchase has been settled successfully" })
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}

exports.settleSell = async (req, res) => {
	const id = req.body.saleId
	const errors = {}
	try {
		if (!res.locals.admin) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const transformedId = mongoose.Types.ObjectId(id)

		const sale = await Sell.findOneAndUpdate(
			{ _id: transformedId },
			{
				status: "settled"
			},
			{ new: true }
		)

		await sale.save()

		return res
			.status(201)
			.json({ message: "Sale has been settled successfully" })
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}

exports.uploadRate = async (req, res) => {
	const { bitcoin, ethereum, paypal, webMoney, perfectMoney } = req.body

	const { errors, valid } = validateUploadRate(
		bitcoin,
		ethereum,
		paypal,
		webMoney,
		perfectMoney
	)

	if (!res.locals.admin) {
		errors.general = "Not Authorized"
		return res.status(403).json(errors)
	}

	try {
		if (!valid) return res.status(403).json(errors)

		const newRate = await Rate.findOneAndUpdate(
			{ _id: process.env.RATE_ID },
			{
				bitcoin,
				ethereum,
				paypal,
				webMoney,
				perfectMoney
			},
			{ new: true }
		)

		if (!newRate) {
			errors.general = "Contact Admin Immediately."
			return res.status(400).json(errors)
		}

		return res.status(201).json(newRate)
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
}
