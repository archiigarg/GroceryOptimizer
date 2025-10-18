import mongoose from "mongoose";

const pantryItemSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['produce', 'dairy', 'meat', 'pantry', 'frozen', 'beverages', 'other'],
    default: 'other'
  },
  quantity: { type: Number, required: true, min: 0 },
  unit: { 
    type: String, 
    required: true,
    enum: ['item', 'kg', 'g', 'L', 'ml', 'cup', 'tbsp', 'tsp'],
    default: 'item'
  },
  expiryDate: { type: Date, required: true },
}, {
  timestamps: true
});

// Index for efficient querying by user
pantryItemSchema.index({ userId: 1, expiryDate: 1 });

const PantryItem = mongoose.model("PantryItem", pantryItemSchema);
export default PantryItem;
