import   { useEffect, useState } from "react";

export const Stats = () => {
  const statsData = [
    { label: "Courses", value: 10, gradient: "from-purple-500 to-purple-300" },
    { label: "Completed Students", value: 890, gradient: "from-blue-500 to-blue-300" },
    { label: "Placements", value: 95, suffix: "%", gradient: "from-green-500 to-green-300" },
    { label: "Years", value: new Date().getFullYear() - 2019, gradient: "from-orange-500 to-orange-300" },
  ];

  const [counters, setCounters] = useState(statsData.map(() => 0));

  useEffect(() => {
    let start = null;
    const duration = 1500; // 1.5 seconds animation

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      setCounters(
        statsData.map((stat) =>
          Math.floor(stat.value * easeOutCubic(progress))
        )
      );

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 text-center px-2 py-2 max-w-4xl mx-auto">
      {statsData.map((stat, i) => (
        <div
          key={i}
          className={`p-4 sm:p-5 rounded-xl shadow-lg flex flex-col items-center justify-center bg-gradient-to-r ${stat.gradient} hover:scale-105 transition-transform duration-300`}
        >
          <p className="font-bold text-xl sm:text-3xl text-white">
            {counters[i]}
            {stat.suffix || ""}
          </p>
          <p className="text-xs sm:text-sm text-white font-extrabold mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};