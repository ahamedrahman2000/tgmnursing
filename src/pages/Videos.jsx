import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient"; // make sure this is initialized

export const Videos = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch videos from Supabase
  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false }); // newest first

    if (error) {
      console.error("Supabase fetch error:", error.message);
    } else {
      setVideos(data || []);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // ✅ Convert YouTube URLs to embed URLs
  const getEmbedUrl = (url) => {
    if (!url) return "";

    const videoIdMatch = url.match(
      /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&]+)/,
    );

    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : url;
  };

  return (
    <div className="mt-4 mb-4">
      {/* 🔥 HEADER WITH BUTTON */}
      <div className="flex justify-between items-center mb-3 px-2">
        <h2 className="font-bold text-lg md:text-xl">Training Videos</h2>

        <button
          onClick={() => navigate("/gallery/videos")}
          className="text-blue-600 text-sm"
        >
          View All →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
        {videos.slice(0, 4).map((v) => (
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
            <iframe
              src={getEmbedUrl(v.video_url)}
              className="w-full h-48"
              allowFullScreen
            />

            <div className="p-3">
              <p className="text-xs text-gray-500">🎥 Training Video</p>

              <p className="text-sm font-semibold mt-1 truncate">
                {v.video_url}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
