import React, { useState } from "react";
import { Plus, X } from "lucide-react";

export interface AddItemFormData {
  name: string;
  category: string;
  quantity: string;
  unit: string;
  expiryDate: string;
}

interface AddItemFormProps {
  onSubmit: (data: AddItemFormData) => void;
}

export const CATEGORIES = [
  { value: "produce", label: "🥬 Produce", emoji: "🥬" },
  { value: "dairy", label: "🧀 Dairy", emoji: "🧀" },
  { value: "meat", label: "🥩 Meat", emoji: "🥩" },
  { value: "pantry", label: "🥫 Pantry", emoji: "🥫" },
  { value: "frozen", label: "🧊 Frozen", emoji: "🧊" },
  { value: "beverages", label: "🥤 Beverages", emoji: "🥤" },
  { value: "other", label: "📦 Other", emoji: "📦" },
];

export const UNITS = ["item", "kg", "g", "L", "ml", "cup", "tbsp", "tsp"];

export function AddItemForm({ onSubmit }: AddItemFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<AddItemFormData>({
    name: "",
    category: "other",
    quantity: "1",
    unit: "item",
    expiryDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      category: "other",
      quantity: "1",
      unit: "item",
      expiryDate: "",
    });
    setShowForm(false);
  };

  return (
    <div className="mb-8">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-900 font-semibold text-lg px-6 py-3 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto sm:mx-0"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      ) : (
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-amber-900">Add Item to Pantry</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-amber-700 hover:text-amber-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Item Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Milk, Apples, Bread"
                className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Quantity
              </label>
              <input
                type="number"
                required
                min="0.1"
                step="0.1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50"
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-900 font-semibold"
              >
                Add to Pantry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
