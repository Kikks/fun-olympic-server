const bodyParser = require("body-parser");
const { adminLogin, adminRegister, getStats } = require("../handlers/admin");
const jsonParser = bodyParser.json();

const {
	getBroadcasts,
	addBroadcast,
	deleteBroadcast,
	countBroadCasts
} = require("../handlers/broadcast");
const {
	getCategories,
	addCategory,
	deleteCategory,
	countCategories
} = require("../handlers/category");
const {
	register,
	login,
	logout,
	addBroadcastToUser,
	removeBroadcastFromUser,
	getUsers,
	resetUserPassword,
	deleteUser,
	countUsers
} = require("../handlers/user");

const { checkUser, checkAdmin } = require("../utils/authorization");

exports.routes = app => {
	// Categories
	app.get("/category", getCategories);
	app.post("/category", jsonParser, checkAdmin, addCategory);
	app.delete("/category/:categoryId", jsonParser, checkAdmin, deleteCategory);
	app.get("/category/count", jsonParser, checkAdmin, countCategories);

	// Broadcasts
	app.get("/broadcast", getBroadcasts);
	app.post("/broadcast", jsonParser, checkAdmin, addBroadcast);
	app.delete(
		"/broadcast/:broadcastId",
		jsonParser,
		checkAdmin,
		deleteBroadcast
	);
	app.get("/broadcast/count", jsonParser, checkAdmin, countBroadCasts);

	//User
	app.get("/user", jsonParser, checkAdmin, getUsers);
	app.post("/user", jsonParser, register);
	app.post("/user/login", jsonParser, login);
	app.post("/user/logout", jsonParser, checkUser, logout);
	app.put(
		"/user/broadcast/:broadcastId",
		jsonParser,
		checkUser,
		addBroadcastToUser
	);
	app.delete(
		"/user/broadcast/:broadcastId",
		jsonParser,
		checkUser,
		removeBroadcastFromUser
	);
	app.patch("/user/:userId", jsonParser, checkAdmin, resetUserPassword);
	app.delete("/user/:userId", jsonParser, checkAdmin, deleteUser);
	app.get("/user/count", jsonParser, checkAdmin, countUsers);

	//Admin
	app.post("/admin/login", jsonParser, adminLogin);
	app.post("/admin/register", jsonParser, adminRegister);
	app.get("/admin/login-stats/:date", jsonParser, checkAdmin, getStats);
};
