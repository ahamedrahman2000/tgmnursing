import { useState } from "react";

export const AddVideos = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const token = localStorage.getItem("token");

  const handleAdd = async () => {
    if (!videoUrl) return alert("Enter URL");

    try {
      const res = await fetch(
        "https://tgmnursing.onrender.com/api/videos/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ video_url: videoUrl }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("Video Added 🎥");
        setVideoUrl("");
      } else {
        alert("Error ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Enter YouTube URL"
      />
      <button onClick={handleAdd}>Add Video</button>
    </div>
  );
};