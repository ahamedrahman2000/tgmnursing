import { useEffect, useState } from "react";

const DashboardHome = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("https://tgmnursing.onrender.com/api/students");
      if (!res.ok) throw new Error("Failed to fetch");

      const result = await res.json();
      setData(result || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 📊 STATS
  const totalStudents = data.length;
  const currentStudents = data.filter((s) => s.status !== "passed").length;
  const passedStudents = data.filter((s) => s.status === "passed").length;

  // 🎓 COURSE COUNT
  const courses = {};
  data.forEach((s) => {
    if (s.course) {
      courses[s.course] = (courses[s.course] || 0) + 1;
    }
  });

  // 🚻 GENDER
  const male = data.filter((s) => s.gender === "Male").length;
  const female = data.filter((s) => s.gender === "Female").length;

  // 📤 EXPORT CSV
  const exportCSV = () => {
    if (!data.length) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data
      .map((s) =>
        Object.values(s)
          .map((v) => `"${v ?? ""}"`)
          .join(","),
      )
      .join("\n");

    const csv = headers + "\n" + rows;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg md:text-2xl font-bold">Dashboard Overview</h2>

        <button
          onClick={exportCSV}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm shadow"
        >
          📥 Export CSV
        </button>
      </div>

      {/* 📊 STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card title="Total Students" value={totalStudents} />
        <Card title="Current" value={currentStudents} />
        <Card title="Passed" value={passedStudents} />
      </div>

      {/* 🎓 COURSE SECTION */}
      <Section title="Course Wise Students">
        {Object.entries(courses).map(([course, count]) => (
          <Row key={course} label={course} value={count} />
        ))}
      </Section>

      {/* 🚻 GENDER */}
      <Section title="Gender Distribution">
        <Row label="Male" value={male} />
        <Row label="Female" value={female} />
      </Section>

      {/* 👩‍🎓 RECENT */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <h3 className="font-semibold mb-3 text-sm md:text-base">
          Recent Students
        </h3>

        <table className="min-w-full text-xs md:text-sm">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Course</th>
              <th className="text-left py-2">Mobile</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.slice(0, 5).map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{s.student_name}</td>
                <td>{s.course}</td>
                <td>{s.mobile}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-white text-[10px] md:text-xs ${
                      s.status === "passed" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {s.status || "active"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 🔹 MODERN CARD */
const Card = ({ title, value }) => (
  <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center">
    <p className="text-gray-500 text-xs md:text-sm">{title}</p>
    <p className="text-lg md:text-2xl font-bold mt-1">{value}</p>
  </div>
);

/* 🔹 SECTION */
const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow p-4">
    <h3 className="font-semibold mb-3 text-sm md:text-base">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

/* 🔹 ROW */
const Row = ({ label, value }) => (
  <div className="flex justify-between text-xs md:text-sm border-b pb-1">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default DashboardHome;
