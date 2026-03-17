const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/", ctrl.getOrders);
router.post("/", ctrl.createOrder);
router.put("/:id", ctrl.updateOrder);
router.delete("/:id", ctrl.deleteOrder);
router.get("/export/csv", ctrl.exportCSV);
router.post("/bulk/update", ctrl.bulkUpdate);
router.post("/bulk/delete", ctrl.bulkDelete);

module.exports = router;