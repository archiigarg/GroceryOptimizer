import { Trash2, AlertTriangle } from "lucide-react";

export interface PantryItemData {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  userId: string;
}

interface PantryItemProps {
  item: PantryItemData;
  onDelete: (id: string) => void;
  showUrgency?: boolean;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  produce: "🥬",
  dairy: "🧀",
  meat: "🥩",
  pantry: "🥫",
  frozen: "🧊",
  beverages: "🥤",
  other: "📦",
};

export function PantryItem({ item, onDelete, showUrgency = false }: PantryItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getUrgencyStyles = (days: number) => {
    if (days < 0) {
      return {
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-900",
        accentColor: "text-red-600",
        message: "EXPIRED",
      };
    } else if (days === 0) {
      return {
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-900",
        accentColor: "text-orange-600",
        message: "EXPIRES TODAY",
      };
    } else if (days <= 2) {
      return {
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-900",
        accentColor: "text-orange-600",
        message: `EXPIRES IN ${days} DAY${days > 1 ? "S" : ""}`,
      };
    } else if (days <= 7) {
      return {
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-900",
        accentColor: "text-yellow-600",
        message: `EXPIRES IN ${days} DAYS`,
      };
    }
    return null;
  };

  const days = getDaysUntilExpiry(item.expiryDate);
  const styles = showUrgency ? getUrgencyStyles(days) : null;

  const containerClasses = showUrgency && styles
    ? `${styles.bgColor} border-2 ${styles.borderColor} rounded-2xl p-5 shadow-md`
    : "bg-white border-2 border-amber-100 rounded-2xl p-5 shadow-md hover:shadow-lg";

  const titleColor = showUrgency && styles ? styles.textColor : "text-amber-900";
  const quantityColor = showUrgency && styles ? styles.accentColor : "text-amber-700";
  const dividerColor = showUrgency && styles ? styles.borderColor : "border-amber-100";

  return (
    <div className={containerClasses}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-5xl">{CATEGORY_EMOJIS[item.category] || "📦"}</span>
        <button
          onClick={() => onDelete(item._id)}
          className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <h3 className={`font-bold text-lg ${titleColor} mb-1`}>{item.name}</h3>
      <p className={`text-sm ${quantityColor} mb-3`}>
        {item.quantity} {item.unit}
      </p>
      <div className={`border-t-2 ${dividerColor} pt-3`}>
        {showUrgency && styles ? (
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${styles.accentColor}`} />
            <div>
              <p className={`text-xs font-semibold ${styles.accentColor}`}>
                {styles.message}
              </p>
              <p className={`text-xs ${styles.textColor}`}>{formatDate(item.expiryDate)}</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold text-amber-600 mb-1">Expires</p>
            <p className="text-sm font-bold text-amber-900">{formatDate(item.expiryDate)}</p>
          </>
        )}
      </div>
    </div>
  );
}
