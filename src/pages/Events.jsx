import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { FaCalendarAlt } from "react-icons/fa";

export const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [featured, setFeatured] = useState(0);

  // 🔄 FETCH EVENTS
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
      return;
    }

    setEvents(data || []);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (!events.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No events available
      </div>
    );
  }

  const current = events[featured];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 rounded-3xl shadow-xl mb-2 ">

  {/* 🔥 HEADER */}
  <div className="flex justify-between items-center mb-4 sm:mb-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
      📰 Latest News & Events
    </h2>

    <button
      onClick={() => navigate("/gallery/images")}
      className="text-blue-600 font-medium text-sm sm:text-base hover:underline"
    >
      View All →
    </button>
  </div>

  <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

    {/* ⭐ FEATURED (FULL IMAGE) */}
    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* IMAGE */}
      <div className="bg-black flex items-center justify-center">
        <img
          src={current?.image_url}
          alt="event"
          className="w-full max-h-60 sm:max-h-80 md:max-h-96 object-contain transition duration-500 hover:scale-105"
        />
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-5">
        <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
          <FaCalendarAlt className="text-[10px] sm:text-[12px]" />
          {current?.date
            ? new Date(current.date).toLocaleDateString("en-IN")
            : "No date"}
        </p>

        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mt-1 sm:mt-2">
          {current?.title}
        </h3>

        <p className="text-gray-600 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed line-clamp-4">
          {current?.description}
        </p>
      </div>
    </div>

    {/* 📋 SIDE LIST */}
    <div className="space-y-3 max-h-60 sm:max-h-80 md:max-h-96 overflow-y-auto pr-1">
      {events.slice(0, 8).map((event, index) => (
        <div
          key={event.id}
          onClick={() => setFeatured(index)}
          className={`flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl cursor-pointer transition shadow-sm text-xs sm:text-sm ${
            featured === index
              ? "bg-blue-100 border-l-4 border-blue-600"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          {/* THUMBNAIL */}
          <img
            src={event.image_url}
            alt="thumb"
            className="w-16 h-12 sm:w-20 sm:h-16 object-cover rounded-lg"
          />

          {/* TEXT */}
          <div className="flex-1">
            <p className="text-[8px] sm:text-xs text-gray-500 flex items-center gap-1">
              <FaCalendarAlt className="text-[8px] sm:text-[10px]" />
              {event.date
                ? new Date(event.date).toLocaleDateString("en-IN")
                : "No date"}
            </p>

            <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1">
              {event.title}
            </p>

            <p className="text-[9px] sm:text-xs text-gray-600 line-clamp-2">
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>

  </div>
</div>
  );
};