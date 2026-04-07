import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    passed: 0,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase.from("students").select("*");

    setStudents(data || []);

    const total = data.length;
    const active = data.filter((s) => s.status === "active").length;
    const passed = data.filter((s) => s.status === "completed").length;

    setStats({ total, active, passed });
  };

  // 📊 Course Wise Data
  const courseData = Object.values(
    students.reduce((acc, s) => {
      acc[s.course] = acc[s.course] || { name: s.course, value: 0 };
      acc[s.course].value += 1;
      return acc;
    }, {}),
  );

  // 👨‍🎓 Gender Data
  const male = students.filter((s) => s.gender === "Male").length;
  const female = students.filter((s) => s.gender === "Female").length;

  const genderData = [
    { name: "Male", value: male },
    { name: "Female", value: female },
  ];

  // ⏳ Pending Fees
  const pendingStudents = students.filter((s) => s.pending_fee > 0);

  // 🕒 Recent Students
  const recentStudents = [...students]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // 📥 Export CSV
  const exportCSV = () => {
    const headers = ["Name", "Course", "Mobile", "Status"];
    const rows = students.map((s) => [
      s.student_name,
      s.course,
      s.mobile,
      s.status,
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
  };

  const isMobile = window.innerWidth < 640;

  return (
  <div className="sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
        Dashboard Overview
      </h1>

      <button
        onClick={exportCSV}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition w-full sm:w-auto"
      >
        📥 Export CSV
      </button>
    </div>

    {/* TOP CARDS */}
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Total Students" value={stats.total} color="from-blue-500 to-blue-700" />
      <Card title="Current" value={stats.active} color="from-green-500 to-green-700" />
      <Card title="Passed out" value={stats.passed} color="from-purple-500 to-purple-700" />
      <Card title="Pending Fees" value={pendingStudents.length} color="from-red-500 to-red-600" />
    </div>

    {/* TABLES */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Table title="Recent Students" data={recentStudents} />
      <Table title="Students with Pending Fees" data={pendingStudents} />
    </div>

    {/* CHARTS */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Course Chart */}
      <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-blue-500">
        <h2 className="font-semibold mb-4 text-blue-700">
          Course Wise Students
        </h2>

        <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
          <BarChart data={courseData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gender Chart */}
      <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-pink-500">
        <h2 className="font-semibold mb-4 text-pink-600">
          Gender Distribution
        </h2>

        <div className="flex justify-center">
          <PieChart width={isMobile ? 250 : 300} height={isMobile ? 250 : 300}>
            <Pie
              data={genderData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 80 : 100}
              label
            >
              <Cell fill="#3B82F6" />
              <Cell fill="#EC4899" />
            </Pie>
          </PieChart>
        </div>

        <div className="flex justify-around mt-4 text-sm sm:text-base font-medium">
          <p className="text-blue-600">Male: {male}</p>
          <p className="text-pink-600">Female: {female}</p>
        </div>
      </div>
    </div>
  </div>
);
}

// 📦 CARD
const Card = ({ title, value, color }) => (
  <div className={`bg-gradient-to-r ${color} text-white p-4 rounded-xl shadow-lg text-center hover:scale-105 transition`}>
    <h3 className="text-sm opacity-90">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// 📋 TABLE
const Table = ({ title, data }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-indigo-500">
    <h2 className="font-semibold mb-4 text-indigo-700">{title}</h2>

    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[500px]">
        <thead>
          <tr className="text-left bg-indigo-50">
            <th className="p-2">Name</th>
            <th className="p-2">Course</th>
            <th className="p-2">Mobile</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((s, i) => (
            <tr
              key={s.id}
              className={`border-b hover:bg-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
            >
              <td className="p-2">{s.student_name}</td>
              <td className="p-2">{s.course}</td>
              <td className="p-2">{s.mobile}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    s.status === "active"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                >
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);