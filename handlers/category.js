const Category = require("../models/Category");
const { validateCreateCateogory } = require("../utils/validators");

exports.getCategories = async (req, res) => {
	try {
		const categories = await Category.find().sort({
			name: "asc"
		});
		return res.status(200).json({ categories });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.addCategory = async (req, res) => {
	try {
		const { name, image } = req.body;

		const { errors, valid } = validateCreateCateogory(name, image);
		if (!valid) return res.status(403).json(errors);

		const cateogory = await Category.findOne({ name });

		if (cateogory)
			return res.status(403).json({ general: "Category exists already." });

		const newCategory = new Category({
			name: name.trim(),
			image
		});

		await newCategory.save();

		return res.status(200).json({
			category: newCategory,
			message: "Category created successfully."
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.deleteCategory = async (req, res) => {
	try {
		const { categoryId } = req.params;

		const cateogory = await Category.findById(categoryId);

		if (!cateogory)
			return res.status(403).json({ general: "Category does not exist" });

		await cateogory.delete();

		return res.status(200).json({
			message: "Category deleted successfully."
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

exports.countCategories = async (req, res) => {
	try {
		const count = await Category.countDocuments();

		return res.status(200).json({
			count
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};
