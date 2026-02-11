import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    auctionDate: {
      type: String,
      required: true,
    },
    auctionTime: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
