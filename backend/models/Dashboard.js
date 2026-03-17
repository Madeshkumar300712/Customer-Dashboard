const mongoose = require("mongoose");

const WidgetSchema = new mongoose.Schema({
  id: String, type: String, title: String, description: String,
  x: Number, y: Number, w: Number, h: Number,
  config: mongoose.Schema.Types.Mixed,
});

const DashboardSchema = new mongoose.Schema({
  name:       { type: String, default: "My Dashboard" },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  widgets:    [WidgetSchema],
  dateFilter: { type: String, default: "All time" },
  isTemplate: { type: Boolean, default: false },
  templateName: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Dashboard", DashboardSchema);