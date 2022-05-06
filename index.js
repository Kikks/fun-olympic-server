require("dotenv").config();
const app = require("express")();
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const path = require("path");

const { routes } = require("./routes");

const PORT = process.env.PORT || 5000;

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "tmp")
	})
);

app.use(cors());
routes(app);

mongoose
	.connect(process.env.MERN, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => {
		app.listen({ port: PORT }, () => {
			console.log("Connected to DB");
			console.log(`Server running at http://localhost:${PORT}`);
		});
	})
	.catch(error => console.log(error));
