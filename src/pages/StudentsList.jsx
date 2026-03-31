import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import logo from "../assets/images/logos.png";
import { FaEye, FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // ✅ FILTERS
  const [filters, setFilters] = useState({
    name: "",
    course: "",
    gender: "",
    date: "",
    age: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await fetch("http://localhost:5000/api/students");
    const data = await res.json();
    setStudents(data || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete student?")) return;

    const res = await fetch(`http://tgmnursing.onrender.com/api/students/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Deleted ✅");
      fetchStudents();
    } else {
      alert("Delete failed ❌");
    }
  };

  const handleUpdate = async () => {
    const res = await fetch(
      `http://tgmnursing.onrender.com/api/students/${selected.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      }
    );

    if (res.ok) {
      alert("Updated ✅");
      setSelected(null);
      fetchStudents();
    } else {
      alert("Update Failed ❌");
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

  // ✅ FILTER LOGIC
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

  // ✅ PDF
  const generatePDF = (s) => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      doc.setFontSize(16);
      doc.text("Student Details", 20, 20);

      let y = 40;

      const row = (label, value) => {
        doc.text(`${label}: ${value || "-"}`, 20, y);
        y += 10;
      };

      row("Admission No", s.admission_no);
      row("Name", s.student_name);
      row("Course", s.course);
      row("Mobile", s.mobile);
      row("DOB", s.dob);
      row("Gender", s.gender);
      row("Address", s.address);

      doc.save(`${s.student_name}.pdf`);
    };
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-bold mb-4">All Students</h2>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search all fields..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full rounded"
      />

      {/* 🎯 FILTERS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        <input
          placeholder="Name"
          value={filters.name}
          onChange={(e) =>
            setFilters({ ...filters, name: e.target.value })
          }
          className="border p-2 rounded text-sm"
        />

        <input
          placeholder="Course"
          value={filters.course}
          onChange={(e) =>
            setFilters({ ...filters, course: e.target.value })
          }
          className="border p-2 rounded text-sm"
        />

        <select
          value={filters.gender}
          onChange={(e) =>
            setFilters({ ...filters, gender: e.target.value })
          }
          className="border p-2 rounded text-sm"
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value })
          }
          className="border p-2 rounded text-sm"
        />

        <input
          placeholder="Age"
          value={filters.age}
          onChange={(e) =>
            setFilters({ ...filters, age: e.target.value })
          }
          className="border p-2 rounded text-sm"
        />
      </div>

      {/* 📱 RESPONSIVE TABLE */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-100 hidden md:table-header-group">
            <tr>
              <th className="p-2 text-left">Admission No</th>
              <th>Name</th>
              <th>Course</th>
              <th>Mobile</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.id}
                className="border-b block md:table-row p-3 md:p-0 mb-3 md:mb-0 bg-white md:bg-transparent rounded-lg shadow md:shadow-none"
              >
                {/* MOBILE */}
                <td className="md:hidden space-y-1">
                  <p><b>Adm:</b> {s.admission_no}</p>
                  <p><b>Name:</b> {s.student_name}</p>
                  <p><b>Course:</b> {s.course}</p>
                  <p><b>Mobile:</b> {s.mobile}</p>
                </td>

                {/* DESKTOP */}
                <td className="p-2 hidden md:table-cell">{s.admission_no}</td>
                <td className="hidden md:table-cell">{s.student_name}</td>
                <td className="hidden md:table-cell">{s.course}</td>
                <td className="hidden md:table-cell">{s.mobile}</td>

                {/* ACTIONS */}
                <td className="p-2">
                  <div className="flex gap-3 justify-start md:justify-center text-lg">
                    <button onClick={() => { setSelected(s); setEditMode(false); }} className="text-blue-600">
                      <FaEye />
                    </button>

                    <button onClick={() => generatePDF(s)} className="text-green-600">
                      <FaFilePdf />
                    </button>

                    <button onClick={() => { setSelected(s); setEditMode(true); }} className="text-yellow-600">
                      <FaEdit />
                    </button>

                    <button onClick={() => handleDelete(s.id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🪟 MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded w-full max-w-lg max-h-[80vh] overflow-auto">
            <h2 className="font-bold text-lg mb-3">
              {editMode ? "Edit Student" : "Student Details"}
            </h2>

            {Object.entries(selected).map(([key, value]) => (
              <div key={key} className="mb-2">
                <label className="text-xs text-gray-500">{key}</label>

                {editMode ? (
                  <input
                    value={value || ""}
                    onChange={(e) =>
                      setSelected({ ...selected, [key]: e.target.value })
                    }
                    className="w-full border p-1 rounded text-sm"
                  />
                ) : (
                  <p className="text-sm"><b>{String(value)}</b></p>
                )}
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              {editMode && (
                <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded">
                  Save
                </button>
              )}

              <button onClick={() => setSelected(null)} className="bg-red-500 text-white px-4 py-2 rounded">
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