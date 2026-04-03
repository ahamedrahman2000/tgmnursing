import { useEffect, useState } from "react";

const VideoPage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("https://tgmnursing.onrender.com/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data || []))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // ✅ Same YouTube fix
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
    <div className="p-4 max-w-6xl mx-auto">

      <h1 className="text-xl md:text-2xl font-bold text-center text-blue-700 mb-6">
        Our Training Videos
      </h1>

      {videos.length === 0 ? (
        <p className="text-center text-gray-500">No videos available</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map((v) => (
            <iframe
              key={v.id}
              src={getEmbedUrl(v.video_url)}
              title="video"
              className="w-full h-40 md:h-52 rounded-lg shadow"
              allowFullScreen
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default VideoPage;