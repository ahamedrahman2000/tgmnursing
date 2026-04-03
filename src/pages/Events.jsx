import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [featured, setFeatured] = useState(0);

  useEffect(() => {
    fetch("https://tgmnursing.onrender.com/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        // ✅ SORT LATEST FIRST
        const sorted = (data || []).sort(
          (a, b) => new Date(b.event_date) - new Date(a.event_date),
        );
        setEvents(sorted);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  if (!events.length) return null;

  return (
    <div className="bg-white p-4 mb-2 md:p-6 rounded-2xl shadow-lg">
      {/* 🔥 HEADER WITH BUTTON */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-bold">
          📰 Latest News & Events
        </h2>

        <button
          onClick={() => navigate("/gallery/images")}
          className="text-blue-600 text-sm"
        >
          View All →
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ⭐ FEATURED */}
        <div className="lg:w-2/3 bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={events[featured].image_url}
            alt="event"
            className="w-full h-56 md:h-64 object-cover"
          />

          <div className="p-4">
            <p className="text-xs text-gray-500">
              📅{" "}
              {events[featured].event_date
                ? new Date(events[featured].event_date).toLocaleDateString(
                    "en-IN",
                  )
                : "Date not available"}
            </p>

            <h3 className="text-base md:text-lg font-bold">
              {events[featured].title}
            </h3>

            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {events[featured].description}
            </p>
          </div>
        </div>

        {/* 📋 RIGHT LIST (RECENT FIRST) */}
        <div className="lg:w-1/3 overflow-y-auto max-h-[26rem] space-y-3 pr-1">
          {events.slice(0, 6).map((event, index) => (
            <div
              key={event.id}
              onClick={() => setFeatured(index)}
              className="flex gap-3 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition"
            >
              <img
                src={event.image_url}
                alt="thumb"
                className="w-16 h-16 object-cover rounded"
              />

              <div>
                <p className="text-xs text-gray-500">
                  📅{" "}
                  {event.event_date
                    ? new Date(event.event_date).toLocaleDateString("en-IN")
                    : "No date"}
                </p>

                <p className="text-sm font-semibold line-clamp-1">
                  {event.title}
                </p>

                <p className="text-xs text-gray-600 line-clamp-2">
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
