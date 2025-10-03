
const Adjustment = require("../models/salaryAdjustmentModel");

// Create Adjustment
const createAdjustment = async (req, res) => {
  try {
    const { UserID, AdjustmentType, Amount, MonthYear, Remarks } = req.body;

    if (!UserID || !AdjustmentType || !Amount || !MonthYear) {
      console.error("[createAdjustment] Missing fields:", req.body);
      return res.status(400).json({ error: "Missing required fields: UserID, AdjustmentType, Amount, MonthYear" });
    }

    const adjustmentId = await Adjustment.create({ UserID, AdjustmentType, Amount, MonthYear, Remarks });
    res.status(201).json({ message: "Salary adjustment created", AdjustmentID: adjustmentId });
  } catch (err) {
    console.error("[createAdjustment] DB/API error:", err);
    res.status(500).json({ error: err.message || "Failed to create salary adjustment" });
  }
};

// Get All Adjustments
const getAllAdjustments = async (req, res) => {
  try {
    const adjustments = await Adjustment.getAll();
    res.status(200).json(adjustments);
  } catch (err) {
    console.error("[getAllAdjustments] DB/API error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch salary adjustments" });
  }
};

// Get User Adjustments
const getUserAdjustments = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      console.error("[getUserAdjustments] Missing userId param:", req.params);
      return res.status(400).json({ error: "Missing userId parameter" });
    }
    const adjustments = await Adjustment.getByUserId(userId);
    res.status(200).json(adjustments);
  } catch (err) {
    console.error("[getUserAdjustments] DB/API error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch user salary adjustments" });
  }
};

// Update Adjustment
const updateAdjustment = async (req, res) => {
  try {
    const { AdjustmentID } = req.params;
    const { AdjustmentType, Amount, MonthYear, Remarks } = req.body;

    if (!AdjustmentType || !Amount || !MonthYear) {
      console.error("[updateAdjustment] Missing fields:", req.body);
      return res.status(400).json({ error: "Missing required fields: AdjustmentType, Amount, MonthYear" });
    }

    const updated = await Adjustment.update(AdjustmentID, { AdjustmentType, Amount, MonthYear, Remarks });
    if (updated > 0) {
      res.status(200).json({ message: "Adjustment updated" });
    } else {
      console.error("[updateAdjustment] Adjustment not found for ID:", AdjustmentID);
      res.status(404).json({ error: "Adjustment not found" });
    }
  } catch (err) {
    console.error("[updateAdjustment] DB/API error:", err);
    res.status(500).json({ error: err.message || "Failed to update salary adjustment" });
  }
};

// Delete Adjustment
const deleteAdjustment = async (req, res) => {
  try {
    const { AdjustmentID } = req.params;
    const deleted = await Adjustment.remove(AdjustmentID);

    if (deleted > 0) {
      res.status(200).json({ message: "Adjustment deleted" });
    } else {
      console.error("[deleteAdjustment] Adjustment not found for ID:", AdjustmentID);
      res.status(404).json({ error: "Adjustment not found" });
    }
  } catch (err) {
    console.error("[deleteAdjustment] DB/API error:", err);
    res.status(500).json({ error: err.message || "Failed to delete salary adjustment" });
  }
};

module.exports = { createAdjustment, getAllAdjustments, getUserAdjustments, updateAdjustment, deleteAdjustment };
