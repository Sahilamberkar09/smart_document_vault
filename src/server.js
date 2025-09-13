import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import connectDB from "./config/db.js";

const app = express();
app.use(express.json());

// ENV file configuration
dotenv.config();

// Database Connection
connectDB();

app.get("/", (req, res) => {
  res.send("Smart Document Vault API is Running...");
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/document", documentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("API Running on Port: ", PORT);
});
