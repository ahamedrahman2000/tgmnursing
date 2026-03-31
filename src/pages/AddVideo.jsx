import   { useState } from "react";

const AddVideos = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const token = localStorage.getItem("token");

  const handleAdd = async () => {
    if (!videoUrl) return alert("Enter URL");

    await fetch("https://tgmnursing.onrender.com/api/videos/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ video_url: videoUrl }),
    });

    alert("Video Added 🎥");
    setVideoUrl("");
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">Add Video</h2>

      <input
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="YouTube Link"
        className="w-full border p-2 mb-3 rounded"
      />

      <button
        onClick={handleAdd}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Video
      </button>
    </div>
  );
};

export default AddVideos;