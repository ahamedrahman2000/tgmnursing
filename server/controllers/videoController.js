const supabase = require("../config/supabase");

// ➕ Add Video
exports.addVideo = async (req, res) => {
  try {
    const { video_url } = req.body;

    const { error } = await supabase
      .from("videos")
      .insert([{ video_url }]);

    if (error) {
      return res.status(500).json({ error });
    }

    res.json({ message: "Video added" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 Get Videos
exports.getVideos = async (req, res) => {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error });
  }

  res.json(data);
};