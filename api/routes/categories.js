const Category = require("../models/Category.js");
const Product = require("../models/Product.js");
const { verifyAdmin } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.get("/get-all", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/add-category", verifyAdmin, async (req, res) => {
  try {
    // Frontend'den gelen başlığı temizleyerek (trim) kaydetmek en iyisidir
    const newCategory = new Category({
      title: req.body.title // Direkt req.body yerine title'ı açıkça belirtmek daha güvenli
    });
    
    await newCategory.save();
    
    // ÖNEMLİ: Sadece metin değil, eklenen objeyi dönmek frontend'in kafasını karıştırmaz
    res.status(200).json(newCategory); 
  } catch (error) {
    console.error("Kategori Ekleme Hatası:", error);
    res.status(500).json({ error: "Kategori eklenemedi." });
  }
});

router.put("/update-category", verifyAdmin, async (req, res) => {
  try {
    // Önce eski kategori adını bulmamız lazım ki ürünleri de güncelleyebilelim
    const oldCategory = await Category.findById(req.body.categoryId);

    if (oldCategory && oldCategory.title !== req.body.title) {
      // Kategori adı değiştiyse, o kategoriye bağlı tüm ürünlerin kategori adını da güncelle
      await Product.updateMany(
        { category: oldCategory.title },
        { category: req.body.title },
      );
    }

    await Category.findOneAndUpdate({ _id: req.body.categoryId }, req.body);
    res.status(200).json("Kategori ve bağlı ürünler güncellendi.");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/delete-category", verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.body.categoryId);

    if (!category) {
      return res.status(404).json("Kategori bulunamadı.");
    }

    await Product.deleteMany({ category: category.title });

    await Category.findByIdAndDelete(req.body.categoryId);

    res.status(200).json("Kategori ve bağlı tüm ürünler başarıyla silindi.");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
