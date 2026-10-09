/**
 * Seed script — buat akun admin default
 * Jalankan sekali: node seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/agritech";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "AgriTech" });
    console.log("Connected to MongoDB");

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const accounts = [
      {
        name: "Admin AgriTech",
        email: "admin@agritech.com",
        phone: "081234567890",
        address: "Jakarta, Indonesia",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Demo Farmer",
        email: "farmer@agritech.com",
        phone: "081234567891",
        address: "Bandung, Indonesia",
        password: await bcrypt.hash("farmer123", 10),
        role: "farmer",
      },
    ];

    for (const account of accounts) {
      await User.updateOne(
        { email: account.email },
        { $setOnInsert: account },
        { upsert: true }
      );
    }

    console.log("✅ Admin berhasil dibuat:");
    console.log("   Email   : admin@agritech.com");
    console.log("   Password: admin123");
    console.log("✅ Farmer demo berhasil dibuat:");
    console.log("   Email   : farmer@agritech.com");
    console.log("   Password: farmer123");
    process.exit(0);
  } catch (err) {
    console.error("❌ Gagal seed:", err.message);
    process.exit(1);
  }
}

seed();
