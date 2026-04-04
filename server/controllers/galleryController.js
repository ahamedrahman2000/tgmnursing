const supabase = require("../config/supabase");
const sharp = require("sharp");

// 📸 Upload Image
exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const { title, description } = req.body;

    // ❗ Validate input
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const fileName = `${Date.now()}-${file.originalname}`;

    // ✅ 1. Compress Image FIRST
    const compressedBuffer = await sharp(file.buffer)
      .resize({ width: 1200 }) // maintain quality
      .jpeg({ quality: 80 })   // compress
      .toBuffer();

    // ✅ 2. Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, compressedBuffer, {
        contentType: "image/jpeg",
      });

    if (uploadError) {
      console.error(uploadError);
      return res.status(500).json({ error: "Upload failed" });
    }

    // ✅ 3. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // ✅ 4. Save to database
    const { error: dbError } = await supabase
      .from("gallery")
      .insert([
        {
          image_url: imageUrl,
          title,
          description,
        },
      ]);

    if (dbError) {
      console.error(dbError);
      return res.status(500).json({ error: "Database insert failed" });
    }

    res.json({
      message: "Upload success",
      imageUrl,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 🖼️ Get Images
exports.getImages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Fetch failed" });
    }

    res.json(data || []);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id, image_url } = req.body;

    // ❗ Extract file name from URL
    const fileName = image_url.split("/").pop();

    // 🗑️ Delete from storage
    const { error: storageError } = await supabase.storage
      .from("gallery")
      .remove([fileName]);

    if (storageError) {
      return res.status(500).json({ error: "Storage delete failed" });
    }

    // 🗑️ Delete from DB
    const { error: dbError } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (dbError) {
      return res.status(500).json({ error: "DB delete failed" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};