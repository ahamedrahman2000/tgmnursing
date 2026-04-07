import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

const AddEvents = () => {
  const [events, setEvents] = useState([]);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [editId, setEditId] = useState(null);

  // 📥 FETCH EVENTS
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setEvents(data || []);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🖼 IMAGE PREVIEW
  const handleImage = (file) => {
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // 📤 UPLOAD IMAGE
  const uploadImage = async () => {
    if (!image) return null;

    // 🔥 FIX: remove spaces
    const fileName = `${Date.now()}-${image.name.replace(/\s/g, "")}`;

    const { error } = await supabase.storage
      .from("gallery")
      .upload(fileName, image, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
      return null;
    }

    const { data } = supabase.storage.from("gallery").getPublicUrl(fileName);

    return data.publicUrl;
  };

  // 💾 SUBMIT / UPDATE
  const handleSubmit = async () => {
    let imageUrl = preview;

    // 🔷 Upload new image only if selected
    if (image) {
      imageUrl = await uploadImage();
      if (!imageUrl) return;
    }

    if (editId) {
      // ✏️ UPDATE
      const { error } = await supabase
        .from("gallery")
        .update({
          title,
          description,
          date,
          image_url: imageUrl,
        })
        .eq("id", editId);

      if (error) {
        console.error("Update error:", error.message);
      } else {
        alert("Event updated");
      }
    } else {
      // ➕ INSERT
      const { error } = await supabase.from("gallery").insert([
        {
          title,
          description,
          date,
          image_url: imageUrl,
        },
      ]);

      if (error) {
        console.error("Insert error:", error.message);
      } else {
        alert("Event added");
      }
    }

    resetForm();
    fetchEvents(); // 🔥 refresh list
  };

  // ✏️ EDIT
  const handleEdit = (e) => {
    setTitle(e.title);
    setDate(e.date || "");
    setDescription(e.description);
    setPreview(e.image_url);
    setImage(null);
    setEditId(e.id);
  };

  // 🗑 DELETE
  const handleDelete = async (e) => {
    if (!window.confirm("Delete this event?")) return;

    const { error } = await supabase.from("gallery").delete().eq("id", e.id);

    if (error) {
      console.error("Delete error:", error.message);
    } else {
      fetchEvents();
    }
  };

  // 🔄 RESET
  const resetForm = () => {
    setTitle("");
    setDate("");
    setDescription("");
    setImage(null);
    setPreview("");
    setEditId(null);
  };

  return (
    <div>
      {/* 🧾 FORM */}
      <div className="bg-white   md:p-6 rounded-2xl shadow-lg max-w-7xl mb-6">
        <h2 className="text-lg md:text-xl font-bold mb-4">
          {editId ? "✏️ Edit Event" : "➕ Add Event"}
        </h2>

        <div className="grid gap-3 p-1">
          <input
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input text-sm md:text-base py-2 md:py-3"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input text-sm md:text-base py-2 md:py-3"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input text-sm md:text-base py-2 md:py-3"
          />

          {/* IMAGE */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImage(e.target.files[0])}
            className="text-sm"
          />

          {/* PREVIEW */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-full h-32 md:h-48 object-cover rounded-lg border"
            />
          )}

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-5 py-2 rounded-lg text-sm md:text-base"
            >
              {editId ? "Update" : "Submit"}
            </button>

            {editId && (
              <button
                onClick={resetForm}
                className="bg-gray-400 text-white px-3 md:px-5 py-2 rounded-lg text-sm md:text-base"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 📋 EVENTS LIST */}
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <h2 className="font-bold mb-4 text-sm md:text-base">📋 All Events</h2>

        <div className="grid md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
          {events.map((e) => (
            <div
              key={e.id}
              className="flex flex-col md:flex-row gap-2 md:gap-3 p-2 md:p-3 border rounded-xl hover:shadow"
            >
              <img
                src={e.image_url}
                alt=""
                className="w-full md:w-24 h-32 md:h-20 object-cover rounded-lg"
              />

              <div className="flex-1">
                <p className="font-semibold text-sm md:text-base">{e.title}</p>

                <p className="text-xs text-gray-500">
                  {e.date ? new Date(e.date).toLocaleDateString() : "No date"}
                </p>

                <p className="text-xs md:text-sm line-clamp-2">
                  {e.description}
                </p>
              </div>

              <div className="flex md:flex-col gap-3 md:gap-2 justify-end">
                <button
                  onClick={() => handleEdit(e)}
                  className="text-blue-600 text-sm"
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleDelete(e)}
                  className="text-red-600 text-sm"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddEvents;
