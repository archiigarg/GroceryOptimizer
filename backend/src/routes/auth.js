import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

// Login/Register endpoint - creates user in MongoDB on first login
router.post("/login", auth, (req, res) => {
  res.json({ 
    success: true,
    message: "Login successful",
    user: {
      uid: req.user.uid,
      email: req.user.email,
      displayName: req.user.displayName,
      photoURL: req.user.photoURL
    }
  });
});

export default router;
