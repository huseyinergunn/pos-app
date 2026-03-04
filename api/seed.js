const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product.js"); // Product modelinin yolu doğru mu kontrol et
const products = require("./products.json");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB bağlantısı başarılı.");

    await Product.deleteMany();
    console.log("Eski ürünler temizlendi.");

    await Product.insertMany(products);
    console.log("100 yeni ürün başarıyla eklendi! ✅");

    process.exit();
  } catch (error) {
    console.error("Hata oluştu:", error);
    process.exit(1);
  }
};

seedData();
