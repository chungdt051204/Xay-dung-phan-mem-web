const connectDB = require("./config/connectDB");
require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const categoryRouter = require("./modules/category/category.router");
connectDB();

app.use("/", categoryRouter);
app.get("/", (req, res) => {
  return res.json("Hello world");
});
app.listen(port, () => {
  console.log("Server đang chạy với port:" + port);
});
