import { useEffect, useState } from "react";

const AddEvents = () => {
  const [events, setEvents] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);

  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // 🔄 FETCH EVENTS
  const fetchEvents = async () => {
    const res = await fetch("https://tgmnursing.onrender.com/api/gallery");
    const data = await res.json();
    setEvents(data || []);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ ADD / UPDATE
  const handleSubmit = async () => {
    if (!title || !description || !date) {
      return alert("Fill all fields");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    if (image) formData.append("image", image);

    const url = editId
      ? `https://tgmnursing.onrender.com/api/gallery/${editId}`
      : "https://tgmnursing.onrender.com/api/gallery/upload";

    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: token },
      body: formData,
    });

    if (res.ok) {
      alert(editId ? "Updated ✅" : "Added ✅");

      setTitle("");
      setDescription("");
      setDate("");
      setImage(null);
      setEditId(null);

      fetchEvents();
    } else {
      alert("Error ❌");
    }
  };

  // ✏️ EDIT
  const handleEdit = (e) => {
    setEditId(e.id);
    setTitle(e.title);
    setDescription(e.description);
    setDate(e.date?.split("T")[0] || "");
  };

  // 🗑 DELETE
  // const handleDelete = async (id) => {
  //   if (!window.confirm("Delete this event?")) return;

  //   const res = await fetch(
  //     `https://tgmnursing.onrender.com/api/gallery/${id}`,
  //     {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     },
  //   );

  //   if (res.ok) {
  //     alert("Deleted ✅");
  //     fetchEvents();
  //   } else {
  //     alert("Delete failed ❌");
  //   }
  // };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete Event?")) return;

    const res = await fetch(
      `https://tgmnursing.onrender.com/api/gallery/${id}`,
      {
        method: "DELETE",
      },
    );

    if (res.ok) {
      alert("Deleted ✅");
      fetchEvents();
    } else {
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* 🧾 FORM */}
      <div className="bg-white p-6 rounded shadow max-w-xl mb-6">
        <h2 className="text-xl font-bold mb-4">
          {editId ? "Edit Event" : "Add Event"}
        </h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-3"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Submit"}
        </button>
      </div>

      {/* 📋 EVENTS LIST */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-4">All Events</h2>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {events.map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-3 p-2 border rounded"
            >
              <img
                src={e.image_url}
                className="w-16 h-16 object-cover rounded"
              />

              <div className="flex-1">
                <p className="font-semibold text-sm">{e.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(e.date).toLocaleDateString()}
                </p>
              </div>

              {/* ✏️ EDIT */}
              <button
                onClick={() => handleEdit(e)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>

              {/* 🗑 DELETE */}
              <button
                onClick={() => handleDelete(e.id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddEvents;
