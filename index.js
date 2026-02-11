  import express from "express";
  import cors from "cors";
  import dotenv from "dotenv";
  import mongoose from "mongoose";

  // ROUTES
  import outstandingRoutes from "./routes/outstandingRoutes.js";
  import adminRoutes from "./routes/adminRoutes.js";
  import employeeRoutes from "./routes/employeeRoutes.js";
  import memberRoutes from "./routes/memberRoutes.js";
  import chitSchemeRoutes from "./routes/chitSchemeRoutes.js";
  import memberHistoryRoutes from "./routes/memberHistoryRoutes.js";
  import groupRoutes from "./routes/groupRoutes.js";
  import notificationRoutes from "./routes/notificationRoutes.js";

  // ✅ NEW MEMBER INTEREST ROUTE
  import memberInterestRoutes from "./routes/memberInterestRoutes.js";

  dotenv.config();


  const cors = require("cors");

  const app = express();
  app.use(cors());
  app.use(express.json());


  // ----------------- DATABASE CONNECTION -----------------
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "manikya" })
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Error:", err));


  // ----------------- ROUTES -----------------

  // ✅ Chit Schemes
  app.use("/api/chitscheme", chitSchemeRoutes);

  // ✅ Admin Routes
  app.use("/api/admin", adminRoutes);

  // ✅ Employee Routes
  app.use("/api/employee", employeeRoutes);

  // ✅ Members CRUD Routes
  app.use("/api/members", memberRoutes);

  // ✅ New Members Interest Form Routes
  app.use("/api/member-interest", memberInterestRoutes);

  // ✅ Member History Routes
  app.use("/api/member-history", memberHistoryRoutes);

  // ✅ Group Routes
  app.use("/api/groups", groupRoutes);

  // ✅ Notifications Routes
  app.use("/api/notifications", notificationRoutes);

  // ✅ Outstanding Routes
  app.use("/api/outstanding", outstandingRoutes);

  const cors = require("cors");

app.use(cors());
app.use(express.json());

  


  // ----------------- TEST ROUTE (IMPORTANT) -----------------
  app.get("/", (req, res) => {
    res.send("✅ Manikya Backend Running Successfully");
  });


  // ----------------- SERVER -----------------
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Backend running on port ${PORT}`);
  });
