const Bill = require("../models/Bill.js");
const { verifyAdmin } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Faturalar getirilemedi.", error: error.message });
  }
});

router.post("/", verifyAdmin, async (req, res) => {
  try {
    const newBill = new Bill(req.body);
    const savedBill = await newBill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    res.status(500).json({ message: "Fatura kaydedilemedi.", error: error.message });
  }
});

router.patch("/cancel-bill", verifyAdmin, async (req, res) => {
  try {
    const { billId } = req.body;
    const updatedBill = await Bill.findByIdAndUpdate(
      billId,
      { status: "İptal Edildi" },
      { new: true }
    );
    res.status(200).json(updatedBill);
  } catch {
    res.status(500).json({ message: "Fatura iptal edilemedi." });
  }
});

module.exports = router;