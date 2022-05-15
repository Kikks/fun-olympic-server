const Broadcast = require("../models/Broadcast");
const Category = require("../models/Category");
const { validateCreateBroadcast } = require("../utils/validators");

exports.getBroadcasts = async (req, res) => {
	try {
		const { categoryId } = req.query;

		const broadcasts = await Broadcast.find({
			"category._id": {
				$regex: categoryId || ""
			}
		}).sort({
			_id: "desc"
		});
		return res.status(200).json({ broadcasts });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.addBroadcast = async (req, res) => {
	try {
		const { name, airingTime, categoryId, link } = req.body;

		const { errors, valid } = validateCreateBroadcast({
			name,
			airingTime,
			categoryId,
			link
		});
		if (!valid) return res.status(403).json(errors);

		const broadcast = await Broadcast.findOne({ name });

		if (broadcast)
			return res.status(403).json({ general: "Broadcast exists already." });

		const category = await Category.findById(categoryId);

		if (!category) {
			return res.status(403).json({ general: "Category does not exist." });
		}

		const newbroadCast = new Broadcast({
			name: name.trim(),
			airingTime,
			category,
			link
		});

		await newbroadCast.save();

		return res.status(200).json({
			message: "Broadcast created successfully."
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.deleteBroadcast = async (req, res) => {
	try {
		const { broadcastId } = req.params;

		const broadcast = await Broadcast.findById(broadcastId);

		if (!broadcast)
			return res.status(403).json({ general: "Broadcast does not exist" });

		await broadcast.delete();

		return res.status(200).json({
			message: "Broadcast deleted successfully."
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.countBroadCasts = async (req, res) => {
	try {
		const count = await Broadcast.countDocuments();

		return res.status(200).json({
			count
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};
