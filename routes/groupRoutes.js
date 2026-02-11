import express from "express";
import { getMyAccountCopy } from "../controllers/groupController.js";

import {
  // USER
  getMyChits,

  // ADMIN
  createGroup,
  getGroupsByChit,
  deleteGroup,
  addMemberToGroup,
  getGroupMembers,
  updateGroupMember,
  removeMemberFromGroup,
  setCollectionPlanForGroup,
  getCollectionPlanByMonth,
  updateDividendForMonth,
  updatePaymentByIndex,
  deletePaymentByIndex,

  // EMPLOYEE
  getAllGroups,
  addPaymentToMember,

  // ADMIN EXTRA
  getAllGroupsForAdmin,
} from "../controllers/groupController.js";

const router = express.Router();


/* ================= USER: ACCOUNT COPY ================= */
router.get(
  "/account-copy/:userid/:groupId",
  getMyAccountCopy
);
  
/* ================= USER ROUTES ================= */
router.get("/my-chits/:userid", getMyChits);

/* ================= ADMIN ROUTES ================= */
router.get("/admin/all", getAllGroupsForAdmin);
router.post("/add", createGroup);
router.delete("/:groupId", deleteGroup);


/* ================= EMPLOYEE ROUTES ================= */
router.get("/", getAllGroups);
router.post(
  "/:groupId/members/:groupMemberId/payments",
  addPaymentToMember
);

/* ================= ADMIN / COMMON ================= */
router.get("/:chitId", getGroupsByChit);
router.post("/:groupId/members", addMemberToGroup);
router.get("/:groupId/members", getGroupMembers);
router.put("/:groupId/members/:groupMemberId", updateGroupMember);
router.delete("/:groupId/members/:groupMemberId", removeMemberFromGroup);

/* ================= COLLECTION PLAN ================= */
router.post("/:groupId/collection-plan", setCollectionPlanForGroup);
router.get("/:groupId/collection-plan/:monthIndex", getCollectionPlanByMonth);

/* ================= COLLECTION PLAN – DIVIDEND UPDATE ================= */
router.put(
  "/:groupId/collection-plan/:monthIndex/dividend",
  updateDividendForMonth
);


/* ================= PAYMENT EDIT ================= */
router.put(
  "/:groupId/members/:groupMemberId/payments/:monthIndex/:paymentIndex",
  updatePaymentByIndex
);
router.delete(
  "/:groupId/members/:groupMemberId/payments/:monthIndex/:paymentIndex",
  deletePaymentByIndex
);

export default router;
