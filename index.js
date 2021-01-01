require("dotenv").config()
const app = require("express")()
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()
const fileUpload = require("express-fileupload")
const path = require("path")

const {
	register,
	login,
	uploadImage,
	verifyPayment,
	buy,
	sell,
	fetchRates,
	fetchActivityLog,
	fetchSummary,
	fetchTickerData,
	fetchProfile,
	updateProfile
} = require("./handlers/users")
const {
	registerAdmin,
	adminLogin,
	verifyUser,
	fetchUsers,
	fetchPendingUsers,
	fetchUser,
	fetchPendingUser,
	uploadRate,
	fetchPurchases,
	fetchSales,
	fetchPurchase,
	fetchSale,
	settleBuy,
	settleSell,
	deleteUser,
	deletePendingUser
} = require("./handlers/admin")
const { checkAdmin, checkUser } = require("./utils/authorization")

const PORT = process.env.PORT || 5000

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "tmp")
	})
)

app.use(cors())

//User routes
app.post("/user/register", jsonParser, register)
app.post("/user/login", jsonParser, login)
app.post("/user/upload-image", uploadImage)
app.post("/user/verify-payment", jsonParser, checkUser, verifyPayment)
app.post("/user/buy", jsonParser, checkUser, buy)
app.post("/user/sell", jsonParser, checkUser, sell)
app.get("/user/fetch-profile", checkUser, fetchProfile)
app.post("/user/update-profile", jsonParser, checkUser, updateProfile)
app.get("/user/fetch-rates", fetchRates)
app.get("/user/fetch-activity-log", checkUser, fetchActivityLog)
app.get("/user/fetch-summary", checkUser, fetchSummary)
app.post("/user/get-ticker-data", jsonParser, fetchTickerData)

//Admin routes
//////verify
app.post("/admin/verify", jsonParser, checkAdmin, verifyUser)

/////admin access
app.post("/admin/register", jsonParser, registerAdmin)
app.post("/admin/login", jsonParser, adminLogin)

/////Buying & selling
app.post("/admin/settle-buy", jsonParser, checkAdmin, settleBuy)
app.post("/admin/settle-sell", jsonParser, checkAdmin, settleSell)
app.post("/admin/upload-rate", jsonParser, checkAdmin, uploadRate)
app.get("/admin/fetch-purchases", checkAdmin, fetchPurchases)
app.get("/admin/fetch-sales", checkAdmin, fetchSales)
app.post("/admin/fetch-purchase", jsonParser, checkAdmin, fetchPurchase)
app.post("/admin/fetch-sale", jsonParser, checkAdmin, fetchSale)

/////Fetching routes
app.post("/admin/fetch-user", jsonParser, checkAdmin, fetchUser)
app.get("/admin/fetch-users", checkAdmin, fetchUsers)
app.post("/admin/fetch-pending-user", jsonParser, checkAdmin, fetchPendingUser)
app.get("/admin/fetch-pending-users", checkAdmin, fetchPendingUsers)

//////delete routes
app.post("/admin/delete-user", jsonParser, checkAdmin, deleteUser)
app.post(
	"/admin/delete-pending-user",
	jsonParser,
	checkAdmin,
	deletePendingUser
)

mongoose
	.connect(process.env.MERN, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => {
		app.listen({ port: PORT }, () => {
			console.log("Connected to DB")
			console.log(`Server running at http://localhost:${PORT}`)
		})
	})
	.catch(error => console.log(error))
