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
    }, {})
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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>

        <button
          onClick={exportCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
        >
          📥 Export CSV
        </button>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Students" value={stats.total} />
        <Card title="Current" value={stats.active} />
        <Card title="Passed out" value={stats.passed} />
        <Card title="Pending Fees" value={pendingStudents.length} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6">
        {/* Course Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Course Wise Students</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Gender Distribution</h2>

          <div className="flex justify-center">
            <PieChart width={300} height={300}>
              <Pie
                data={genderData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {genderData.map((_, i) => (
                  <Cell key={i} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div className="flex justify-around mt-4">
            <p>Male: {male}</p>
            <p>Female: {female}</p>
          </div>
        </div>
      </div>

      {/* TABLES */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Students */}
        <Table title="Recent Students" data={recentStudents} />

        {/* Pending Fees */}
        <Table title="Students with Pending Fees" data={pendingStudents} />
      </div>
    </div>
  );
}

// 📦 CARD
const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <h3 className="text-gray-500">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// 📋 TABLE
const Table = ({ title, data }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <h2 className="font-semibold mb-4">{title}</h2>

    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b">
          <th>Name</th>
          <th>Course</th>
          <th>Mobile</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {data.map((s) => (
          <tr key={s.id} className="border-b">
            <td>{s.student_name}</td>
            <td>{s.course}</td>
            <td>{s.mobile}</td>
            <td>
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
);