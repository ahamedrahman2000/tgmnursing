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
      }))
    );

    setPendingStudents(pendingList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">💰 Money Dashboard</h2>

      {/* 🔷 TOP CARDS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card title="Total Fees" value={totals.total} color="blue" />
        <Card title="Paid Fees" value={totals.paid} color="green" />
        <Card title="Pending Fees" value={totals.pending} color="red" />
      </div>

      {/* 📊 CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* COURSE PENDING */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Course-wise Pending Fees</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <XAxis dataKey="course" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* YEAR PROFIT */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Year-wise Profit</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📋 COURSE TABLE */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-3">Course-wise Summary</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th>Course</th>
              <th>Students</th>
              <th>Paid</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {courseData.map((c, i) => (
              <tr key={i} className="border-t">
                <td>{c.course}</td>
                <td>{c.students}</td>
                <td className="text-green-600">₹{c.paid}</td>
                <td className="text-red-500">₹{c.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📋 YEAR TABLE */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-3">Year-wise Summary</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th>Year</th>
              <th>Collected</th>
              <th>Pending</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {yearData.map((y, i) => (
              <tr key={i} className="border-t">
                <td>{y.year}</td>
                <td className="text-green-600">₹{y.paid}</td>
                <td className="text-red-500">₹{y.pending}</td>
                <td className="text-blue-600">₹{y.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ⚠️ PENDING STUDENTS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Student-wise Pending Fees</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th>Name</th>
              <th>Course</th>
              <th>Pending Fee</th>
            </tr>
          </thead>
          <tbody>
            {pendingStudents.map((s, i) => (
              <tr key={i} className="border-t">
                <td>{s.name}</td>
                <td>{s.course}</td>
                <td className="text-red-500">₹{s.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 🔷 CARD COMPONENT
const Card = ({ title, value, color }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className={`p-4 rounded-xl shadow ${colors[color]}`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-2">₹{value}</h2>
    </div>
  );
};

export default MoneyDashboard;