const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports.checkUser = (req, res, next) => {
	const errors = {}
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer ")
	) {
		const token = req.headers.authorization.split("Bearer ")[1]

		try {
			const user = jwt.verify(token, process.env.SECRET_KEY)

			res.locals.user = user
			return next()
		} catch (error) {
			errors.general = "Invalid/Expired Token"
			errors.details = error
			return res.status(401).json(errors)
		}
	} else {
		errors.general = "No Token found"
		return res.status(401).json(errors)
	}
}

module.exports.checkAdmin = (req, res, next) => {
	const errors = {}
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer ")
	) {
		const token = req.headers.authorization.split("Bearer ")[1]

		try {
			const user = jwt.verify(token, process.env.SECRET_KEY)

			if (user.admin) {
				res.locals.admin = user
			} else {
				error.general = "Not Authorized"
				return res.status(401).json(errors)
			}
			return next()
		} catch (error) {
			errors.general = "Invalid/Expired Token"
			errors.details = error
			return res.status(401).json(errors)
		}
	} else {
		errors.general = "No Token found"
		return res.status(401).json(errors)
	}
}
