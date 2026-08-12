const express = require("express");
const router = express.Router();
const {
  getOverview,
  listUsers,
  toggleBlockUser,
  verifyTeacher,
  listReports,
  updateReportStatus,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect, adminOnly);

router.get("/overview", getOverview);
router.get("/users", listUsers);
router.patch("/users/:id/block", toggleBlockUser);
router.patch("/users/:id/verify", verifyTeacher);
router.get("/reports", listReports);
router.patch("/reports/:id", updateReportStatus);

module.exports = router;
