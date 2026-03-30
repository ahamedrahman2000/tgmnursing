import   { useState } from "react";

const AddEvents = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    if (!title || !description || !date || !image) {
      return alert("Fill all fields");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("image", image);

    const res = await fetch("http://localhost:5000/api/gallery/upload", {
      method: "POST",
      headers: { Authorization: token },
      body: formData,
    });

    if (res.ok) {
      alert("Event Added ✅");
      setTitle("");
      setDescription("");
      setDate("");
      setImage(null);
    } else {
      alert("Error ❌");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">Add Event</h2>

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
        Submit
      </button>
    </div>
  );
};

export default AddEvents;