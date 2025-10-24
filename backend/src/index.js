import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import pantryItemsRoutes from "./routes/pantryItems.js";


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true },
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("\nMongoDB connection error:", err.message);
  });

app.get("/", (req, res) => {
  res.send("API is running!");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Protected routes (require Firebase auth)
app.use("/api", protectedRoutes);
app.use("/api", pantryItemsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
