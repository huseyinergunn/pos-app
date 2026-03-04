const mongoose = require("mongoose");

const BillSchema = mongoose.Schema(
  {
    customerName: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    subTotal: { type: Number, required: true },
    cartItems: { type: Array, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    // YENİ ALAN BURASI:
    status: { 
      type: String, 
      default: "Ödendi" 
    },
  },
  { timestamps: true }
);

const Bill = mongoose.model("bills", BillSchema);
module.exports = Bill;