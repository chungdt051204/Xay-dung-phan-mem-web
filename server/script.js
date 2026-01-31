const connectDB = require("./database");
connectDB();
const express = require("express");
const app = express();
const port = 3000;
const categoryRouter = require("./modules/category/category.router");
app.use("/", categoryRouter);
app.get("/", (req, res) => {
  return res.json("Hello world");
});
app.listen(port, () => {
  console.log("Server đang chạy với port:" + port);
});
