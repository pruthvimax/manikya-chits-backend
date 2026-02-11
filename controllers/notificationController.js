import Group from "../models/Group.js";
import Member from "../models/Member.js"; // kept (not used now, but not harmful)
import Notification from "../models/Notification.js";

/* ================= ADD NOTIFICATION (ADMIN) ================= */
export const addNotification = async (req, res) => {
  try {
    const { groupId, auctionDate, auctionTime, message } = req.body;

    const notification = new Notification({
      groupId,
      auctionDate,
      auctionTime,
      message,
      status: "active",
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error("Add notification error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL NOTIFICATIONS (ADMIN) ================= */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("groupId", "groupId")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE NOTIFICATION ================= */
export const updateNotification = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Update notification error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE NOTIFICATION ================= */
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= USER NOTIFICATIONS (FINAL, WORKING) ================= */
export const getUserNotifications = async (req, res) => {
  try {
    const { userid } = req.params;

    console.log("➡️ userid received:", userid);

    // ✅ Your DB stores memberId as STRING ("1", "2")
    const group = await Group.findOne({
      "members.memberId": userid,
    });

    if (!group) {
      console.log("❌ Group not found for userid:", userid);
      return res.json([]);
    }

    console.log("✅ Group found:", group._id);

    const notifications = await Notification.find({
      groupId: group._id,
      status: "active",
    })
      .populate("groupId", "groupId")
      .sort({ createdAt: -1 });

    console.log("✅ Notifications count:", notifications.length);

    return res.json(notifications);
  } catch (error) {
    console.error("🔥 User notification error:", error);
    return res.status(500).json({ message: error.message });
  }
};

