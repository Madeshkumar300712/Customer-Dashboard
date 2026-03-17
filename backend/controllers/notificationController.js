const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  const notes = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(notes);
};

exports.markRead = async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
  res.json({ success: true });
};

exports.deleteNotification = async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};