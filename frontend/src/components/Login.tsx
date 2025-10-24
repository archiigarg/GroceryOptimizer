import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";

interface LoginProps {
  onError: (error: string) => void;
}

export function Login({ onError }: LoginProps) {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    onError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Get the ID token and create user in backend
      const token = await result.user.getIdToken();
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to create user in backend");
      }
      
      const data = await response.json();
      console.log("User created/verified in backend:", data);
    } catch (err: any) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pantry-background">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🧺</div>
            <h1 className="text-4xl font-bold text-amber-900 mb-2">
              My Digital Pantry
            </h1>
            <p className="text-amber-700">
              Sign in to manage your groceries
            </p>
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-900 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
          <p className="text-xs text-amber-600 text-center mt-6">
            Keep track of your groceries and expiry dates
          </p>
        </div>
      </div>
    </div>
  );
}
