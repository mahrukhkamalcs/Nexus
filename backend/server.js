require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const entrepreneurRoutes = require("./routes/entrepreneurRoutes");
const investorRoutes = require("./routes/investorRoutes");
const collaborationRoutes = require("./routes/collaborationRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dealRoutes = require("./routes/dealRoutes");
const documentRoutes = require("./routes/documentRoutes");

const app = express();

/* ---------------- Global Middleware ---------------- */

// Enable Cross-Origin Resource Sharing for your frontend connection
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded media files securely
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------------- Database Connection ---------------- */

connectDB();

/* ---------------- Application Routes ---------------- */

// Authentication endpoints (Login/Register remain completely public)
app.use("/api/auth", authRoutes);

// Protected application modules (Middlewares are applied inside these route files)
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/entrepreneurs", entrepreneurRoutes);
app.use("/api/investors", investorRoutes);
app.use("/api/collaborations", collaborationRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/documents", documentRoutes);

/* ---------------- Base Home Route ---------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Nexus Backend API is running successfully."
  });
});

/* ---------------- 404 Route Catch-All ---------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

/* ---------------- Centralized Error Handling Middleware ---------------- */

app.use((err, req, res, next) => {
  console.error("Centralized Server Error Log:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

/* ---------------- Start Application Server ---------------- */

/* ---------------- Start Application Server ---------------- */

const PORT = process.env.PORT || 5000;

// Save the returned server instance into a variable named "server"
const server = app.listen(PORT, () => {
  console.log(`Server is running securely on port ${PORT}`);
});

// Now "server" is defined and can be safely passed to your socket initializer
const { initializeSocket } = require("./socket/socket");
initializeSocket(server);