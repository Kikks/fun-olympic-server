require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const cloudinary = require("cloudinary").v2
const https = require("https")
const nodemailer = require("nodemailer")

const User = require("../models/User")
const PendingUser = require("../models/PendingUser")
const Purchase = require("../models/Purchase")
const Sell = require("../models/Sell")
const {
	validateRegisterInput,
	validateLoginInput,
	validateBuy,
	validateSell,
	validateGuestBuy,
	validateGuestSell,
	validateUpdateProfile
} = require("../utils/validators")
const Rate = require("../models/Rate")
const Counters = require("../models/Counters")

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

	await pendingUser.save()

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "fairdollar.ng@gmail.com",
			pass: "Fairdollar1000."
		}
	})

	const mailOptions = {
		from: "fairdollar.ng@gmail.com",
		to: email,
		subject: "E-mail Verification",
		text: "Us this link to verify your email address.",
		html: `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8"/>
					<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
					<title>E-mail Verification</title>
					<style amp4email-boilerplate>
						*,
						*::after,
						*::before {
							box-sizing: border-box;
							margin: 0;
							padding: 0;
						}

						body {
							background-color: #f7f7f7;
							width: 100vw;
							height: 100vh;
							font-family: "Open-Sans", sans-serif;
							display: flex;
							justify-content: center;
							align-items: center;
							align-content: center;
						}

						.container {
							font-size: 18px;
						}

						.link {
							color: #fff !important;
							text-decoration: none;
							text-transform: uppercase;
							font-size: 15px;
							line-height: 1;
						}

						.link-container {
							display: inline-block;
							padding: 10px 20px;
							background-color: #ff880e;
							border-radius: 3px;
						}
					</style>
					<script async src="https://cdn.ampproject.org/v0.js"></script>
					<script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
				</head>
				<body>
					<div class="container">
						<h2>E-mail Verification</h2>
						<br />
						<p style="font-size: 18px"><strong>User Verification for Fair Dollar account.</strong></p>
						<br />
						<p style="font-size: 18px !important;">Hey there ${pendingUser.firstName} ${pendingUser.lastName}! Use this link to verify your account:</p>
						<br />
						<div class="link-container">
							<a href="https://fairdollar.ng/user-verification/${pendingUser._id}" class="link">Click Me</a>
						</div>
					</div>
      			</body>
				</html>`
	}

	let emailError
	transporter.sendMail(mailOptions, async function (error) {
		if (error) {
			emailError = true
			console.log(error)
		}
	})

	if (emailError) {
		errors.general = "Something went wrong, try again at a later time."
		return res.status(400).json(errors)
	}

	return res
		.status(201)
		.json({ message: "User has been verified successfuly." })
}

