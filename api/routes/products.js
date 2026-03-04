const Product = require("../models/Product.js");
const { verifyAdmin } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.get("/get-all", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/add-product", verifyAdmin, async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      category: req.body.category.trim().toLowerCase(),
    });

    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/update-product", verifyAdmin, async (req, res) => {
  try {
    await Product.findOneAndUpdate({ _id: req.body.productId }, req.body);
    res.status(200).json("Güncellendi");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/delete-product", verifyAdmin, async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.body.productId });
    res.status(200).json("Silindi");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;