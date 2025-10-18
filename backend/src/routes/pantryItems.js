import express from "express";
import auth from "../middleware/auth.js";
import PantryItem from "../models/PantryItem.js";

const router = express.Router();

// Get all pantry items for the authenticated user
router.get("/pantry-items", auth, async (req, res) => {
  try {
    const items = await PantryItem.find({ userId: req.user.uid }).sort({ expiryDate: 1 });
    res.json(items);
  } catch (error) {
    console.error("Error fetching pantry items:", error);
    res.status(500).json({ error: "Failed to fetch pantry items" });
  }
});

// Create a new pantry item
router.post("/pantry-items", auth, async (req, res) => {
  try {
    const { name, category, quantity, unit, expiryDate } = req.body;
    
    // Validation
    if (!name || !category || !quantity || !unit || !expiryDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newItem = new PantryItem({
      userId: req.user.uid,
      name,
      category,
      quantity,
      unit,
      expiryDate: new Date(expiryDate),
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating pantry item:", error);
    res.status(500).json({ error: "Failed to create pantry item" });
  }
});

// Update a pantry item
router.put("/pantry-items/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, unit, expiryDate } = req.body;

    const item = await PantryItem.findOne({ _id: id, userId: req.user.uid });
    
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Update fields
    if (name !== undefined) item.name = name;
    if (category !== undefined) item.category = category;
    if (quantity !== undefined) item.quantity = quantity;
    if (unit !== undefined) item.unit = unit;
    if (expiryDate !== undefined) item.expiryDate = new Date(expiryDate);

    await item.save();
    res.json(item);
  } catch (error) {
    console.error("Error updating pantry item:", error);
    res.status(500).json({ error: "Failed to update pantry item" });
  }
});

// Delete a pantry item
router.delete("/pantry-items/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await PantryItem.findOneAndDelete({ _id: id, userId: req.user.uid });
    
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted successfully", item });
  } catch (error) {
    console.error("Error deleting pantry item:", error);
    res.status(500).json({ error: "Failed to delete pantry item" });
  }
});

export default router;
