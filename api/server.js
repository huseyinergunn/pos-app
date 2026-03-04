const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const categoryRoute = require("./routes/categories.js");
const productRoute = require("./routes/products.js");
const billRoute = require("./routes/bills.js");
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB"); 
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); 
  }
};

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/bills", billRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(port, () => {
  connect();
  console.log(`Example app listening on port ${port}`);
});