import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

const StudentForm = () => {
  const [form, setForm] = useState({
    admission_no: "",
    admission_date: "",
    student_name: "",
    father_name: "",
    mother_name: "",
    dob: "",
    gender: "",
    mobile: "",
    address: "",
    course: "",
    qualification: "",
    school_last_attended: "",
    parent_occupation: "",
    religion: "",
    aadhar_no: "",
    bank_account_no: "",
    annual_income: "",
    caste: "",
    community: "",
    form_no: "",
    total_fee: "",
    paid_fee: "",
    academic_year: new Date().getFullYear().toString(),
  });
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*");
    setCourses(data || []);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const pending_fee =
      Number(form.total_fee || 0) - Number(form.paid_fee || 0);

    const { error } = await supabase.from("students").insert([
      {
        ...form,
        pending_fee,
        status: "active",
      },
    ]);

    if (!error) {
      alert("Student Registered ✅");

      // reset form
      setForm({
        admission_no: "",
        admission_date: "",
        student_name: "",
        father_name: "",
        mother_name: "",
        dob: "",
        gender: "",
        mobile: "",
        address: "",
        course: "",
        qualification: "",
        school_last_attended: "",
        parent_occupation: "",
        religion: "",
        aadhar_no: "",
        bank_account_no: "",
        annual_income: "",
        caste: "",
        community: "",
        form_no: "",
        total_fee: "",
        paid_fee: "",
        academic_year: new Date().getFullYear().toString(),
      });
    } else {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">
      <h2 className="font-bold mb-4 text-lg">➕ Register Student</h2>

      {/* GRID FORM */}
      <div className="grid md:grid-cols-3 gap-3">
        <input
          className="input"
          placeholder="Admission No"
          value={form.admission_no}
          onChange={(e) => handleChange("admission_no", e.target.value)}
        />

        <input
          type="date"
          className="input"
          value={form.admission_date}
          onChange={(e) => handleChange("admission_date", e.target.value)}
        />

        <input
          className="input"
          placeholder="Form No"
          value={form.form_no}
          onChange={(e) => handleChange("form_no", e.target.value)}
        />

        <input
          className="input"
          placeholder="Student Name"
          value={form.student_name}
          onChange={(e) => handleChange("student_name", e.target.value)}
        />

        <input
          className="input"
          placeholder="Father Name"
          value={form.father_name}
          onChange={(e) => handleChange("father_name", e.target.value)}
        />

        <input
          className="input"
          placeholder="Mother Name"
          value={form.mother_name}
          onChange={(e) => handleChange("mother_name", e.target.value)}
        />

        <input
          type="date"
          className="input"
          value={form.dob}
          onChange={(e) => handleChange("dob", e.target.value)}
        />

        <select
          className="input"
          value={form.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input
          className="input"
          placeholder="Mobile"
          value={form.mobile}
          onChange={(e) => handleChange("mobile", e.target.value)}
        />

        <input
          className="input"
          placeholder="Address"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />

        <select
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          className="input"
        >
          <option value="">Select Course</option>
          {courses?.length > 0 ? (
            courses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} ({c.duration})
              </option>
            ))
          ) : (
            <option disabled>No courses available</option>
          )}
        </select>

        <input
          className="input"
          placeholder="Qualification"
          value={form.qualification}
          onChange={(e) => handleChange("qualification", e.target.value)}
        />

        <input
          className="input"
          placeholder="Last School"
          value={form.school_last_attended}
          onChange={(e) => handleChange("school_last_attended", e.target.value)}
        />

        <input
          className="input"
          placeholder="Parent Occupation"
          value={form.parent_occupation}
          onChange={(e) => handleChange("parent_occupation", e.target.value)}
        />

        <input
          className="input"
          placeholder="Religion"
          value={form.religion}
          onChange={(e) => handleChange("religion", e.target.value)}
        />

        <input
          className="input"
          placeholder="Aadhar No"
          value={form.aadhar_no}
          onChange={(e) => handleChange("aadhar_no", e.target.value)}
        />

        <input
          className="input"
          placeholder="Bank Account No"
          value={form.bank_account_no}
          onChange={(e) => handleChange("bank_account_no", e.target.value)}
        />

        <input
          className="input"
          placeholder="Annual Income"
          value={form.annual_income}
          onChange={(e) => handleChange("annual_income", e.target.value)}
        />

        <input
          className="input"
          placeholder="Caste"
          value={form.caste}
          onChange={(e) => handleChange("caste", e.target.value)}
        />

        <input
          className="input"
          placeholder="Community"
          value={form.community}
          onChange={(e) => handleChange("community", e.target.value)}
        />

        {/* FEES */}
        <input
          type="number"
          className="input"
          placeholder="Total Fee"
          value={form.total_fee}
          onChange={(e) => handleChange("total_fee", e.target.value)}
        />

        <input
          type="number"
          className="input"
          placeholder="Paid Fee"
          value={form.paid_fee}
          onChange={(e) => handleChange("paid_fee", e.target.value)}
        />

        {/* YEAR */}
        <select
          className="input"
          value={form.academic_year}
          onChange={(e) => handleChange("academic_year", e.target.value)}
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Register Student
      </button>
    </div>
  );
};

export default StudentForm;
