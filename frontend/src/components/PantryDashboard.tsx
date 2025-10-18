import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { AlertCircle } from "lucide-react";
import { AddItemForm } from "./AddItemForm";
import type { AddItemFormData } from "./AddItemForm";
import { PantryItem } from "./PantryItem";
import type { PantryItemData } from "./PantryItem";

interface PantryDashboardProps {
  user: User;
  onLogout: () => void;
}

export function PantryDashboard({ user, onLogout }: PantryDashboardProps) {
  const [items, setItems] = useState<PantryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:5000/api";

  const fetchItems = async () => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/pantry-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch items");
      const data = await res.json();
      setItems(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (formData: AddItemFormData) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/pantry-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity),
        }),
      });
      if (!res.ok) throw new Error("Failed to add item");
      await fetchItems();
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding item:", err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/pantry-items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      await fetchItems();
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Error deleting item:", err);
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Categorize items
  const expiredItems = items.filter((item) => getDaysUntilExpiry(item.expiryDate) < 0);
  const expiringSoonItems = items
    .filter((item) => {
      const days = getDaysUntilExpiry(item.expiryDate);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate));
  const goodItems = items
    .filter((item) => getDaysUntilExpiry(item.expiryDate) > 7)
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  if (loading) {
    return (
      <div className="pantry-background min-h-screen flex items-center justify-center">
        <div className="text-amber-900 text-xl font-semibold">Loading your pantry...</div>
      </div>
    );
  }

  return (
    <div className="pantry-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        {/* Header with User Info */}
        <header className="mb-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-amber-900 mb-2" style={{ textWrap: "balance" }}>
                My Digital Pantry
              </h1>
              <p className="text-amber-700">Keep track of your groceries and expiry dates</p>
            </div>
            <div className="flex items-center gap-4">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-12 h-12 rounded-full border-2 border-amber-300"
                />
              )}
              <div className="text-right">
                <div className="text-sm font-semibold text-amber-900">{user.displayName}</div>
                <button
                  onClick={onLogout}
                  className="text-xs text-amber-600 hover:text-amber-800 underline"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-900 text-sm">{error}</p>
          </div>
        )}

        {/* Add Item Form */}
        <AddItemForm onSubmit={handleAddItem} />

        {/* Expired Items Alert */}
        {expiredItems.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-red-900">Expired Items</h3>
                <p className="text-sm text-red-700">
                  You have {expiredItems.length} expired item(s) that should be removed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Expiring Soon Section */}
        {expiringSoonItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <span>⏰</span>
              Expiring Soon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expiringSoonItems.map((item) => (
                <PantryItem
                  key={item._id}
                  item={item}
                  onDelete={handleDeleteItem}
                  showUrgency={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Your Pantry Section */}
        <div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span>🧺</span>
            Your Pantry ({items.length} items)
          </h2>
          {items.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-amber-200 rounded-2xl p-12 text-center">
              <p className="text-lg text-amber-700">
                Your pantry is empty. Add your first item!
              </p>
            </div>
          ) : goodItems.length === 0 && (expiredItems.length > 0 || expiringSoonItems.length > 0) ? (
            <div className="bg-white border-2 border-dashed border-amber-200 rounded-2xl p-12 text-center">
              <p className="text-lg text-amber-700">
                All items are expiring soon or expired!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goodItems.map((item) => (
                <PantryItem
                  key={item._id}
                  item={item}
                  onDelete={handleDeleteItem}
                  showUrgency={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
