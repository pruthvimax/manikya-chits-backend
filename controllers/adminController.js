import twilio from "twilio";
import Admin from "../models/Admin.js";

// ---------------- SEND OTP ----------------
export const sendOtp = async (req, res) => {
  try {
    console.log("---- SEND OTP CALLED ----");
    console.log("Request body:", req.body);

    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile required" });
    }

    console.log("Mobile from frontend:", mobile);

    const cleanMobile = mobile.replace("+91", "");
    console.log("Mobile after cleaning:", cleanMobile);

    const admin = await Admin.findOne({ mobile: cleanMobile });

    console.log("Admin found:", admin);

    if (!admin) {
      return res
        .status(400)
        .json({ message: "This number is not registered as Admin" });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    admin.otp = otp;
    admin.otpExpires =
      Date.now() +
      parseInt(process.env.OTP_EXPIRY_MINUTES || "2") * 60 * 1000;

    await admin.save();

    console.log("Generated OTP:", otp);

    // Create Twilio client here
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const whatsappNumber = mobile.startsWith("+")
      ? mobile
      : `+91${mobile}`;

    console.log("Sending OTP to:", whatsappNumber);

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${whatsappNumber}`,
      body: `🔐 Your Manikya Chits Admin OTP is: ${otp}\nValid for ${
        process.env.OTP_EXPIRY_MINUTES || 2
      } minutes.`,
    });

    console.log("OTP sent successfully");

    return res.json({ message: "OTP sent to WhatsApp successfully!" });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (req, res) => {
  try {
    console.log("---- VERIFY OTP CALLED ----");

    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        message: "Mobile and OTP required",
      });
    }

    const cleanMobile = mobile.replace("+91", "");

    const admin = await Admin.findOne({ mobile: cleanMobile });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (admin.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > admin.otpExpires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    admin.otp = null;
    admin.otpExpires = null;

    await admin.save();

    console.log("OTP verified successfully");

    return res.json({ message: "Login Successful!" });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ---------------- ADMIN PROFILE ----------------
export const getAdminProfile = async (req, res) => {
  try {
    const cleanMobile = req.params.mobile.replace("+91", "");

    const admin = await Admin.findOne({ mobile: cleanMobile });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.json(admin);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};