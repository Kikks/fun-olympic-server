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
	fetchRates
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
	settleSell
} = require("./handlers/admin")
const { checkAdmin, checkUser } = require("./utils/authorization")

const PORT = process.env.PORT || 5000

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "tmp")
	})
)

//User routes
app.post("/user/register", jsonParser, register)
app.post("/user/login", jsonParser, login)
app.post("/user/upload-image", uploadImage)
app.post("/user/verify-payment", jsonParser, checkUser, verifyPayment)
app.post("/user/buy", jsonParser, checkUser, buy)
app.post("/user/sell", jsonParser, checkUser, sell)
app.get("/user/fetch-rates", fetchRates)

//Admin routes
app.post("/admin/verify", jsonParser, checkAdmin, verifyUser)
app.post("/admin/settle-buy", jsonParser, checkAdmin, settleBuy)
app.post("/admin/settle-sell", jsonParser, checkAdmin, settleSell)
app.post("/admin/register", jsonParser, registerAdmin)
app.post("/admin/login", jsonParser, adminLogin)
app.post("/admin/upload-rate", jsonParser, checkAdmin, uploadRate)
app.get("/admin/fetch-users", checkAdmin, fetchUsers)
app.get("/admin/fetch-pending-users", checkAdmin, fetchPendingUsers)
app.get("/admin/fetch-user", jsonParser, checkAdmin, fetchUser)
app.get("/admin/fetch-pending-user", jsonParser, checkAdmin, fetchPendingUser)
app.get("/admin/fetch-purchases", checkAdmin, fetchPurchases)
app.get("/admin/fetch-sales", checkAdmin, fetchSales)
app.get("/admin/fetch-purchase", jsonParser, checkAdmin, fetchPurchase)
app.get("/admin/fetch-sale", jsonParser, checkAdmin, fetchSale)

app.use(cors())
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
