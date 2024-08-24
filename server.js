const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const router = require("./routes/routes");
const cookieParser = require("cookie-parser");
const app = express();

// config
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");
dotenv.config();
const PORT = process.env.PORT ?? 3000;

// Connect to db
mongoose
  .connect(process.env.DB_STRING)
  .then(() => {
    console.log("DB is connected...");
  })
  .catch((err) => console.log(err));

// routers

app.use(router);

app.listen(PORT, () => console.log(`Server Listing at PORT ${PORT}...`));
