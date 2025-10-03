const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const salaryAdjustmentRoutes = require("./routes/salaryAdjustmentRoutes");
const payrollRunRoutes = require("./routes/payrollRunRoutes");
const reportRoutes = require("./routes/reportRoutes");
const payslipRoutes = require("./routes/payslipRoutes");
const complianceRoutes = require("./routes/complianceRoutes");

dotenv.config(); 

const app = express();

app.use(cors());
app.use(express.json());

const pool = require("./config/db");

pool.getConnection()
  .then(conn => {
    console.log("✅ MySQL connected!");
    conn.release();
  })
  .catch(err => console.error("❌ DB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/payroll-base", payrollRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/adjustments", salaryAdjustmentRoutes);
app.use("/api/payroll-runs", payrollRunRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/payslips", payslipRoutes);
app.use("/api/compliance", complianceRoutes);


// Root route
app.get("/", (req, res) => {
  res.send("🚀 Payroll & Compliance Engine API running...");
});

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
