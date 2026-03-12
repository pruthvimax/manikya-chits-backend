import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// ROUTES
import outstandingRoutes from "./routes/outstandingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import chitSchemeRoutes from "./routes/chitSchemeRoutes.js";
import memberHistoryRoutes from "./routes/memberHistoryRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import memberInterestRoutes from "./routes/memberInterestRoutes.js";

const app = express();

// ----------------- DEBUG ENV VARIABLES -----------------
console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID ? "Loaded ✅" : "Missing ❌");
console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "Loaded ✅" : "Missing ❌");
console.log("TWILIO_WHATSAPP_FROM:", process.env.TWILIO_WHATSAPP_FROM);

// ----------------- MIDDLEWARE -----------------
app.use(cors());
app.use(express.json());

// ----------------- DATABASE CONNECTION -----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// ----------------- ROUTES -----------------
app.use("/api/chitscheme", chitSchemeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/member-interest", memberInterestRoutes);
app.use("/api/member-history", memberHistoryRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/outstanding", outstandingRoutes);

// ----------------- TEST ROUTE -----------------
app.get("/", (req, res) => {
  res.send("✅ Manikya Backend Running Successfully 🚀");
});

// ----------------- SERVER -----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});