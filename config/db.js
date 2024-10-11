const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    // console.log(conn)
    // console.log(`connected to ${conn.connection.name}`.bgGreen.black);
    console.log(`connected to ${conn.connection.host}`.bgGreen.black);
  } catch (error) {
    console.log(error.bgRed.white);
  }
};

module.exports = connectDB;