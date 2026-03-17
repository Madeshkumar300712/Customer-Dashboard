const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type:    { type: String, enum: ["order_created","order_updated","order_deleted","system"], default: "system" },
  title:   String,
  message: String,
  read:    { type: Boolean, default: false },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);