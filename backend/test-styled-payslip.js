const pdfGenerator = require('./utils/pdfGenerator');
const path = require('path');

// Test data with leave information
const testPayroll = {
  UserID: 'EMP001',
  MonthYear: 'Oct-2025',
  Name: 'John Doe',
  Email: 'john.doe@intmavens.com',
  GrossSalary: 75000,
  PF: 9000,
  ESI: 562.5,
  TDS: 7500,
  NetSalary: 57937.5,
  Bonus: 5000,
  Deduction: 1000,
  LOPDays: 2,
  LOPDeduction: 5000,
  TotalLeaves: 5,
  LeaveTypes: ['Sick Leave', 'LOP', 'Casual Leave']
};

const outputPath = path.join(__dirname, 'payslips', 'test-detailed-payslip.pdf');

console.log('Generating detailed payslip with leave information...');
pdfGenerator.generatePayslip(testPayroll, outputPath)
  .then(() => {
    console.log('✅ Detailed payslip generated successfully!');
    console.log(`📄 File saved at: ${outputPath}`);
  })
  .catch((err) => {
    console.error('❌ Error generating payslip:', err);
  });