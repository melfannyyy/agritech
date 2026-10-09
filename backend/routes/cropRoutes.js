const express = require("express");
const { createCrop, getAllCrops, getCropById, updateCrop, deleteCrop } = require("../controllers/cropController");

const router = express.Router();

router.post("/",     createCrop);
router.get("/",      getAllCrops);
router.get("/:id",   getCropById);
router.put("/:id",   updateCrop);
router.delete("/:id", deleteCrop);

module.exports = router;
