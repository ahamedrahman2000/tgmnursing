import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GalleryPage = () => {
  const { type } = useParams(); // "images" or "videos"

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchImages();
    fetchVideos();
  }, []);

  const fetchImages = async () => {
    const res = await fetch("https://tgmnursing.onrender.com/api/gallery");
    const data = await res.json();
    setImages(data || []);
  };

  const fetchVideos = async () => {
    const res = await fetch("https://tgmnursing.onrender.com/api/videos");
    const data = await res.json();
    setVideos(data || []);
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-8 md:px-14 py-8">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
        Gallery & Events
      </h1>

      {/* 🔹 EVENTS (ONLY if not videos page) */}
      {type !== "videos" && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Events</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelected({ type: "image", data: img })}
                className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
              >
                <img
                  src={img.image_url}
                  alt={img.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm">
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

      {/* 🔹 VIDEOS (ONLY if not images page) */}
      {type !== "images" && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Videos</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setSelected({ type: "video", data: vid })}
                className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
              >
                <video
                  src={vid.video_url}
                  className="w-full h-48 object-cover"
                />

                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {vid.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🔥 MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="relative w-full max-w-4xl p-4">

            {/* CLOSE */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 bg-white px-3 py-1 rounded shadow"
            >
              ✕
            </button>

            {/* IMAGE */}
            {selected.type === "image" && (
              <img
                src={selected.data.image_url}
                alt=""
                className="w-full max-h-[80vh] object-contain rounded"
              />
            )}

            {/* VIDEO */}
            {selected.type === "video" && (
              <video
                src={selected.data.video_url}
                controls
                autoPlay
                className="w-full max-h-[80vh] rounded"
              />
            )}

            {/* TEXT */}
            <div className="bg-white mt-3 p-4 rounded">
              <h3 className="font-semibold">{selected.data.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {selected.data.description}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default GalleryPage;