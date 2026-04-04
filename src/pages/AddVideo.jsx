// import { useEffect, useState } from "react";

// export const AddVideos = () => {
//   const [videos, setVideos] = useState([]);
//   const [videoUrl, setVideoUrl] = useState("");
//   const [editId, setEditId] = useState(null);

//   const token = localStorage.getItem("token");

//   // 🔄 FETCH VIDEOS
//   const fetchVideos = async () => {
//     try {
//       const res = await fetch("https://tgmnursing.onrender.com/api/videos");
//       const data = await res.json();
//       setVideos(data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   // ➕ ADD / ✏️ UPDATE
//   const handleSubmit = async () => {
//     if (!videoUrl) return alert("Enter URL");

//     try {
//       const url = editId
//         ? `https://tgmnursing.onrender.com/api/videos/${editId}`
//         : "https://tgmnursing.onrender.com/api/videos/add";

//       const method = editId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token,
//         },
//         body: JSON.stringify({ video_url: videoUrl }),
//       });

//       if (res.ok) {
//         alert(editId ? "Updated ✅" : "Added 🎥");
//         setVideoUrl("");
//         setEditId(null);
//         fetchVideos();
//       } else {
//         alert("Error ❌");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   // ✏️ EDIT
//   const handleEdit = (v) => {
//     setEditId(v.id);
//     setVideoUrl(v.video_url);
//   };

//   // 🗑 DELETE
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this video?")) return;

//     try {
//       const res = await fetch(
//         `https://tgmnursing.onrender.com/api/videos/${id}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: token },
//         }
//       );

//       if (res.ok) {
//         alert("Deleted ✅");
//         fetchVideos();
//       } else {
//         alert("Delete failed ❌");
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-4 md:p-6">

//       {/* 🎥 FORM */}
//       <div className="bg-white p-4 rounded shadow max-w-xl mb-6">
//         <h2 className="text-lg font-bold mb-3">
//           {editId ? "Edit Video" : "Add Video"}
//         </h2>

//         <input
//           type="text"
//           value={videoUrl}
//           onChange={(e) => setVideoUrl(e.target.value)}
//           placeholder="Enter YouTube URL"
//           className="w-full border p-2 mb-3 rounded"
//         />

//         <button
//           onClick={handleSubmit}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           {editId ? "Update" : "Add Video"}
//         </button>
//       </div>

//       {/* 📋 VIDEO LIST */}
//       <div className="bg-white p-4 rounded shadow">
//         <h2 className="font-bold mb-4">All Videos</h2>

//         <div className="space-y-3 max-h-[400px] overflow-y-auto">
//           {videos.map((v) => (
//             <div
//               key={v.id}
//               className="flex items-center gap-3 p-2 border rounded"
//             >
//               {/* Thumbnail */}
//               <iframe
//                 src={v.video_url.replace("watch?v=", "embed/")}
//                 className="w-24 h-16 rounded"
//                 title="video"
//               />

//               <div className="flex-1">
//                 <p className="text-xs break-all">{v.video_url}</p>
//               </div>

//               {/* ✏️ EDIT */}
//               <button
//                 onClick={() => handleEdit(v)}
//                 className="text-blue-600 text-sm"
//               >
//                 Edit
//               </button>

//               {/* 🗑 DELETE */}
//               <button
//                 onClick={() => handleDelete(v.id)}
//                 className="text-red-600 text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   );
// };

import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

export const AddVideos = () => {
  const [videos, setVideos] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [editId, setEditId] = useState(null);

  // 🔄 FETCH VIDEOS
  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setVideos(data || []);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // ➕ ADD / ✏️ UPDATE
  const handleSubmit = async () => {
    if (!videoUrl) return alert("Enter URL");

    if (editId) {
      // ✏️ UPDATE
      const { error } = await supabase
        .from("videos")
        .update({ video_url: videoUrl })
        .eq("id", editId);

      if (error) {
        alert("Update failed ❌");
      } else {
        alert("Updated ✅");
      }
    } else {
      // ➕ ADD
      const { error } = await supabase
        .from("videos")
        .insert([{ video_url: videoUrl }]);

      if (error) {
        alert("Error ❌");
      } else {
        alert("Added 🎥");
      }
    }

    setVideoUrl("");
    setEditId(null);
    fetchVideos();
  };

  // ✏️ EDIT
  const handleEdit = (v) => {
    setEditId(v.id);
    setVideoUrl(v.video_url);
  };

  // 🗑 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;

    const { error } = await supabase
      .from("videos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed ❌");
    } else {
      alert("Deleted ✅");
      fetchVideos();
    }
  };

  return (
    <div className="p-4 md:p-6">

      {/* 🎥 FORM */}
      <div className="bg-white p-4 rounded shadow max-w-xl mb-6">
        <h2 className="text-lg font-bold mb-3">
          {editId ? "Edit Video" : "Add Video"}
        </h2>

        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className="w-full border p-2 mb-3 rounded"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add Video"}
        </button>
      </div>

      {/* 📋 VIDEO LIST */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-4">All Videos</h2>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {videos.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-3 p-2 border rounded"
            >
              {/* Thumbnail */}
              <iframe
                src={v.video_url.replace("watch?v=", "embed/")}
                className="w-24 h-16 rounded"
                title="video"
              />

              <div className="flex-1">
                <p className="text-xs break-all">{v.video_url}</p>
              </div>

              {/* ✏️ EDIT */}
              <button
                onClick={() => handleEdit(v)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>

              {/* 🗑 DELETE */}
              <button
                onClick={() => handleDelete(v.id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};