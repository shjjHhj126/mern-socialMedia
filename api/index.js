const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const commentRoute = require("./routes/comment.route");
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

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// listen to a port
app.listen(3000, () => {
  console.log("server is running!");
});

// routes
const testRouter = express.Router();
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);

//error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message: message,
    statusCode,
  });
});
