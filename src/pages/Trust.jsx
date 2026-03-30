 
const testimonials = [
  {
    name: "Anandhi S.",
    role: "Student",
    feedback:
      "TGM Nursing Institute helped me gain practical skills and secure a job in a reputed hospital. Highly recommended!",
  },
  {
    name: "Sundharamoor T.",
    role: "Parent",
    feedback:
      "The institute is very professional, with excellent faculty and hands-on training. I trust them completely for my child's career.",
  },
  {
    name: "Priya K.",
    role: "Student",
    feedback:
      "I loved the supportive environment and the placement assistance. The 100% job guarantee is real!",
  },
];

export const Trust = () => (
  <div className="bg-blue-50 py-4 px-3 sm:px-5 rounded-xl shadow-sm max-w-4xl mx-auto">
    
    {/* Title */}
    <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 text-center">
      💬 Testimonials
    </h2>

    {/* Testimonials */}
    <div className="space-y-3">
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="bg-white p-3 sm:p-4 rounded-lg shadow hover:shadow-md transition"
        >
          {/* ⭐ Stars */}
          <div className="text-yellow-400 text-sm mb-1">
            ⭐⭐⭐⭐⭐
          </div>

          {/* Feedback */}
          <p className="text-gray-700 text-xs sm:text-sm italic leading-relaxed">
            "{t.feedback}"
          </p>

          {/* Name */}
          <p className="mt-2 text-sm font-semibold text-gray-800">
            {t.name}
            <span className="text-gray-500 text-xs ml-1">
              - {t.role}
            </span>
          </p>
        </div>
      ))}
    </div>
  </div>
);