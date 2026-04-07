import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import jsPDF from "jspdf";
import logo from "../assets/images/logos.png";

import { FaEye, FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";

// 👉 helper
const getAge = (dob) => {
  if (!dob) return "-";
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
};

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("");
  const [feeFilter, setFeeFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const limit = 10;

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*");
    setCourses(data || []);
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  // 📥 FETCH
  const fetchStudents = async () => {
    let query = supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    // SEARCH
    if (search) {
      query = query.or(
        `student_name.ilike.%${search}%,mobile.ilike.%${search}%,admission_no.ilike.%${search}%`,
      );
    }

    // COURSE
    if (course) query = query.eq("course", course);

    // YEAR
    if (year) query = query.eq("academic_year", year);

    // STATUS
    if (status) query = query.eq("status", status);

    // FEE FILTER
    if (feeFilter === "paid") query = query.eq("pending_fee", 0);
    if (feeFilter === "pending") query = query.gt("pending_fee", 0);

    // DATE RANGE
    if (fromDate) query = query.gte("admission_date", fromDate);
    if (toDate) query = query.lte("admission_date", toDate);

    const { data } = await query;
    setStudents(data || []);
  };

  useEffect(() => {
    fetchStudents();
  }, [page, year, search, course, status, feeFilter, fromDate, toDate]);

  // ❌ DELETE
  const handleDelete = async (id) => {
    await supabase.from("students").delete().eq("id", id);
    fetchStudents();
  };

  // 🔄 STATUS
  // const toggleStatus = async (student) => {
  //   const newStatus = student.status === "active" ? "inactive" : "active";

  //   await supabase
  //     .from("students")
  //     .update({ status: newStatus })
  //     .eq("id", student.id);

  //   fetchStudents();
  // };

  const toggleStatus = async (student) => {
    const newStatus = student.status === "active" ? "completed" : "active";

    await supabase
      .from("students")
      .update({ status: newStatus })
      .eq("id", student.id);

    fetchStudents();
  };

  // 💾 UPDATE
  const handleUpdate = async () => {
    const pending_fee = selected.total_fee - selected.paid_fee;

    await supabase
      .from("students")
      .update({ ...selected, pending_fee })
      .eq("id", selected.id);

    setSelected(null);
    setEditMode(false);
    fetchStudents();
  };

  // 📄 PDF
  const generatePDF = (s) => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      // 🔷 HEADER BOX
      doc.setDrawColor(0);
      doc.rect(10, 10, 190, 30);

      doc.addImage(img, "PNG", 15, 12, 22, 22);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("TGM NURSING INSTITUTE OF PARAMEDICAL SCIENCE", 105, 18, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Thiyagadurgam - 606206", 105, 24, { align: "center" });
      doc.text("Phone: 9500655394", 105, 29, { align: "center" });

      // 🔶 TITLE
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("STUDENT DETAILS", 105, 48, { align: "center" });
      doc.line(70, 50, 140, 50);

      // 📊 GRID
      let leftY = 60;
      let rightY = 60;

      const leftX = 14;
      const rightX = 110;

      const row = (label, value, x, y) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(label, x, y);

        doc.setFont("helvetica", "normal");
        doc.text(`: ${value || "-"}`, x + 38, y);
      };

      const addLeft = (label, value) => {
        row(label, value, leftX, leftY);
        leftY += 7;
      };

      const addRight = (label, value) => {
        row(label, value, rightX, rightY);
        rightY += 7;
      };

      // LEFT
      addLeft("Admission No", s.admission_no);
      addLeft("Admission Date", s.admission_date);
      addLeft("Name", s.student_name);
      addLeft("Father", s.father_name);
      addLeft("Mother", s.mother_name);
      addLeft("DOB", s.dob);
      addLeft("Age", getAge(s.dob));
      addLeft("Gender", s.gender);
      addLeft("Mobile", s.mobile);

      // RIGHT
      addRight("Course", s.course);
      addRight("Qualification", s.qualification);
      addRight("School", s.school_last_attended);
      addRight("Occupation", s.parent_occupation);
      addRight("Religion", s.religion);
      addRight("Aadhar", s.aadhar_no);
      addRight("Bank", s.bank_account_no);
      addRight("Income", s.annual_income);
      addRight("Caste", s.caste);
      addRight("Community", s.community);

      // 💰 FEES BOX
      let y = Math.max(leftY, rightY) + 10;

      doc.setDrawColor(150);
      doc.rect(10, y, 190, 20);

      doc.setFont("helvetica", "bold");
      doc.text("FEE DETAILS", 14, y + 6);

      doc.setFont("helvetica", "normal");

      doc.text(`Total: ${s.total_fee || 0}`, 14, y + 14);
      doc.text(`Paid: ${s.paid_fee || 0}`, 80, y + 14);
      doc.text(`Pending: ${s.pending_fee || 0}`, 140, y + 14);

      // 📍 ADDRESS
      y += 30;
      doc.setFont("helvetica", "bold");
      doc.text("Address", 14, y);

      doc.setFont("helvetica", "normal");
      doc.text(`: ${s.address || "-"}`, 50, y);

      // 📄 DOCUMENTS
      y += 10;
      if (s.documents?.length) {
        doc.setFont("helvetica", "bold");
        doc.text("Documents", 14, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        s.documents.forEach((d) => {
          doc.text(`• ${d}`, 18, y);
          y += 5;
        });
      }

      // 🔻 FOOTER
      doc.line(10, 280, 200, 280);
      doc.setFontSize(8);
      doc.text("Generated by TGM Nursing System", 14, 285);

      doc.save(`${s.student_name}.pdf`);
    };
  };

  // 📜 BONAFIDE
  const generateBonafidePDF = (student) => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      // 🔷 HEADER
      doc.rect(10, 10, 190, 35);

      doc.addImage(img, "PNG", 15, 13, 25, 25);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("TGM NURSING INSTITUTE OF PARAMEDICAL SCIENCE", 105, 18, {
        align: "center",
      });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Thiyagadurgam - 606206", 105, 24, { align: "center" });
      doc.text("(Approved under SR Act 1860)", 105, 29, {
        align: "center",
      });

      // 🔶 TITLE
      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.text("BONAFIDE CERTIFICATE", 105, 60, { align: "center" });
      doc.line(65, 63, 145, 63);

      // 📄 CONTENT
      doc.setFont("times", "normal");
      doc.setFontSize(12);

      const text = `
This is to certify that Mr./Ms. ${student.student_name},

Son/Daughter of Mr. ${student.father_name},

is a bonafide student of this institution.

He/She is studying ${student.course} during the academic year ${student.academic_year}.

His/Her Admission Number is ${student.admission_no}.

Date of Birth (as per record): ${student.dob}.
`;

      const splitText = doc.splitTextToSize(text, 170);
      doc.text(splitText, 20, 80);

      let y = 80 + splitText.length * 7 + 20;

      // 🔻 SIGNATURE
      doc.line(10, y, 200, y);
      y += 12;

      doc.setFontSize(10);
      doc.text("Institution Seal", 20, y);
      doc.text("Authorized Signature", 140, y);

      // 📅 DATE
      doc.setFontSize(9);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, y + 10);

      doc.save(`Bonafide_${student.student_name}.pdf`);
    };
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🎓 Students</h2>

      <div className="bg-white   sm:p-4 rounded-xl shadow mb-4 space-y-3">
        {/* ROW 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="🔍 Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input text-sm p-2"
          />

          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="input text-sm p-2"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="input text-sm p-2"
          >
            <option value="">All Years</option>
            {[2023, 2024, 2025, 2026].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input text-sm p-2"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={feeFilter}
            onChange={(e) => setFeeFilter(e.target.value)}
            className="input text-sm p-2"
          >
            <option value="">All Fees</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="input text-sm p-2"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="input text-sm p-2"
          />

          <button
            onClick={() => {
              setSearch("");
              setCourse("");
              setYear("");
              setStatus("");
              setFeeFilter("");
              setFromDate("");
              setToDate("");
            }}
            className="bg-red-500 text-white rounded px-3 py-2 text-sm"
          >
            ❌ Reset
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[800px]">
            <thead className="bg-blue-50 text-xs sm:text-sm">
              <tr>
                <th className="p-2">S.No</th>
                <th>Adm</th>
                <th>Name</th>
                <th>Course</th>
                <th>Mobile</th>
                <th>Fees</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, index) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{(page - 1) * limit + index + 1}</td>
                  <td>{s.admission_no}</td>
                  <td>{s.student_name}</td>
                  <td>{s.course}</td>
                  <td>{s.mobile}</td>

                  {/* FEES */}
                  <td className="text-xs">
                    ₹{s.paid_fee || 0} / ₹{s.total_fee || 0}
                    {Number(s.pending_fee) > 0 ? (
                      <p className="text-red-500">₹{s.pending_fee}</p>
                    ) : (
                      <p className="text-green-600">✓</p>
                    )}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span onClick={() => toggleStatus(s)}
                      className={`px-2 py-1 rounded text-white text-xs ${
                        s.status === "active"
                          ? "bg-green-500"
                          : s.status === "completed"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                      }`}
                    >
                      {s.status === "completed" ? "Passed Out" : s.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="flex gap-2 justify-center text-sm sm:text-lg">
                      <FaEye
                        className="text-blue-600 cursor-pointer"
                        onClick={() => {
                          setSelected(s);
                          setEditMode(false);
                        }}
                      />

                      <FaFilePdf
                        className="text-green-600 cursor-pointer"
                        onClick={() => generatePDF(s)}
                      />

                      <span onClick={() => generateBonafidePDF(s)}>📄</span>

                      <FaEdit
                        className="text-yellow-500 cursor-pointer"
                        onClick={() => {
                          setSelected(s);
                          setEditMode(true);
                        }}
                      />

                      <FaTrash
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(s.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* 🔷 HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 sticky top-0">
              <h2 className="text-xl font-semibold">
                {editMode ? "✏️ Edit Student" : "👁️ Student Details"}
              </h2>

              <button
                onClick={() => setSelected(null)}
                className="text-red-500 text-xl"
              >
                ✖
              </button>
            </div>

            {/* 🔶 BODY */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* 🧑 PERSONAL INFO */}
              <h3 className="font-semibold mb-3 text-gray-700">
                Personal Details
              </h3>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  ["Admission No", "admission_no"],
                  ["Admission Date", "admission_date"],
                  ["Student Name", "student_name"],
                  ["Father Name", "father_name"],
                  ["Mother Name", "mother_name"],
                  ["DOB", "dob"],
                  ["Gender", "gender"],
                  ["Mobile", "mobile"],
                  ["Aadhar", "aadhar_no"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500">{label}</label>

                    {editMode ? (
                      <input
                        value={selected[key] || ""}
                        onChange={(e) =>
                          setSelected({
                            ...selected,
                            [key]: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded mt-1"
                      />
                    ) : (
                      <p className="font-medium mt-1">{selected[key] || "-"}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* 🎓 ACADEMIC */}
              <h3 className="font-semibold mb-3 text-gray-700">
                Academic Details
              </h3>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  ["Course", "course"],
                  ["Qualification", "qualification"],
                  ["School Last", "school_last_attended"],
                  ["Academic Year", "academic_year"],
                  ["Religion", "religion"],
                  ["Caste", "caste"],
                  ["Community", "community"],
                  ["Parent Occupation", "parent_occupation"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500">{label}</label>

                    {editMode ? (
                      <input
                        value={selected[key] || ""}
                        onChange={(e) =>
                          setSelected({
                            ...selected,
                            [key]: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded mt-1"
                      />
                    ) : (
                      <p className="font-medium mt-1">{selected[key] || "-"}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* 💰 FINANCIAL */}
              <h3 className="font-semibold mb-3 text-gray-700">
                Financial Details
              </h3>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  ["Total Fee", "total_fee"],
                  ["Paid Fee", "paid_fee"],
                  ["Pending Fee", "pending_fee"],
                  ["Bank Account", "bank_account_no"],
                  ["Annual Income", "annual_income"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs text-gray-500">{label}</label>

                    {editMode ? (
                      <input
                        value={selected[key] || ""}
                        onChange={(e) =>
                          setSelected({
                            ...selected,
                            [key]: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded mt-1"
                      />
                    ) : (
                      <p className="font-medium mt-1">{selected[key] || "-"}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* 🏠 ADDRESS */}
              <h3 className="font-semibold mb-2 text-gray-700">Address</h3>

              {editMode ? (
                <textarea
                  value={selected.address || ""}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      address: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
              ) : (
                <p className="font-medium">{selected.address || "-"}</p>
              )}
            </div>

            {/* 🔻 FOOTER */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 sticky bottom-0">
              {editMode && (
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              )}

              <button
                onClick={() => setSelected(null)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
