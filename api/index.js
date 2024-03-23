const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
dotenv.config();

// connet to database
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("connect to db!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const router = express.Router();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

// listen to a port
app.listen(3000, () => {
  console.log("server is running!");
});
