const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();

// DNS fix (optional but ok)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// ===================== MIDDLEWARES =====================
app.use(
  cors({
    origin: "https://job-portal-system-app.netlify.app/",
  }),
);
app.use(express.json());

// ===================== DATABASE =====================
connectDB();

// ===================== ROUTES =====================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// ===================== TEST ROUTE =====================
app.get("/", (req, res) => {
  res.send("Backend Server Running 🚀");
});

// ===================== START SERVER =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});