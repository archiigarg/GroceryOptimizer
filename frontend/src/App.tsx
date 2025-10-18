import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./lib/firebase";
import { Login } from "./components/Login";
import { PantryDashboard } from "./components/PantryDashboard";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="pantry-background min-h-screen flex items-center justify-center">
        <div className="text-amber-900 text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Login onError={setError} />
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-50 border-2 border-red-200 rounded-xl p-4 shadow-lg max-w-md">
            <p className="text-red-900 text-sm">{error}</p>
          </div>
        )}
      </>
    );
  }

  return <PantryDashboard user={user} onLogout={handleLogout} />;
}

export default App;

