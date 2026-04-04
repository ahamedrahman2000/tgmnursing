import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import "chart.js/auto";

const CashflowDashboard = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ FETCH STUDENTS
  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("registration_date", { ascending: false });
    if (error) console.error(error);
    else setStudents(data || []);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🔹 FILTERED STUDENTS
  const filteredStudents = students.filter((s) =>
    s.student_name?.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 TOTALS
  const totalStudents = filteredStudents.length;
  const totalFeeExpected = filteredStudents.reduce(
    (sum, s) => sum + Number(s.total_fee || 0),
    0
  );
  const totalFeePaid = filteredStudents.reduce(
    (sum, s) => sum + Number(s.paid_fee || 0),
    0
  );
  const totalFeePending = filteredStudents.reduce(
    (sum, s) => sum + Number(s.pending_fee || 0),
    0
  );

  // 🔹 COURSE SUMMARY
  const courseSummary = filteredStudents.reduce((acc, s) => {
    if (!acc[s.course])
      acc[s.course] = { count: 0, total: 0, paid: 0, pending: 0 };
    acc[s.course].count += 1;
    acc[s.course].total += Number(s.total_fee || 0);
    acc[s.course].paid += Number(s.paid_fee || 0);
    acc[s.course].pending += Number(s.pending_fee || 0);
    return acc;
  }, {});

  // 🔹 YEARLY SUMMARY
  const yearlySummary = filteredStudents.reduce((acc, s) => {
    const year = new Date(s.registration_date).getFullYear();
    if (!acc[year]) acc[year] = { total: 0, paid: 0, pending: 0, profit: 0 };
    acc[year].total += Number(s.total_fee || 0);
    acc[year].paid += Number(s.paid_fee || 0);
    acc[year].pending += Number(s.pending_fee || 0);
    acc[year].profit = acc[year].paid; // profit = collected fees
    return acc;
  }, {});

  // 🔹 CHART DATA
  const courseLabels = Object.keys(courseSummary);
  const coursePaidData = Object.values(courseSummary).map((c) => c.paid);
  const coursePendingData = Object.values(courseSummary).map((c) => c.pending);
  const yearLabels = Object.keys(yearlySummary);
  const yearProfitData = Object.values(yearlySummary).map((y) => y.profit);

  // 🔹 STUDENT-WISE PENDING
  const pendingStudents = filteredStudents.filter((s) => s.pending_fee > 0);

  // 🔹 PDF EXPORT
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("TGM Nursing Institute Cashflow Report", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    let y = 40;

    // Overall totals
    doc.setFontSize(12);
    doc.text("Overall Totals", 14, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(`Total Students: ${totalStudents}`, 14, y);
    y += 6;
    doc.text(`Total Fees Expected: ₹${totalFeeExpected}`, 14, y);
    y += 6;
    doc.text(`Total Fees Paid: ₹${totalFeePaid}`, 14, y);
    y += 6;
    doc.text(`Total Pending Fees: ₹${totalFeePending}`, 14, y);
    y += 10;

    // Course-wise summary
    doc.setFontSize(12);
    doc.text("Course-wise Summary", 14, y);
    y += 6;
    doc.setFontSize(10);
    Object.entries(courseSummary).forEach(([course, val]) => {
      doc.text(
        `${course} | Students: ${val.count} | Paid: ₹${val.paid} | Pending: ₹${val.pending}`,
        14,
        y
      );
      y += 6;
      if (y > 280) { doc.addPage(); y = 20; }
    });

    // Year-wise summary
    y += 6;
    doc.setFontSize(12);
    doc.text("Year-wise Summary", 14, y);
    y += 6;
    doc.setFontSize(10);
    Object.entries(yearlySummary).forEach(([year, val]) => {
      doc.text(
        `${year} | Collected: ₹${val.paid} | Pending: ₹${val.pending} | Profit: ₹${val.profit}`,
        14,
        y
      );
      y += 6;
      if (y > 280) { doc.addPage(); y = 20; }
    });

    // Student-wise pending
    y += 6;
    doc.setFontSize(12);
    doc.text("Student-wise Pending Fees", 14, y);
    y += 6;
    doc.setFontSize(10);
    pendingStudents.forEach((s) => {
      doc.text(`${s.student_name} | ${s.course} | Pending: ₹${s.pending_fee}`, 14, y);
      y += 6;
      if (y > 280) { doc.addPage(); y = 20; }
    });

    doc.save("Cashflow_Full_Report.pdf");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">💰 Cashflow Dashboard</h2>

      {/* SEARCH */}
      <input
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input mb-4"
      />

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-lg font-bold">{totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Total Fees</p>
          <p className="text-lg font-bold">₹{totalFeeExpected}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Paid Fees</p>
          <p className="text-lg font-bold">₹{totalFeePaid}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-sm text-gray-500">Pending Fees</p>
          <p className="text-lg font-bold text-red-500">₹{totalFeePending}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-2">Course-wise Pending Fees</h3>
          <Bar
            data={{
              labels: courseLabels,
              datasets: [
                { label: "Paid", data: coursePaidData, backgroundColor: "#22c55e" },
                { label: "Pending", data: coursePendingData, backgroundColor: "#ef4444" },
              ],
            }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-2">Year-wise Profit</h3>
          <Bar
            data={{
              labels: yearLabels,
              datasets: [{ label: "Profit", data: yearProfitData, backgroundColor: "#3b82f6" }],
            }}
          />
        </div>
      </div>

      {/* COURSE-WISE TABLE */}
      <div className="overflow-auto bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="font-bold mb-2">Course-wise Summary</h3>
        <table className="w-full text-sm border">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="p-2 border">Course</th>
              <th className="p-2 border">Students</th>
              <th className="p-2 border">Paid</th>
              <th className="p-2 border">Pending</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(courseSummary).map(([course, val]) => (
              <tr key={course} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{course}</td>
                <td className="p-2 border">{val.count}</td>
                <td className="p-2 border">₹{val.paid}</td>
                <td className="p-2 border text-red-500">₹{val.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* YEAR-WISE TABLE */}
      <div className="overflow-auto bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="font-bold mb-2">Year-wise Summary</h3>
        <table className="w-full text-sm border">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="p-2 border">Year</th>
              <th className="p-2 border">Collected Fees</th>
              <th className="p-2 border">Pending Fees</th>
              <th className="p-2 border">Profit</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(yearlySummary).map(([year, val]) => (
              <tr key={year} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{year}</td>
                <td className="p-2 border">₹{val.paid}</td>
                <td className="p-2 border text-red-500">₹{val.pending}</td>
                <td className="p-2 border">₹{val.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* STUDENT-WISE PENDING */}
      <div className="overflow-auto bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="font-bold mb-2">Student-wise Pending Fees</h3>
        <table className="w-full text-sm border">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="p-2 border">Student Name</th>
              <th className="p-2 border">Course</th>
              <th className="p-2 border">Pending Fee</th>
            </tr>
          </thead>
          <tbody>
            {pendingStudents.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{s.student_name}</td>
                <td className="p-2 border">{s.course}</td>
                <td className="p-2 border text-red-500">₹{s.pending_fee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={exportPDF}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Export Full PDF
      </button>
    </div>
  );
};

export default CashflowDashboard;