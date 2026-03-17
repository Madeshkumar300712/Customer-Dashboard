const Order = require("../models/Order");
const Notification = require("../models/Notification");

const notify = async (userId, type, title, message, orderId = null) => {
  try { await Notification.create({ userId, type, title, message, orderId }); } catch {}
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createOrder = async (req, res) => {
  try {
    const { quantity, unitPrice } = req.body;
    const order = await Order.create({ ...req.body, totalAmount: quantity * unitPrice });
    // Notify via socket
    const io = req.app.get("io");
    io?.emit("notification", { type: "order_created", message: `New order by ${order.firstName} ${order.lastName}` });
    await notify(req.user?._id, "order_created", "New Order", `Order created for ${order.product}`, order._id);
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateOrder = async (req, res) => {
  try {
    const { quantity, unitPrice } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, { ...req.body, totalAmount: quantity * unitPrice }, { new: true }
    );
    const io = req.app.get("io");
    io?.emit("notification", { type: "order_updated", message: `Order updated: ${order.product}` });
    await notify(req.user?._id, "order_updated", "Order Updated", `${order.product} was updated`, order._id);
    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    const io = req.app.get("io");
    io?.emit("notification", { type: "order_deleted", message: "An order was deleted" });
    res.json({ message: "Order deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.exportCSV = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const headers = ["ID","First Name","Last Name","Email","Phone","City","Country","Product","Quantity","Unit Price","Total Amount","Status","Created By","Date"];
    const rows = orders.map(o => [
      o._id, o.firstName, o.lastName, o.email, o.phone, o.city, o.country,
      o.product, o.quantity, o.unitPrice, o.totalAmount, o.status, o.createdBy,
      new Date(o.createdAt).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
    res.send(csv);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.bulkUpdate = async (req, res) => {
  try {
    const { ids, status } = req.body;
    await Order.updateMany({ _id: { $in: ids } }, { status });
    res.json({ updated: ids.length });
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    await Order.deleteMany({ _id: { $in: ids } });
    res.json({ deleted: ids.length });
  } catch (err) { res.status(400).json({ message: err.message }); }
};