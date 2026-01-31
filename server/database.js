const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://<db_username>:<db_password>@cluster0.cczme0l.mongodb.net/nhom4?appName=Cluster0"
    );
    console.log("Kết nối thành công");
  } catch (error) {
    console.log("Kết nối thất bại", { error: error.message });
    process.exit(1);
  }
};
module.exports = connectDB;
