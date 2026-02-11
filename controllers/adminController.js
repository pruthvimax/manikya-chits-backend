import twilio from "twilio";
import Admin from "../models/Admin.js";

// Helper: create Twilio client lazily so env vars are read at call time
function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    throw new Error("Twilio credentials missing (check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env)");
  }
  return twilio(sid, token);
}

// ----------------------------------
// SEND OTP (WhatsApp)
// ----------------------------------
export const sendOtp = async (req, res) => {
  try {
    console.log("---- /send-otp CALLED ----");
    console.log("BODY:", req.body);

    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ message: "Mobile required" });

    console.log("Mobile received:", mobile);

    const admin = await Admin.findOne({ mobile });
    if (!admin) {
      return res.status(400).json({ message: "This number is not registered as Admin" });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP & Expiry
    admin.otp = otp;
    admin.otpExpires = Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES || "2", 10) * 60 * 1000);
    await admin.save();

    console.log("OTP Generated:", otp);

    // Create Twilio client now (ensures env vars are available)
    const client = getTwilioClient();
    console.log("TWILIO SID:", process.env.TWILIO_ACCOUNT_SID ? "Loaded" : "Missing");
    console.log("TWILIO FROM:", process.env.TWILIO_WHATSAPP_FROM);

    // Send OTP via WhatsApp Sandbox
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:+91${mobile}`,
      body: `🔐 Your Manikya Chits Admin OTP is: ${otp}\n(Valid for ${process.env.OTP_EXPIRY_MINUTES || 2} minutes)`,
    });

    console.log("WhatsApp OTP sent:", otp);
    return res.json({ message: "OTP sent to WhatsApp successfully!" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err && err.message ? err.message : err);
    return res.status(500).json({ message: "Server error", error: err && err.message ? err.message : String(err) });
  }
};

// ----------------------------------
// VERIFY OTP
// ----------------------------------
export const verifyOtp = async (req, res) => {
  try {
    console.log("---- /verify-otp CALLED ----");
    console.log("BODY:", req.body);

    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ message: "Mobile and OTP required" });

    const admin = await Admin.findOne({ mobile });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    if (admin.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > admin.otpExpires) return res.status(400).json({ message: "OTP expired" });

    admin.otp = null;
    admin.otpExpires = null;
    await admin.save();

    return res.json({ message: "Login Successful!" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err && err.message ? err.message : err);
    return res.status(500).json({ message: "Server error", error: err && err.message ? err.message : String(err) });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne({ mobile: req.params.mobile });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    return res.json(admin);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
