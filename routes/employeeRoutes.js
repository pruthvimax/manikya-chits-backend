import express from "express";
import {
  addEmployee,
  getEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  loginEmployee,
  getEmployeeDashboardSummary,
  getEmployeeCollections,
  checkEmployeeStatus,
} from "../controllers/employeeController.js";

const router = express.Router();

/* =================================================
   AUTH
   ================================================= */
router.post("/add", addEmployee);
router.post("/login", loginEmployee);

/* =================================================
   DASHBOARD & COLLECTIONS
   ================================================= */
router.get("/dashboard/summary", getEmployeeDashboardSummary);
router.get("/collections", getEmployeeCollections);

/* =================================================
   OTHER SPECIAL ROUTES (KEEP BEFORE /:emp_id)
   ================================================= */
router.get("/check-status/:emp_id", checkEmployeeStatus);

/* =================================================
   CRUD
   ================================================= */
router.get("/", getAllEmployees);
router.get("/:emp_id", getEmployee);
router.put("/:emp_id", updateEmployee);
router.delete("/:emp_id", deleteEmployee);

export default router;