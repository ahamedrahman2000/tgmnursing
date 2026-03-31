import { useEffect, useState } from "react";

const DashboardHome = ({ setActive }) => {
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
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📊 TOTAL
  const totalStudents = data.length;

  // 👨‍🎓 CURRENT / PASSED
  const currentStudents = data.filter(s => s.status !== "passed").length;
  const passedStudents = data.filter(s => s.status === "passed").length;

  // 🎓 COURSE COUNT
  const courses = {};
  data.forEach(s => {
    if (s.course) {
      courses[s.course] = (courses[s.course] || 0) + 1;
    }
  });

  // 📄 DOCUMENT STATUS
  const completeDocs = data.filter(s =>
    s.documents && Object.values(s.documents).every(v => v)
  ).length;

  const pendingDocs = totalStudents - completeDocs;

  // 🚻 GENDER
  const male = data.filter(s => s.gender === "Male").length;
  const female = data.filter(s => s.gender === "Female").length;

  // ⚠ ALERTS
  const missingAadhar = data.filter(s => !s.aadhar_no).length;
  const missingMobile = data.filter(s => !s.mobile).length;

  // 📤 EXPORT CSV (SAFE VERSION)
  const exportCSV = () => {
    if (!data.length) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(s =>
      Object.values(s)
        .map(v => `"${v ?? ""}"`) // prevent undefined/null issues
        .join(",")
    ).join("\n");

    const csv = headers + "\n" + rows;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
  };

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">

      {/* 🚀 QUICK ACTIONS */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setActive("add-student")} className="bg-blue-500 text-white px-4 py-2 rounded">
          ➕ Add Student
        </button>
        <button onClick={() => setActive("students")} className="bg-green-500 text-white px-4 py-2 rounded">
          👩‍🎓 View Students
        </button>
        <button onClick={exportCSV} className="bg-purple-500 text-white px-4 py-2 rounded">
          📥 Export CSV
        </button>
      </div>

      {/* 📊 STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Total Students" value={totalStudents} />
        <Card title="Current Students" value={currentStudents} />
        <Card title="Passed Students" value={passedStudents} />
      </div>

      {/* 🎓 COURSE */}
      <Section title="Course Wise Students">
        {Object.entries(courses).map(([course, count]) => (
          <Row key={course} label={course} value={count} />
        ))}
      </Section>

      {/* 📄 DOCS */}
      <Section title="Document Status">
        <p>✔ Complete: {completeDocs}</p>
        <p>⚠ Pending: {pendingDocs}</p>
      </Section>

      {/* 🚻 GENDER */}
      <Section title="Gender Distribution">
        <p>Male: {male}</p>
        <p>Female: {female}</p>
      </Section>

      {/* ⚠ ALERTS */}
      <Section title="Alerts" red>
        <p>Missing Aadhaar: {missingAadhar}</p>
        <p>Missing Mobile: {missingMobile}</p>
      </Section>

      {/* 👩‍🎓 RECENT */}
      <Section title="Recent Students">
        {data.slice(0, 5).map(s => (
          <Row key={s.id} label={s.student_name} value={s.course} />
        ))}
      </Section>

    </div>
  );
};

/* 🔹 SMALL REUSABLE COMPONENTS */

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3>{title}</h3>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const Section = ({ title, children, red }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className={`font-semibold mb-2 ${red ? "text-red-500" : ""}`}>
      {title}
    </h3>
    {children}
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between text-sm border-b py-1">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default DashboardHome;