import express from "express";
import { checkEmployeeStatus } from "../controllers/employeeController.js";
import {
  addEmployee,
  getEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  loginEmployee,
  getEmployeeDashboardSummary,
  getEmployeeCollections,
} from "../controllers/employeeController.js";

const router = express.Router();

/* =================================================
   ============ AUTH & EMPLOYEE APIs ===============
   ================================================= */

// AUTH
router.post("/add", addEmployee);
router.post("/login", loginEmployee);

/* =================================================
   ============ DASHBOARD & COLLECTIONS ============
   🔴 MUST COME BEFORE "/:emp_id"
   ================================================= */

// EMPLOYEE DASHBOARD
router.get("/dashboard/summary", getEmployeeDashboardSummary);

// EMPLOYEE COLLECTIONS
router.get("/collections", getEmployeeCollections);

/* =================================================
   ============ EMPLOYEE CRUD ======================
   ================================================= */

// GET ALL EMPLOYEES
router.get("/", getAllEmployees);

// GET ONE EMPLOYEE
router.get("/:emp_id", getEmployee);

// UPDATE EMPLOYEE
router.put("/:emp_id", updateEmployee);

// DELETE EMPLOYEE
router.delete("/:emp_id", deleteEmployee);
router.get("/check-status/:emp_id", checkEmployeeStatus);


console.log("EMPLOYEE CONTROLLER EXPORTS:", {
  addEmployee,
});

export default router;
