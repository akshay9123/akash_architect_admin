import express from "express";
import dotenv from "dotenv";
import Cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import projectRoutes from "../Backend/routers/admin.router.js";
import contactRoutes from "../Backend/routers/contactQuery.router.js";
import dbConn from "./Db_Conn/DB_CONN.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Required for ES module to access __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cookieParser());
app.use(express.json());

// Allow CORS for frontend ports
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500'];

app.use(
  Cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Connect to DB
dbConn();

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/uploads', express.static('uploads'));


// Routes
app.get("/", (req, res) => {
  res.send(`Server running on PORT ${PORT}`);
});

app.use("/api/v1/admin", projectRoutes);
app.use("/contact", contactRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is listening on PORT ${PORT}`);
});
