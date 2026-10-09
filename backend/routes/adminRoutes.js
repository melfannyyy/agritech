const express = require("express");
const { getSystemStats, getAllUsersWithStats, verifyUser, getReports } = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// All admin routes require authentication
router.use(authMiddleware);

router.get("/stats",          getSystemStats);
router.get("/users",          getAllUsersWithStats);
router.put("/users/:id/verify", verifyUser);
router.get("/reports",        getReports);

module.exports = router;
