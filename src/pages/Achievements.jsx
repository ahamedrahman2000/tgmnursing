import { useEffect, useState } from "react";

const achievementsData = [
  { icon: "🎯", label: "Students", value: "1000+" },
  { icon: "🏥", label: "Training", value: "100%" },
  { icon: "⭐", label: "Experience", value: "7+" }, // since 2019
];

export const Achievements = () => {
  const [counters, setCounters] = useState([0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters((prev) =>
        prev.map((val, i) => {
          const target = parseInt(achievementsData[i].value) || 100;
          return val < target ? val + Math.ceil(target / 20) : target;
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-green-50 p-3 mb-2 rounded-xl shadow-sm">
      <h2 className="font-semibold text-xl sm:text-base mb-3 text-center text-gray-800">
        🏆 Achievements
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {achievementsData.map((ach, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-2 sm:p-3 bg-white rounded-lg shadow-sm hover:shadow transition"
          >
            {/* Icon */}
            <div className="text-xl sm:text-2xl">{ach.icon}</div>

            {/* Counter */}
            <p className="text-sm sm:text-lg font-bold text-gray-800 mt-1">
              {ach.value.includes("+") ? counters[i] + "+" : ach.value}
            </p>

            {/* Label */}
            <p className="text-[10px] sm:text-xs text-gray-600 text-center">
              {ach.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};