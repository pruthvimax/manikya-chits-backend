import Employee from "../models/Employee.js";
import Group from "../models/Group.js";
import Member from "../models/Member.js";
import bcrypt from "bcryptjs";

/* =================================================
   EMPLOYEE CRUD
   ================================================= */

// ADD EMPLOYEE (let middleware hash)
export const addEmployee = async (req, res) => {
  try {
    const { emp_id, name, email, phone, address, password } = req.body;

    if (!emp_id || !name || !phone || !address || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await Employee.findOne({ emp_id });
    if (exists) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const employee = new Employee({
      emp_id,
      name,
      email,
      phone,
      address,
      password, // ✅ plain password
    });

    await employee.save(); // ✅ middleware hashes

    res.status(201).json({ message: "Employee added", employee });
  } catch (err) {
    res.status(500).json({ message: "Failed to add employee" });
  }
};

// GET ALL EMPLOYEES
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}, { password: 0 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

// GET SINGLE EMPLOYEE
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne(
      { emp_id: req.params.emp_id },
      { password: 0 }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employee" });
  }
};

// ✅ UPDATE EMPLOYEE (FIXED)
export const updateEmployee = async (req, res) => {
  try {
      console.log("Received featureAccess:", req.body.featureAccess);
    const employee = await Employee.findOne({ emp_id: req.params.emp_id });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // update normal fields
    employee.name = req.body.name ?? employee.name;
    employee.email = req.body.email ?? employee.email;
    employee.phone = req.body.phone ?? employee.phone;
    employee.address = req.body.address ?? employee.address;
    employee.status = req.body.status ?? employee.status; 
    employee.featureAccess =
  req.body.featureAccess ?? employee.featureAccess;

    // ✅ HANDLE PASSWORD CORRECTLY
    if (req.body.password && req.body.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
     employee.password = req.body.password; // ✅ plain
    }

    await employee.save(); // ✅ triggers middleware also

    res.json({ message: "Employee updated", employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update employee" });
  }
};

// DELETE EMPLOYEE
export const deleteEmployee = async (req, res) => {
  try {
    await Employee.findOneAndDelete({ emp_id: req.params.emp_id });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete employee" });
  }
};

/* =================================================
   EMPLOYEE LOGIN
   ================================================= */

export const loginEmployee = async (req, res) => {
  try {
    const { emp_id, password } = req.body;

    if (!emp_id || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const employee = await Employee.findOne({ emp_id });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.status !== "active") {
      return res.status(403).json({ message: "Account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      employee: {
        emp_id: employee.emp_id,
        name: employee.name,
        phone: employee.phone,
        status: employee.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* =================================================
   DASHBOARD + COLLECTIONS (UNCHANGED)
   ================================================= */

export const getEmployeeDashboardSummary = async (req, res) => {
  try {
    const totalGroups = await Group.countDocuments();
    const totalMembers = await Member.countDocuments();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    let todayCollection = 0;
    let pendingCount = 0;

    const groups = await Group.find();

    groups.forEach((group) => {
      group.members.forEach((member) => {
        member.collections.forEach((month) => {
          const totalPaid = month.payments.reduce(
            (sum, p) => sum + p.amount,
            0
          );

          if (totalPaid < group.installmentAmount) {
            pendingCount++;
          }

          month.payments.forEach((payment) => {
            if (payment.paidAt >= todayStart) {
              todayCollection += payment.amount;
            }
          });
        });
      });
    });

    res.json({
      totalGroups,
      totalMembers,
      todayCollection,
      pendingCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

export const getEmployeeCollections = async (req, res) => {
  try {
    const collections = [];
    const groups = await Group.find();

    groups.forEach((group) => {
      group.members.forEach((member) => {
        member.collections.forEach((month) => {
          month.payments.forEach((payment) => {
            collections.push({
              groupId: group.groupId,
              chitId: group.chitId,
              memberId: member.memberId,
              monthIndex: month.monthIndex,
              amount: payment.amount,
              date: payment.paidAt,
              collectedBy: payment.collectedBy,
            });
          });
        });
      });
    });

    collections.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: "Failed to load collections" });
  }
};

export const checkEmployeeStatus = async (req, res) => {
  try {
    const employee = await Employee.findOne({ emp_id: req.params.emp_id });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

res.json({
  status: employee.status,
  featureAccess: employee.featureAccess,
});

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

