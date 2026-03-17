const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: {
      type: String,
      enum: ["India","United States", "Canada", "Australia", "Singapore", "Hong Kong"],
      required: true,
    },
    product: {
      type: String,
      enum: [
        "Fiber Internet 300 Mbps",
        "5G Unlimited Mobile Plan",
        "Fiber Internet 1 Gbps",
        "Business Internet 500 Mbps",
        "VoIP Corporate Package",
      ],
      required: true,
    },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "In progress", "Completed"],
      default: "Pending",
    },
    createdBy: {
      type: String,
      enum: [
        "Mr. Madesh",
        "Mr. Jeyanth",
        "Ms. Anu",
        "Mr. Balaji",
        "Ms. Narmadha"
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);