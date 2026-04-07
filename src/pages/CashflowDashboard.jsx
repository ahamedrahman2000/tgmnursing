import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const MoneyDashboard = () => {
  const [students, setStudents] = useState([]);

  const [totals, setTotals] = useState({
    total: 0,
    paid: 0,
    pending: 0,
  });

  const [courseData, setCourseData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);

  // 📥 FETCH DATA
  const fetchData = async () => {
    const { data } = await supabase.from("students").select("*");

    if (!data) return;

    setStudents(data);

    let total = 0,
      paid = 0,
      pending = 0;

    const courseMap = {};
    const yearMap = {};
    const pendingList = [];

    data.forEach((s) => {
      const t = Number(s.total_fee || 0);
      const p = Number(s.paid_fee || 0);
      const pend = Number(s.pending_fee || 0);

      total += t;
      paid += p;
      pending += pend;

      // 📊 COURSE
      if (!courseMap[s.course]) {
        courseMap[s.course] = {
          course: s.course,
          students: 0,
          paid: 0,
          pending: 0,
        };
      }

      courseMap[s.course].students += 1;
      courseMap[s.course].paid += p;
      courseMap[s.course].pending += pend;

      // 📈 YEAR
      if (!yearMap[s.academic_year]) {
        yearMap[s.academic_year] = {
          year: s.academic_year,
          paid: 0,
          pending: 0,
        };
      }

      yearMap[s.academic_year].paid += p;
      yearMap[s.academic_year].pending += pend;

      // ⚠️ PENDING LIST
      if (pend > 0) {
        pendingList.push({
          name: s.student_name,
          course: s.course,
          pending: pend,
        });
      }
    });

    setTotals({ total, paid, pending });

    setCourseData(Object.values(courseMap));

    setYearData(
      Object.values(yearMap).map((y) => ({
        ...y,
        profit: y.paid, // you can adjust later
      })),
    );

    setPendingStudents(pendingList);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="p-2 sm:p-6 space-y-3 sm:space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          💰 Money Dashboard
        </h1>
      </div>

      {/* 🔷 TOP CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          title="Total Fees"
          value={totals.total}
          color="from-blue-500 to-blue-700"
        />
        <Card
          title="Paid Fees"
          value={totals.paid}
          color="from-green-500 to-green-700"
        />
        <Card
          title="Pending Fees"
          value={totals.pending}
          color="from-red-500 to-red-600"
        />
      </div>

      {/* 📋 COURSE TABLE */}
      <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-indigo-500">
        <h3 className="font-semibold mb-4 text-indigo-700">
          Course-wise Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-indigo-50 text-left">
                <th className="p-2">Course</th>
                <th className="p-2">Students</th>
                <th className="p-2">Paid</th>
                <th className="p-2">Pending</th>
              </tr>
            </thead>

            <tbody>
              {courseData.map((c, i) => (
                <tr
                  key={i}
                  className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-2">{c.course}</td>
                  <td className="p-2">{c.students}</td>
                  <td className="p-2 text-green-600 font-medium">₹{c.paid}</td>
                  <td className="p-2 text-red-500 font-medium">₹{c.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📋 YEAR TABLE */}
      <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-purple-500">
        <h3 className="font-semibold mb-4 text-purple-700">
          Year-wise Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-purple-50 text-left">
                <th className="p-2">Year</th>
                <th className="p-2">Collected</th>
                <th className="p-2">Pending</th>
                <th className="p-2">Profit</th>
              </tr>
            </thead>

            <tbody>
              {yearData.map((y, i) => (
                <tr
                  key={i}
                  className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-2">{y.year}</td>
                  <td className="p-2 text-green-600">₹{y.paid}</td>
                  <td className="p-2 text-red-500">₹{y.pending}</td>
                  <td className="p-2 text-blue-600 font-semibold">
                    ₹{y.profit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ⚠️ PENDING STUDENTS */}
      <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-red-500">
        <h3 className="font-semibold mb-4 text-red-600">
          Student-wise Pending Fees
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="bg-red-50 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Course</th>
                <th className="p-2">Pending Fee</th>
              </tr>
            </thead>

            <tbody>
              {pendingStudents.map((s, i) => (
                <tr
                  key={i}
                  className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.course}</td>
                  <td className="p-2 text-red-500 font-semibold">
                    ₹{s.pending}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* 📊 CHARTS */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
        {/* COURSE PENDING */}
        <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-blue-500">
          <h3 className="font-semibold mb-4 text-blue-700">
            Course-wise Pending Fees
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courseData}>
              <XAxis dataKey="course" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pending" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* YEAR PROFIT */}
        <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-green-500">
          <h3 className="font-semibold mb-4 text-green-700">
            Year-wise Profit
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="profit" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// 🔷 CARD COMPONENT
const Card = ({ title, value, color }) => (
  <div
    className={`bg-gradient-to-r ${color} text-white p-2 sm:p-4 rounded-lg sm:rounded-xl shadow text-center`}
  >
    <h3 className="text-[10px] sm:text-sm">{title}</h3>
    <p className="text-sm sm:text-2xl font-bold">₹{value}</p>
  </div>
);
export default MoneyDashboard;