exports.verifyUser = async (req, res) => {
	const errors = {}
	try {
		const { pendingUserId } = req.body

		const pendingUser = await PendingUser.findById(pendingUserId)

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

exports.fetchProfile = async (req, res) => {
	const errors = {}
	try {
		if (!res.locals.user) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const { id } = res.locals.user
		const user = await User.findById(id)
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

exports.updateProfile = async (req, res) => {
	const { street, city, phoneNumber, altPhoneNumber, country, state } = req.body

	const { errors, valid } = validateUpdateProfile(
		street,
		city,
		phoneNumber,
		country,
		state
	)

	try {
		if (!res.locals.user) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		if (!valid) return res.status(403).json(errors)

		const updatedUser = await User.findOneAndUpdate(
			{ _id: res.locals.user.id },
			{
				street,
				city,
				phoneNumber,
				altPhoneNumber,
				country,
				state
			},
			{ new: true }
		)
		await updatedUser.save()

		return res.status(201).json({ message: "Update Successful" })
	} catch (error) {
		errors.general = "Something went wrong try again later."
		return res.status(400).json(errors)
	}
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

	if (targetFile.size > 10048576) {
		fs.unlinkSync(targetFile.tempFilePath)
		errors.identification =
			"File is too large. Max size of upload should be 2mb"
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
		const { firstName, middleName, lastName, email, bank } = user
		const newBuy = new Purchase({
			amount,
			platform,
			walletId,
			firstName,
			middleName,
			lastName,
			email,
			bank,
			status: "not settled"
		})

		await newBuy.save()
		return res.status(201).json({ message: "Request sent successfuly" })
	} catch (error) {
		return res.status(400).json({ error, message: "Something went wrong" })
	}
}

exports.guestBuy = async (req, res) => {
	try {
		const {
			amount,
			platform,
			walletId,
			firstName,
			middleName,
			lastName,
			email
		} = req.body

		const { errors, valid } = validateGuestBuy(
			firstName,
			middleName,
			lastName,
			email,
			amount,
			platform,
			walletId
		)

		if (!valid) return res.status(403).json(errors)

		const newBuy = new Purchase({
			amount,
			platform,
			walletId,
			firstName,
			middleName,
			lastName,
			email,
			bank: {
				name: "Nil",
				acctNo: "Nil",
				acctName: "Nil"
			},
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

		const { amount, platform, bankName, acctNo, acctName } = req.body

		const { errors, valid } = validateSell(
			amount,
			platform,
			bankName,
			acctNo,
			acctName
		)

		if (!valid) return res.status(403).json(errors)

		const user = await User.findOne({ email: res.locals.user.email })
		const { firstName, middleName, lastName, email } = user
		const newSell = new Sell({
			amount,
			platform,
			firstName,
			middleName,
			lastName,
			email,
			bank: {
				name: bankName,
				acctName,
				acctNo
			},
			status: "not settled"
		})

		await newSell.save()
		return res.status(201).json({ message: "Request sent successfuly" })
	} catch (error) {
		return res.status(400).json({ error, message: "Something went wrong" })
	}
}

exports.guestSell = async (req, res) => {
	try {
		const {
			firstName,
			middleName,
			lastName,
			email,
			amount,
			platform,
			bankName,
			acctNo,
			acctName
		} = req.body

		const { errors, valid } = validateGuestSell(
			firstName,
			middleName,
			lastName,
			email,
			amount,
			platform,
			bankName,
			acctNo,
			acctName
		)

		if (!valid) return res.status(403).json(errors)

		const newSell = new Sell({
			amount,
			platform,
			firstName,
			middleName,
			lastName,
			email,
			bank: {
				name: bankName,
				acctName,
				acctNo
			},
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

exports.fetchTickerData = async (req, res) => {
	const { currency } = req.body
	try {
		https
			.get(
				`https://api.nomics.com/v1/currencies/ticker?key=9650bc232337f90431b764d8b5c3a923&ids=ETH,LTC,XRP,BCH&interval=1d&convert=${currency}&per-page=20&page=1`,
				resp => {
					let data = ""
					resp.on("data", chunk => {
						data += chunk
					})

					resp.on("end", () => {
						return res.status(200).json(JSON.parse(data))
					})
				}
			)
			.on("error", err => {
				console.log("Error: " + err.message)
			})
	} catch (error) {
		console.log(error)
	}
}

exports.fetchActivityLog = async (req, res) => {
	const errors = {}
	try {
		if (!res.locals.user) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const { email } = res.locals.user
		const purchases = await Purchase.find({ email })
		const sales = await Sell.find({ email })

		return res.status(201).json({ purchases, sales })
	} catch (err) {
		errors.general = "Something went wrong. Try again later"
		return res.status(400).json(errors)
	}
}

exports.fetchSummary = async (req, res) => {
	const errors = {}
	try {
		if (!res.locals.user) {
			errors.general = "Not Authorized"
			return res.status(403).json(errors)
		}

		const { email } = res.locals.user
		const purchases = await Purchase.find({ email })
		const sales = await Sell.find({ email })

		return res
			.status(201)
			.json({ purchases: purchases.length, sales: sales.length })
	} catch (err) {
		errors.general = "Something went wrong. Try again later"
		return res.status(400).json(errors)
	}
}

exports.fairDollarLiveCounter = async (req, res) => {
	try {
		const { fairDollar } = await Counters.findById("601910df93540e3624b7ed7a")

		const counter = await Counters.findOneAndUpdate(
			{ _id: "601910df93540e3624b7ed7a" },
			{
				fairDollar: fairDollar + 1
			},
			{ new: true }
		)

		await counter.save()

		return res.status(200).json({ counter: counter.fairDollar })
	} catch (err) {
		return res.status(400).json(err)
	}
}

exports.forexBetaLiveCounter = async (req, res) => {
	try {
		const { forexBeta } = await Counters.findById("601910df93540e3624b7ed7a")

		const counter = await Counters.findOneAndUpdate(
			{ _id: "601910df93540e3624b7ed7a" },
			{
				forexBeta: forexBeta + 1
			},
			{ new: true }
		)

		await counter.save()

		return res.status(200).json({ counter: counter.forexBeta })
	} catch (err) {
		return res.status(400).json(err)
	}
}
