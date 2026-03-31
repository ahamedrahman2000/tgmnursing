import  { useState } from "react";

const AddStudents = () => {
  const initialState = {
    admission_no: "",
    form_no: "",
    admission_date: "",
    student_name: "",
    father_name: "",
    mother_name: "",
    dob: "",
    gender: "",
    address: "",
    mobile: "",
    yearly_fee: "",
    last_school: "",
    parent_occupation: "",
    religion: "",
    caste: "",
    community: "",
    income: "",
    aadhar_no: "",
    bank_account_no: "",
    qualification: "",
    registration_date: "",
    course: "",
    place: "Thiyagadurgam",
  };

  const [form, setForm] = useState(initialState);
  const [documents, setDocuments] = useState([]);
  const docOptions = [
    "TC",
    "Degree Marksheet",
    "12th Marksheet",
    "10th Marksheet",
    "8th Marksheet",
    "Community",
    "Income",
    "Aadhaar",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (doc) => {
    if (documents.includes(doc)) {
      setDocuments(documents.filter((d) => d !== doc));
    } else {
      setDocuments([...documents, doc]);
    }
  };

  const handleAllDocs = () => {
    if (documents.length === docOptions.length) {
      setDocuments([]);
    } else {
      setDocuments(docOptions);
    }
  };

  const handleSubmit = async () => {
    if (!form.student_name || !form.mobile) {
      return alert("Please fill required fields");
    }

    // ✅ IMPORTANT FIX: include documents
    const dataToSend = {
      ...form,
      documents,
    };

    const res = await fetch("http://tgmnursing.onrender.com/api/students/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (res.ok) {
      alert("Student Added ✅");
      setForm(initialState);
      setDocuments([]); // ✅ reset checkboxes
    } else {
      alert("Error ❌");
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow max-w-5xl mx-auto">

      <h2 className="text-lg md:text-xl font-bold text-center mb-1">
        Institute of Paramedical Science
      </h2>
      <p className="text-center text-xs md:text-sm text-gray-500 mb-4">
        Admission Form
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <input name="admission_no" value={form.admission_no} placeholder="Admission No" onChange={handleChange} className="input" />
        <input name="form_no" value={form.form_no} placeholder="Form No" onChange={handleChange} className="input" />
      </div>

      <div>
        <label className="text-sm text-gray-600">Admission Date</label>
        <input type="date" name="admission_date" value={form.admission_date} onChange={handleChange} className="input" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        <input name="student_name" value={form.student_name} placeholder="Student Name" onChange={handleChange} className="input" />
        <input name="father_name" value={form.father_name} placeholder="Father Name" onChange={handleChange} className="input" />
        <input name="mother_name" value={form.mother_name} placeholder="Mother Name" onChange={handleChange} className="input" />

        <input name="qualification" value={form.qualification} placeholder="Qualification" onChange={handleChange} className="input" />

        <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input" />

        <select name="gender" value={form.gender} onChange={handleChange} className="input">
          <option value="">Sex</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input name="mobile" value={form.mobile} placeholder="Mobile No" onChange={handleChange} className="input" />

        <input name="yearly_fee" value={form.yearly_fee} placeholder="Yearly Fee" onChange={handleChange} className="input" />

        <input name="last_school" value={form.last_school} placeholder="Last School Attended" onChange={handleChange} className="input" />

        <input name="parent_occupation" value={form.parent_occupation} placeholder="Parent Occupation" onChange={handleChange} className="input" />

        <input name="religion" value={form.religion} placeholder="Religion" onChange={handleChange} className="input" />

        <input name="caste" value={form.caste} placeholder="Caste (Gen/SC/BC/ST)" onChange={handleChange} className="input" />

        <input name="community" value={form.community} placeholder="Community" onChange={handleChange} className="input" />

        <input name="income" value={form.income} placeholder="Annual Income" onChange={handleChange} className="input" />

        <input name="aadhar_no" value={form.aadhar_no} placeholder="Aadhar No" onChange={handleChange} className="input" />

        <input name="bank_account_no" value={form.bank_account_no} placeholder="Bank Account No" onChange={handleChange} className="input" />

        {/* DOCUMENTS */}
        <div className="md:col-span-2">
          <p className="font-semibold mb-2">Documents Submitted</p>

          <label className="flex items-center gap-2 mb-2 font-medium">
            <input
              type="checkbox"
              checked={documents.length === docOptions.length}
              onChange={handleAllDocs}
            />
            All Documents
          </label>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {docOptions.map((doc) => (
              <label key={doc} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={documents.includes(doc)}
                  onChange={() => handleCheckbox(doc)}
                />
                {doc}
              </label>
            ))}
          </div>
        </div>

        <input type="date" name="registration_date" value={form.registration_date} onChange={handleChange} className="input" />

        <select name="course" value={form.course} onChange={handleChange} className="input">
          <option value="">Select Course</option>
          <option>DNA</option>
          <option>DPCA</option>
          <option>DMLT</option>
          <option>GNM</option>
          <option>ANM</option>
          <option>VHN</option>
          <option>X-Ray</option>
          <option>Dental</option>
          <option>Beautician</option>
          <option>Typewriting</option>
        </select>

        <input name="place" value={form.place} readOnly className="input bg-gray-100" />

        <textarea name="address" value={form.address} placeholder="Home Address" onChange={handleChange} className="input md:col-span-2" />

      </div>

      

      <button
        onClick={handleSubmit}
        className="mt-6 w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Register Student
      </button>
    </div>
  );
};

export default AddStudents;