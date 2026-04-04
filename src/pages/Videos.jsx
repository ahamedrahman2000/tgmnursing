// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const Videos = () => {
//   const [videos, setVideos] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("https://tgmnursing.onrender.com/api/videos")
//       .then((res) => res.json())
//       .then((data) => setVideos(data || []))
//       .catch((err) => console.error("Fetch error:", err));
//   }, []);

//   // ✅ YouTube URL Fix
//   const getEmbedUrl = (url) => {
//     if (!url) return "";

//     if (url.includes("youtu.be")) {
//       return `https://www.youtube.com/embed/${url.split("/").pop()}`;
//     }

//     if (url.includes("watch?v=")) {
//       return `https://www.youtube.com/embed/${url.split("v=")[1]}`;
//     }

//     if (url.includes("embed")) {
//       return url;
//     }

//     return url;
//   };

//   return (
//     <div className="mt-4">
//       {/* 🔥 HEADER WITH BUTTON */}
//       <div className="flex justify-between items-center mb-3 px-2">
//         <h2 className="font-bold text-lg md:text-xl">Training Videos</h2>

//         <button
//           onClick={() => navigate("/gallery/videos")}
//           className="text-blue-600 text-sm"
//         >
//           View All →
//         </button>
//       </div>

//       {/* 🎥 VIDEOS */}
//       {videos.length === 0 ? (
//         <p className="text-center text-gray-500">No videos found</p>
//       ) : (
//         <div className="grid grid-cols-2 gap-3 px-1">
//           {videos.slice(0, 4).map(
//             (
//               v, // ✅ ONLY 4 VIDEOS
//             ) => (
//               <iframe
//                 key={v.id}
//                 src={getEmbedUrl(v.video_url)}
//                 title="video"
//                 className="w-full h-40 md:h-48 rounded-lg shadow"
//                 allowFullScreen
//               />
//             ),
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// Videos.jsx
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

      {/* 🎥 VIDEOS */}
      {videos.length === 0 ? (
        <p className="text-center text-gray-500">No videos found</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-1">
          {videos.slice(0, 4).map((v) => (
            <iframe
              key={v.id}
              src={getEmbedUrl(v.video_url)}
              title={v.title || "video"}
              className="w-full h-40 md:h-48 rounded-lg shadow"
              allowFullScreen
            />
          ))}
        </div>
      )}
    </div>
  );
};