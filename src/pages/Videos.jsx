import   { useEffect, useState } from "react";

export const Videos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data || []));
  }, []);

  const getEmbedUrl = (url) => `https://www.youtube.com/embed/${url.split("v=")[1]}`;

  return (
    <div>
      <h2 className="font-bold mb-2">Training Videos</h2>
      {videos.slice(0, 2).map((v) => (
        <iframe key={v.id} src={getEmbedUrl(v.video_url)}  title="map" className="w-full h-44 rounded mb-2" />
      ))}
    </div>
  );
};