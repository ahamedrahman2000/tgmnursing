import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const GalleryPage = () => {
  const { type } = useParams();

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // 🔄 FETCH BOTH
  const fetchData = async () => {
    setLoading(true);

    const { data: imgData } = await supabase
      .from("gallery")
      .select("*")
      .order("date", { ascending: false });

    const { data: vidData } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    setImages(imgData || []);
    setVideos(vidData || []);
    setLoading(false);
  };

  // 🎥 YOUTUBE FIX
  const getEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${url.split("/").pop()}`;
    }

    if (url.includes("watch?v=")) {
      return `https://www.youtube.com/embed/${url.split("v=")[1]}`;
    }

    return url;
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Loading gallery...</div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen px-4 sm:px-8 md:px-14 py-10">
      {/* 🔥 TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-12">
        Gallery & Events
      </h1>

      {/* 🔹 EVENTS */}
      {type !== "videos" && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            📸 Events
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelected({ type: "image", data: img })}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer"
              >
                {/* IMAGE (NO BAD CROP) */}
                <div className="bg-black flex items-center justify-center">
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="h-52 w-full object-contain group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                    {img.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {img.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🔹 VIDEOS */}
      {type !== "images" && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            🎥 Videos
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setSelected({ type: "video", data: vid })}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer"
              >
                <iframe
                  src={getEmbedUrl(vid.video_url)}
                  className="w-full h-48"
                  title="video"
                />

                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                    {vid.title || "Video"}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🔥 MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-2 sm:p-4 overflow-auto">
          <div className="relative w-full max-w-3xl sm:max-w-4xl bg-white rounded-2xl shadow-2xl">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-black text-2xl bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition"
            >
              ✕
            </button>

            {/* CONTENT */}
            <div className="overflow-hidden">
              {/* IMAGE */}
              {selected.type === "image" && (
                <div className="bg-black flex justify-center">
                  <img
                    src={selected.data.image_url}
                    alt={selected.data.title || ""}
                    className="w-full max-h-[60vh] sm:max-h-[70vh] object-contain"
                  />
                </div>
              )}

              {/* VIDEO */}
              {selected.type === "video" && (
                <div className="flex justify-center">
                  <iframe
                    src={getEmbedUrl(selected.data.video_url)}
                    className="w-full max-h-[60vh] sm:max-h-[70vh] rounded-lg"
                    allowFullScreen
                    title={selected.data.title || "video"}
                  />
                </div>
              )}

              {/* TEXT */}
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-lg sm:text-xl">
                  {selected.data.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  {selected.data.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
