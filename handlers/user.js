require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Broadcast = require("../models/Broadcast");
const {
	validateRegisterInput,
	validateLoginInput,
	validateBroadcastId,
	validateResetUserPassword
} = require("../utils/validators");
const LoginStats = require("../models/LoginStats");

exports.getUsers = async (req, res) => {
	try {
		const users = await User.find()
			.sort({
				createdAt: "desc"
			})
			.select("-password");
		return res.status(200).json({ users });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.register = async (req, res) => {
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

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res
				.status(400)
				.json({ general: "A user with that email already exisits." });
		}

		const encryptedPassword = await bcrypt.hash(password, 12);

		const user = new User({
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: email.trim(),
			password: encryptedPassword,
			createdAt: new Date().toISOString(),
			broadcasts: [],
			lastLogin: null,
			lastLogout: null
		});

		await user.save();

		return res
			.status(201)
			.json({ message: "User has been created successfuly." });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password, date } = req.body;
		const { errors, valid } = validateLoginInput(email, password);

		if (!valid) return res.status(403).json(errors);

		const user = await User.findOne({ email });
		const match = await bcrypt.compare(password, user.password);

		if (!match || !user) {
			errors.general = "User does not exist or Incorrect details.";
			return res.status(403).json(errors);
		}

		const loginStat = await LoginStats.findOne({ date });

		if (loginStat) {
			loginStat.numberOfLogins++;
			loginStat.save();
		} else {
			const newState = new LoginStats({
				date: date || new Date().toISOString(),
				numberOfLogins: 1
			});

			await newState.save();
		}

		const token = jwt.sign(
			{
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				createdAt: user.createdAt,
				broadcasts: user.broadcasts
			},
			process.env.SECRET_KEY,
			{ expiresIn: "5h" }
		);

		user.lastLogin = new Date().toISOString();
		user.save();

		return res.status(201).json({ token, id: user._id });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.logout = async (req, res) => {
	try {
		const { id } = res.locals.user;
		const user = await User.findById(id);

		if (!user) {
			const errors = {};
			errors.general = "User does not exist.";
			return res.status(403).json(errors);
		}

		user.lastLogout = new Date().toISOString();
		await user.save();

		return res
			.status(201)
			.json({ message: "User logged out successfully", id: user._id });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.addBroadcastToUser = async (req, res) => {
	try {
		const { broadcastId } = req.params;
		const { errors, valid } = validateBroadcastId(broadcastId);

		if (!valid) return res.status(403).json(errors);

		const broadcast = await Broadcast.findById(broadcastId);

		if (!broadcast) {
			errors.general = "This broadcast does not exist or has been deleted.";
			return res.status(400).json(errors);
		}

		const { id } = res.locals.user;
		const user = await User.findById(id);

		if (!user) {
			errors.general = "User does not exist.";
			return res.status(403).json(errors);
		}

		const existingBroadcast = user.broadcasts.find(
			item => item === broadcastId
		);
		if (existingBroadcast) {
			errors.general = "You have already saved this broadcast.";
			return res.status(403).json(errors);
		}

		user.broadcasts.push(broadcastId);
		await user.save();

		const token = jwt.sign(
			{
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				createdAt: user.createdAt,
				broadcasts: user.broadcasts
			},
			process.env.SECRET_KEY,
			{ expiresIn: "5h" }
		);

		return res.status(201).json({ token, id: user._id });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.removeBroadcastFromUser = async (req, res) => {
	try {
		const { broadcastId } = req.params;

		const { errors, valid } = validateBroadcastId(broadcastId);

		if (!valid) return res.status(403).json(errors);

		const broadcast = await Broadcast.findById(broadcastId);

		if (!broadcast) {
			errors.general = "This broadcast does not exist or has been deleted.";
			return res.status(400).json(errors);
		}

		const { id } = res.locals.user;
		const user = await User.findById(id);

		if (!user) {
			errors.general = "User does not exist.";
			return res.status(403).json(errors);
		}

		const broadcastIndex = user.broadcasts.findIndex(
			item => item === broadcastId
		);

		if (broadcastIndex < 0) {
			errors.general = "You don't have this broadcast saved.";
			return res.status(403).json(errors);
		}

		user.broadcasts.splice(broadcastIndex, 1);
		await user.save();

		const token = jwt.sign(
			{
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				createdAt: user.createdAt,
				broadcasts: user.broadcasts
			},
			process.env.SECRET_KEY,
			{ expiresIn: "5h" }
		);

		return res.status(201).json({ token, id: user._id });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findById(userId);

		if (!user) return res.status(403).json({ general: "User does not exist" });

		await user.delete();

		return res.status(200).json({
			message: "User deleted successfully."
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.resetUserPassword = async (req, res) => {
	try {
		const { password } = req.body;
		const { userId } = req.params;
		const { errors, valid } = validateResetUserPassword(userId, password);
		if (!valid) return res.status(403).json(errors);

		const user = await User.findById(userId);

		if (!user) return res.status(403).json({ general: "User does not exist" });

		const encryptedPassword = await bcrypt.hash(password, 12);
		user.password = encryptedPassword;
		await user.save();

		return res.status(200).json({
			message: "User password reset successfully."
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};
