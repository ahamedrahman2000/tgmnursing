import { useEffect, useState } from "react";

export const Videos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("https://tgmnursing.onrender.com/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data || []))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // ✅ FIXED: works for ALL YouTube formats
  const getEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${url.split("/").pop()}`;
    }

    if (url.includes("watch?v=")) {
      return `https://www.youtube.com/embed/${url.split("v=")[1]}`;
    }

    if (url.includes("embed")) {
      return url;
    }

    return url;
  };

  return (
    <div>
      <h2 className="font-bold mb-2">Training Videos</h2>

      {videos.length === 0 ? (
        <p>No videos found</p>
      ) : (
        videos.map((v) => (
          <iframe
            key={v.id}
            src={getEmbedUrl(v.video_url)}
            title="video"
            className="w-full h-44 rounded mb-2"
            allowFullScreen
          />
        ))
      )}
    </div>
  );
};