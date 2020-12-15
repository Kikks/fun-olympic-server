require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const cloudinary = require("cloudinary").v2
const https = require("https")

const User = require("../models/User")
const PendingUser = require("../models/PendingUser")
const Purchase = require("../models/Purchase")
const Sell = require("../models/Sell")
const {
	validateRegisterInput,
	validateLoginInput,
	validateBuy,
	validateSell
} = require("../utils/validators")
const Rate = require("../models/Rate")

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: "627375688893861",
	api_secret: process.env.CLOUDINARY_SECRET
})

exports.register = async (req, res) => {
	const existingUser = await User.findOne({ email: req.body.email })
	const {
		firstName,
		lastName,
		middleName,
		dob,
		sex,
		street,
		city,
		email,
		password,
		confirmPassword,
		phoneNumber,
		altPhoneNumber,
		country,
		state,
		bank,
		identification
	} = req.body
	const { errors, valid } = validateRegisterInput(
		firstName,
		lastName,
		middleName,
		dob,
		sex,
		street,
		city,
		email,
		password,
		confirmPassword,
		phoneNumber,
		country,
		state,
		bank,
		identification
	)

	if (!valid) return res.status(403).json(errors)

	if (existingUser) {
		errors.general = "A user with that email already exisits."
		return res.status(400).json(errors)
	}

	const cryptPassword = await bcrypt.hash(password, 12)

	const pendingUser = new PendingUser({
		firstName,
		lastName,
		middleName,
		dob,
		sex,
		street,
		city,
		email,
		password: cryptPassword,
		phoneNumber,
		altPhoneNumber: altPhoneNumber ? altPhoneNumber : "",
		country,
		state,
		bank,
		identification,
		createdAt: new Date().toISOString()
	})

	const response = await pendingUser.save()
	const token = jwt.sign(
		{
			id: response._id,
			firstName: response.firstName,
			lastName: response.lastName,
			middleName: response.middleName,
			email: response.email,
			bank: response.bank
		},
		process.env.SECRET_KEY,
		{ expiresIn: "5h" }
	)

	return res.status(201).json({ token, id: response._id })
}

exports.login = async (req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ email })
	const pendingUser = await PendingUser.findOne({ email })

	const { errors, valid } = validateLoginInput(email, password)

	if (!valid) return res.status(403).json(errors)

	if (!user && pendingUser) {
		errors.general = "User not verified yet. Try again later."
		return res.status(400).json(errors)
	} else if (!user && !pendingUser) {
		errors.general = "User not found"
		return res.status(400).json(errors)
	}

	const match = await bcrypt.compare(password, user.password)
	if (!match) {
		errors.general = "Wrong Credentials"
		return res.status(403).json(errors)
	}

	const token = jwt.sign(
		{
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			middleName: user.middleName,
			email: user.email,
			bank: user.bank
		},
		process.env.SECRET_KEY,
		{ expiresIn: "5h" }
	)

	return res.status(201).json({ token, id: user._id })
}

exports.uploadImage = (req, res) => {
	const targetFile = req.files.image
	const path = require("path")
	const fs = require("fs")
	const extName = path.extname(targetFile.name)
	const errors = {}

	const imgList = [".png", ".jpg", ".jpeg"]
	// Checking the file type
	if (!imgList.includes(extName)) {
		fs.unlinkSync(targetFile.tempFilePath)
		errors.identification = "Invalid File format"
		return res.status(422).json(errors)
	}

	if (targetFile.size > 2048576) {
		fs.unlinkSync(targetFile.tempFilePath)
		errors.identification = "File is too large. Max size of upload should be 2mb"
		return res.status(413).json(errors)
	}

	try {
		cloudinary.uploader.upload(targetFile.tempFilePath, function (err, image) {
			if (err) {
				console.log(err)
			}

			fs.unlinkSync(targetFile.tempFilePath)
			return res.status(201).json({ url: image.secure_url })
		})
	} catch (error) {
		errors.identification = "Something went wrong. Try again."
		return res.status(400).json(errors)
	}
}

exports.verifyPayment = async (req, res) => {
	try {
		if (!res.locals.user) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const { reference } = req.body

		const options = {
			hostname: "api.paystack.co",
			port: 443,
			path: `/transaction/verify/:${reference}`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
			}
		}
		https
			.request(options, resp => {
				let data = ""
				resp.on("data", chunk => {
					data += chunk
				})
				resp.on("end", () => {
					return res.status(201).json(data)
				})
			})
			.on("error", error => {
				return res.status(400).json({ error, message: "Something's not right" })
			})
	} catch (error) {
		console.log(error)
	}
}

exports.buy = async (req, res) => {
	try {
		if (!res.locals.user) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const { amount, platform, walletId } = req.body

		const { errors, valid } = validateBuy(amount, platform, walletId)

		if (!valid) return res.status(403).json(errors)

		const user = await User.findOne({ email: res.locals.user.email })
		const { firstName, middleName, lastName, bank } = user
		const newBuy = new Purchase({
			amount,
			platform,
			walletId,
			firstName,
			middleName,
			lastName,
			bank,
			status: "not settled"
		})

		await newBuy.save()
		return res.status(201).json({ message: "Request sent successfuly" })
	} catch (error) {
		return res.status(400).json({ error, message: "Something went wrong" })
	}
}

exports.buy = async (req, res) => {
	try {
		if (!res.locals.user) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const { amount, platform, walletId } = req.body

		const { errors, valid } = validateBuy(amount, platform, walletId)

		if (!valid) return res.status(403).json(errors)

		const user = await User.findOne({ email: res.locals.user.email })
		const { firstName, middleName, lastName, bank } = user
		const newBuy = new Purchase({
			amount,
			platform,
			walletId,
			firstName,
			middleName,
			lastName,
			bank,
			status: "not settled"
		})

		await newBuy.save()
		return res.status(201).json({ message: "Request sent successfuly" })
	} catch (error) {
		return res.status(400).json({ error, message: "Something went wrong" })
	}
}

exports.sell = async (req, res) => {
	try {
		if (!res.locals.user) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const { amount, platform } = req.body

		const { errors, valid } = validateSell(amount, platform)

		if (!valid) return res.status(403).json(errors)

		const user = await User.findOne({ email: res.locals.user.email })
		const { firstName, middleName, lastName, bank } = user
		const newSell = new Sell({
			amount,
			platform,
			firstName,
			middleName,
			lastName,
			bank,
			status: "not settled"
		})

		await newSell.save()
		return res.status(201).json({ message: "Request sent successfuly" })
	} catch (error) {
		return res.status(400).json({ error, message: "Something went wrong" })
	}
}

exports.fetchRates = async (req, res) => {
	const errors = {}
	try {
		const rates = await Rate.findById(process.env.RATE_ID)
		return res.status(201).json(rates)
	} catch (error) {
		errors.general = "Something went wrong. Try again later"
		return res.status(400).json(errors)
	}
}
