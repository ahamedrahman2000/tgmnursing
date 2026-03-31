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

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const express = require("express");
// const cors = require("cors");

// const app = express();

// // ✅ CORS (IMPORTANT for Netlify)
// app.use(cors({
//   origin: "*", // later you can restrict to Netlify URL
// }));

// app.use(express.json());

// // ✅ TEST ROUTE
// app.get("/", (req, res) => {
//   res.send("API Running ✅");
// });

// // 👉 your routes
// app.use("/api/students", require("./routes/students"));
// app.use("/api/gallery", require("./routes/gallery"));
// app.use("/api/videos", require("./routes/videos"));
// app.use("/api/admin", require("./routes/admin"));

// // ✅ PORT FIX (VERY IMPORTANT)
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
