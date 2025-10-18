import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./lib/firebase";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setProfile(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const testBackend = async () => {
    setLoading(true);
    setError(null);
    setProfile(null);
    try {
      if (!user) throw new Error("Not logged in");
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Backend error: " + (await res.text()));
      const data = await res.json();
      setProfile(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Firebase Login Test
        </h1>
        {user ? (
          <>
            <div className="mb-4">
              <img src={user.photoURL || undefined} alt="avatar" className="w-16 h-16 rounded-full mx-auto mb-2" />
              <div className="font-semibold">{user.displayName}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md mr-2">Logout</button>
            <button onClick={testBackend} className="px-4 py-2 bg-primary text-primary-foreground rounded-md" disabled={loading}>
              {loading ? "Testing..." : "Test Backend"}
            </button>
            {profile && (
              <div className="mt-6 p-4 border rounded bg-card text-left">
                <div className="font-bold mb-2">Backend User Profile:</div>
                <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(profile, null, 2)}</pre>
              </div>
            )}
          </>
        ) : (
          <button onClick={handleLogin} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Login with Google</button>
        )}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
}

export default App;

