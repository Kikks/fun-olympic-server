const Broadcast = require("../models/Broadcast");
const { validateBroadcastName } = require("../utils/validators");

exports.getBroadcasts = async (req, res) => {
	try {
		const broadcasts = await Broadcast.find().sort({
			_id: "desc"
		});
		return res.status(200).json({ broadcasts });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ error: error, message: "Something went wrong." });
	}
};

exports.addBroadcast = async (req, res) => {
	try {
		const { name } = req.body;

		const { errors, valid } = validateBroadcastName(name);
		if (!valid) return res.status(403).json(errors);

		const broadcast = await Broadcast.findOne({ name });

		if (broadcast)
			return res.status(403).json({ general: "Broadcast exists already." });

		const newbroadCast = new Broadcast({
			name: name.trim()
		});

		await newbroadCast.save();

		return res.status(200).json({
			message: "Broadcast created successfully."
		});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ error: error, message: "Something went wrong." });
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
		return res
			.status(500)
			.json({ error: error, message: "Something went wrong." });
	}
};
