const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/templates",         ctrl.getTemplates);
router.get("/",                  ctrl.getDashboards);
router.post("/",                 ctrl.createDashboard);
router.get("/:id",               ctrl.getDashboard);
router.put("/:id",               ctrl.saveDashboard);
router.delete("/:id",            ctrl.deleteDashboard);
router.post("/:id/duplicate",    ctrl.duplicateDashboard);
router.patch("/:id/rename",      ctrl.renameDashboard);

module.exports = router;