const express = require("express");
const { createFarm, getAllFarms, getFarmById, updateFarm, deleteFarm } = require("../controllers/farmController");

const router = express.Router();

router.post("/",     createFarm);
router.get("/",      getAllFarms);
router.get("/:id",   getFarmById);
router.put("/:id",   updateFarm);
router.delete("/:id", deleteFarm);

module.exports = router;
