require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
	validateLoginInput,
	validateRegisterInput,
	validateDate
} = require("../utils/validators");
const Administrator = require("../models/Administrator");
const LoginStats = require("../models/LoginStats");

exports.adminRegister = async (req, res) => {
	try {
		const { firstName, lastName, email, password, confirmPassword } = req.body;

		const { errors, valid } = validateRegisterInput(
			firstName,
			lastName,
			email,
			password,
			confirmPassword
		);

		if (!valid) return res.status(403).json(errors);

		const existingUser = await Administrator.findOne({ email });

		if (existingUser) {
			return res
				.status(400)
				.json({ general: "An admin with that email already exisits." });
		}

		const encryptedPassword = await bcrypt.hash(password, 12);

		const admin = new Administrator({
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: email.trim(),
			password: encryptedPassword,
			admin: true,
			createdAt: new Date().toISOString()
		});

		await admin.save();

		return res
			.status(201)
			.json({ message: "Admin has been created successfuly." });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.adminLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		const { errors, valid } = validateLoginInput(email, password);

		const admin = await Administrator.findOne({ email });

		if (!valid) return res.status(403).json(errors);

		if (!admin) {
			errors.general = "Admin not found.";
			return res.status(400).json(errors);
		}

		const match = await bcrypt.compare(password, admin.password);
		if (!match) {
			errors.general = "Wrong Credentials";
			return res.status(403).json(errors);
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
		);

		return res.status(201).json({ token });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.getStats = async (req, res) => {
	try {
		const { date } = req.params;
		const { errors, valid } = validateDate(date);
		if (!valid) return res.status(403).json(errors);

		const loginStat = await LoginStats.findOne({ date });

		if (loginStat) {
			return res.status(200).json({ loginStat });
		} else {
			return res.status(200).json({
				loginStat: {
					date,
					numberOfLogins: 0
				}
			});
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};
