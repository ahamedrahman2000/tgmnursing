import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { FaEdit, FaTrash } from "react-icons/fa";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    duration: "",
  });

  const [editId, setEditId] = useState(null);

  // 📥 FETCH COURSES
  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ➕ ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.duration) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      // ✏️ UPDATE
      await supabase
        .from("courses")
        .update(form)
        .eq("id", editId);

      setEditId(null);
    } else {
      // ➕ INSERT
      await supabase.from("courses").insert([form]);
    }

    setForm({ name: "", duration: "" });
    fetchCourses();
  };

  // 🗑 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    await supabase.from("courses").delete().eq("id", id);
    fetchCourses();
  };

  // ✏️ EDIT
  const handleEdit = (course) => {
    setForm({
      name: course.name,
      duration: course.duration,
    });
    setEditId(course.id);
  };

  return (
    <div className="  bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">📘 Manage Courses</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow mb-6 grid md:grid-cols-3 gap-4"
      >
        <input
          type="text"
          placeholder="Course Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Duration (e.g. 2 Years)"
          value={form.duration}
          onChange={(e) =>
            setForm({ ...form, duration: e.target.value })
          }
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className={`text-white rounded px-4 py-2 ${
            editId ? "bg-yellow-500" : "bg-blue-600"
          }`}
        >
          {editId ? "Update Course" : "Add Course"}
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-3">S.No</th>
              <th>Course Name</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((c, i) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{i + 1}</td>
                <td>{c.name}</td>
                <td>{c.duration}</td>

                <td>
                  <div className="flex gap-4 justify-center text-lg">
                    <FaEdit
                      className="text-yellow-500 cursor-pointer"
                      onClick={() => handleEdit(c)}
                    />

                    <FaTrash
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(c.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {courses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-400">
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursesPage;