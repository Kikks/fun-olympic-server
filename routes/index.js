const bodyParser = require("body-parser");
const { adminLogin, adminRegister, getStats } = require("../handlers/admin");
const jsonParser = bodyParser.json();

const {
	getBroadcasts,
	addBroadcast,
	deleteBroadcast
} = require("../handlers/broadcast");
const {
	register,
	login,
	logout,
	addBroadcastToUser,
	removeBroadcastFromUser,
	getUsers,
	resetUserPassword,
	deleteUser
} = require("../handlers/user");

const { checkUser, checkAdmin } = require("../utils/authorization");

exports.routes = app => {
	// Broadcasts
	app.get("/broadcast", getBroadcasts);
	app.post("/broadcast", jsonParser, checkAdmin, addBroadcast);
	app.delete(
		"/broadcast/:broadcastId",
		jsonParser,
		checkAdmin,
		deleteBroadcast
	);

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

	//Admin
	app.post("/admin/login", jsonParser, adminLogin);
	app.post("/admin/register", jsonParser, adminRegister);
	app.get("/admin/login-stats", jsonParser, checkAdmin, getStats);
};
