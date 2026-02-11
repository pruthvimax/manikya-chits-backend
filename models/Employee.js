// models/Employee.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  emp_id: { type: String, required: true, unique: true },
  name:   { type: String, required: true },
  email:  { type: String },
  phone:  { type: String, required: true },
  address:{ type: String, required: true },
  password: { type: String, required: true },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});


const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
