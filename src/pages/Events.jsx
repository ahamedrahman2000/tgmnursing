import   { useEffect, useState } from "react";

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [featured, setFeatured] = useState(0);

  useEffect(() => {
    fetch("http://tgmnursing.onrender.com/api/gallery")
      .then((res) => res.json())
      .then((data) => setEvents(data || []));
  }, []);

  if (!events.length) return null;

  return (
    <div className="bg-white p-4 mb-2 md:p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl text-center font-bold mb-6">📰 Latest News & Events</h2>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT FEATURED */}
        <div className="lg:w-2/3 bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={events[featured].image_url} alt="event image"
            className="w-full h-64 object-cover"
          />

          <div className="p-4">
            <p className="text-xs text-gray-500">
              📅 {events[featured].event_date
                ? new Date(events[featured].event_date).toLocaleDateString("en-IN")
                : "Date not available"}
            </p>

            <h3 className="text-lg font-bold">
              {events[featured].title}
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              {events[featured].description}
            </p>
          </div>
        </div>

        {/* RIGHT LIST */}
        <div className="lg:w-1/3 overflow-y-auto max-h-[28rem] space-y-3">
          {events.map((event, index) => (
            <div
              key={event.id}
              onClick={() => setFeatured(index)}
              className="flex gap-3 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
            >
              <img
                src={event.image_url}
                className="w-16 h-16 object-cover rounded"
              />

              <div>
                <p className="text-xs text-gray-500">
                  📅 {event.event_date
                    ? new Date(event.event_date).toLocaleDateString("en-IN")
                    : "No date"}
                </p>

                <p className="text-sm font-semibold">
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