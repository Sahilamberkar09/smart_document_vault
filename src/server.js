import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Optimized: Added CORS
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend to communicate

app.get("/", (req, res) => {
  res.send("Smart Document Vault API is Running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/document", documentRoutes); // Note: Route path consistent with controller

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
