const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");

const app = express();

// ✅ Middleware (MUST come first)
app.use(cors());
app.use(express.json());

// ✅ Routes
const galleryRoutes = require("./routes/galleryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const videoRoutes = require("./routes/videoRoutes");
const studentRoutes = require("./routes/studentRoutes");

app.use("/api/students", studentRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gallery", galleryRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// ✅ Supabase Test
app.get("/test-supabase", async (req, res) => {
  const { data, error } = await supabase.from("gallery").select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});