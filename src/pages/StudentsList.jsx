import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient"; // make sure supabase is initialized
import jsPDF from "jspdf";
import logo from "../assets/images/logos.png";
import { FaEye, FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [bonafideData, setBonafideData] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    course: "",
    gender: "",
    date: "",
    age: "",
  });

  // ✅ FETCH STUDENTS
  // const fetchStudents = async () => {
  //   const { data, error } = await supabase
  //     .from("students")
  //     .select("*")
  //     .order("registration_date", { ascending: false });

  //   if (error) console.error("Fetch error:", error.message);
  //   else setStudents(data || []);
  // };

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setStudents(data);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ DELETE STUDENT
  const handleDelete = async (id) => {
    if (!window.confirm("Delete student?")) return;

    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) alert("Delete failed ❌ " + error.message);
    else {
      alert("Deleted ✅");
      fetchStudents();
    }
  };

  // ✅ UPDATE STUDENT
  const handleUpdate = async () => {
    const { error } = await supabase
      .from("students")
      .update(selected)
      .eq("id", selected.id);

    if (error) alert("Update failed ❌ " + error.message);
    else {
      alert("Updated ✅");
      setSelected(null);
      fetchStudents();
    }
  };

  // ✅ AGE CALCULATION
  const getAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // ✅ FILTERED STUDENTS
  const filtered = students.filter((s) => {
    return (
      Object.values(s).join(" ").toLowerCase().includes(search.toLowerCase()) &&
      (filters.name === "" ||
        s.student_name?.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.course === "" ||
        s.course?.toLowerCase().includes(filters.course.toLowerCase())) &&
      (filters.gender === "" || s.gender === filters.gender) &&
      (filters.date === "" || s.registration_date === filters.date) &&
      (filters.age === "" ||
        getAge(s.dob)?.toString() === filters.age.toString())
    );
  });

  // ✅ GENERATE PDF
  const generatePDF = (s) => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      // 🖼️ HEADER
      doc.addImage(img, "PNG", 10, 5, 25, 25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("TGM Nursing Institute of Paramedical Science", 40, 14);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Thirukovilur Road, Thiyagadurgam - 606206", 40, 19);
      doc.text("Phone: 9500655394", 40, 23);

      // Section title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("STUDENT DETAILS", 70, 38);
      doc.line(10, 40, 200, 40);

      // Two-column layout
      let leftY = 48;
      let rightY = 48;
      const leftX = 14;
      const rightX = 110;

      const rowLeft = (label, value) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(label, leftX, leftY);
        doc.setFont("helvetica", "normal");
        doc.text(`: ${value || "-"}`, leftX + 40, leftY);
        leftY += 6;
      };

      const rowRight = (label, value) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(label, rightX, rightY);
        doc.setFont("helvetica", "normal");
        doc.text(`: ${value || "-"}`, rightX + 40, rightY);
        rightY += 6;
      };

      // LEFT COLUMN
      rowLeft("Admission No", s.admission_no);
      rowLeft("Admission Date", s.admission_date);
      rowLeft("Reg Date", s.registration_date);
      rowLeft("Name", s.student_name);
      rowLeft("Father", s.father_name);
      rowLeft("Mother", s.mother_name);
      rowLeft("DOB", s.dob);
      rowLeft("Age", getAge(s.dob));
      rowLeft("Gender", s.gender);
      rowLeft("Mobile", s.mobile);

      // RIGHT COLUMN
      rowRight("Course", s.course);
      rowRight("Qualification", s.qualification);
      rowRight("School", s.school_last_attended);
      rowRight("Occupation", s.parent_occupation);
      rowRight("Religion", s.religion);
      rowRight("Aadhar", s.aadhar_no);
      rowRight("Bank", s.bank_account_no);
      rowRight("Income", s.annual_income);
      rowRight("Caste", s.caste);
      rowRight("Community", s.community);
      rowRight("Total Fee", s.total_fee);
      rowRight("Paid", s.paid_fee);
      rowRight("Pending", s.pending_fee);

      // FULL WIDTH: ADDRESS
      let y = Math.max(leftY, rightY) + 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Address", 14, y);
      doc.setFont("helvetica", "normal");
      doc.text(`: ${s.address || "-"}`, 50, y);

      y += 8;
      // DOCUMENTS
      if (s.documents && s.documents.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Documents:", 14, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        s.documents.forEach((d) => {
          doc.text(`• ${d}`, 18, y);
          y += 5;
        });
      }

      // FOOTER
      doc.line(10, 280, 200, 280);
      doc.setFontSize(7);
      doc.text("Generated by TGM Nursing System", 14, 285);

      // SAVE
      doc.save(`${s.student_name}.pdf`);
    };
  };
  const generateBonafidePDF = (student) => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      // 🔷 HEADER BOX
      doc.setDrawColor(0);
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
      doc.text("Thirukovilur Main Road, Near Police Station", 105, 29, {
        align: "center",
      });
      doc.text("(Approved under Central Govt. SR Act 21 of 1860)", 105, 34, {
        align: "center",
      });

      // 🔶 TITLE
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("BONAFIDE CERTIFICATE", 105, 55, { align: "center" });

      doc.line(60, 58, 150, 58);

      // 📄 CONTENT BOX
      doc.setFont("times", "normal");
      doc.setFontSize(12);

      let y = 70;

      const text = `
This is to certify that Mr./Ms. ${student.student_name},

Son/Daughter of Mr. ${student.father_name},

is a bonafide student of this institution and has studied in ${student.course}.

He/She bears Admission Number ${student.admission_no} and

studied during the academic year ${student.registration_date}.

Date of Birth (as per records): ${student.dob}.
`;

      const splitText = doc.splitTextToSize(text, 170);
      doc.text(splitText, 20, y);

      y += splitText.length * 7 + 20;

      // ✅ PAGE BREAK FIX
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      // 🔻 FOOTER
      doc.line(10, y, 200, y);
      y += 10;

      doc.setFontSize(10);
      doc.text("Institution Seal", 20, y);
      doc.text("Authorized Signature", 140, y);

      // 📌 DATE
      doc.setFontSize(9);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, y + 10);

      // SAVE
      doc.save(`Bonafide_${student.student_name}.pdf`);
    };
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🎓 Students</h2>

      {/* SEARCH */}
      <input
        placeholder="🔍 Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {/* FILTERS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <input
          placeholder="Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="input"
        />
        <input
          placeholder="Course"
          value={filters.course}
          onChange={(e) => setFilters({ ...filters, course: e.target.value })}
          className="input"
        />
        <select
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
          className="input"
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="input"
        />
        <input
          placeholder="Age"
          value={filters.age}
          onChange={(e) => setFilters({ ...filters, age: e.target.value })}
          className="input"
        />
      </div>

      {/* TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="p-3 text-left">Admission No</th>
              <th>Name</th>
              <th>Course</th>
              <th>Mobile</th>
              <th>Fees</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{s.admission_no}</td>
                <td>{s.student_name}</td>
                <td>{s.course}</td>
                <td>{s.mobile}</td>
                <td>
                  ₹{s.paid_fee || 0} / ₹{s.total_fee || 0}
                  <p className="text-xs text-red-500">
                    Pending: ₹{s.pending_fee || 0}
                  </p>
                </td>
                <td>
                  <div className="flex justify-center gap-4 text-lg">
                    <button
                      onClick={() => {
                        setSelected(s);
                        setEditMode(false);
                      }}
                      className="text-blue-600 hover:scale-110"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => generatePDF(s)}
                      className="text-green-600 hover:scale-110"
                    >
                      <FaFilePdf />
                    </button>
                    <button
                      onClick={() => setBonafideData(s)}
                      className="text-purple-600"
                    >
                      📄
                    </button>
                    <button
                      onClick={() => {
                        setSelected(s);
                        setEditMode(true);
                      }}
                      className="text-yellow-500 hover:scale-110"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-500 hover:scale-110"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filtered.map((s) => (
          <div key={s.id} className="bg-white p-4 rounded-xl shadow">
            <div className="space-y-1 text-sm">
              <p>
                <b>Adm No:</b> {s.admission_no}
              </p>
              <p>
                <b>Name:</b> {s.student_name}
              </p>
              <p>
                <b>Course:</b> {s.course}
              </p>
              <p>
                <b>Mobile:</b> {s.mobile}
              </p>
              <p>
                <b>Fees:</b> ₹{s.paid_fee || 0} / ₹{s.total_fee || 0}
              </p>
              <p className="text-xs text-red-500">
                Pending: ₹{s.pending_fee || 0}
              </p>
            </div>

            <div className="flex justify-between mt-3 text-lg border-t pt-2">
              <button
                onClick={() => {
                  setSelected(s);
                  setEditMode(false);
                }}
                className="text-blue-600"
              >
                <FaEye />
              </button>
              <button onClick={() => generatePDF(s)} className="text-green-600">
                <FaFilePdf />
              </button>
              <button
                onClick={() => setBonafideData(s)}
                className="text-purple-600"
              >
                📄
              </button>
              <button
                onClick={() => {
                  setSelected(s);
                  setEditMode(true);
                }}
                className="text-yellow-500"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-5 rounded-xl w-full max-w-lg max-h-[85vh] overflow-auto shadow-lg">
            <h2 className="font-bold text-lg mb-4">
              {editMode ? "✏️ Edit Student" : "📄 Student Details"}
            </h2>

            {Object.entries(selected).map(([key, value]) => (
              <div key={key} className="mb-3">
                <label className="text-xs text-gray-500">{key}</label>
                {editMode ? (
                  <input
                    value={value || ""}
                    onChange={(e) =>
                      setSelected({ ...selected, [key]: e.target.value })
                    }
                    className="w-full border p-2 rounded mt-1 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium mt-1">{String(value)}</p>
                )}
              </div>
            ))}

            <div className="flex gap-3 mt-4">
              {editMode && (
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {bonafideData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg relative">
            {/* ❌ CLOSE BUTTON */}
            <button
              onClick={() => setBonafideData(null)}
              className="absolute top-3 right-3 text-red-500 text-xl"
            >
              ✖
            </button>

            <h2 className="text-lg font-bold mb-4 text-center">
              Bonafide Preview
            </h2>

            {/* Editable Fields */}
            <input
              className="input mb-2"
              value={bonafideData.student_name}
              onChange={(e) =>
                setBonafideData({
                  ...bonafideData,
                  student_name: e.target.value,
                })
              }
              placeholder="Student Name"
            />

            <input
              className="input mb-2"
              value={bonafideData.father_name}
              onChange={(e) =>
                setBonafideData({
                  ...bonafideData,
                  father_name: e.target.value,
                })
              }
              placeholder="Father Name"
            />

            <input
              className="input mb-2"
              value={bonafideData.course}
              onChange={(e) =>
                setBonafideData({ ...bonafideData, course: e.target.value })
              }
              placeholder="Course"
            />

            <input
              className="input mb-4"
              value={bonafideData.registration_date}
              onChange={(e) =>
                setBonafideData({
                  ...bonafideData,
                  registration_date: e.target.value,
                })
              }
              placeholder="Academic Year"
            />

            {/* ✅ CONFIRM BUTTON */}
            <button
              onClick={() => {
                generateBonafidePDF(bonafideData);
                setBonafideData(null);
              }}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Confirm & Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
