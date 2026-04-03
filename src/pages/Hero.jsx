import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Admission", path: "/admission" },
    { name: "Courses", path: "/courses" },
  ];
  return (
    <div
      className="relative text-white overflow-hidden"
      style={{
        backgroundImage: "url('/images/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-10 md:py-16">
        <div className="max-w-xl">
          {/* Small Tag */}
          <p className="text-xs sm:text-sm text-blue-300 font-medium tracking-wide mb-2">
            Institute of Paramedical Science
          </p>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            TGM Nursing Institute
          </h1>

          {/* Tamil */}
          <p className="text-sm sm:text-base mt-2 opacity-80">
            செவிலியர் பயிற்சி நிறுவனம்
          </p>

          {/* Badge */}
          <div className="mt-3">
            <span className="bg-green-600/90 text-white text-xs px-3 py-1 rounded-full">
              ✔ Central Government Approved
            </span>
          </div>

          {/* Highlight */}
          <p className="mt-4 text-base sm:text-lg md:text-xl font-semibold">
            🎯 100% Job Guarantee
          </p>

          {/* Description (NEW - premium touch) */}
          <p className="mt-2 text-sm text-gray-200 leading-relaxed">
            Build your career in healthcare with expert training, real hospital
            exposure, and strong placement support.
          </p>

          {/* CTA Buttons */}
          {/* Admission Form Button */}
          <div className="flex justify-center mt-5 gap-3 flex-wrap">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`${
                  item.name === "Admission" ? "bg-blue-700" : "bg-green-600"
                } text-white px-6 py-2 rounded-lg text-sm font-semibold shadow hover:scale-105 transition`}
              >
                {item.name === "Admission" ? "📝" : "📚"} {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
