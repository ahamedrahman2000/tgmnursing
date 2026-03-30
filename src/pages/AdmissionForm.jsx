import   { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdmissionForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    motherName: "",
    dob: "",
    sex: "",
    address: "",
    mobile: "",
    course: "", // ✅ added
  });

  const [submitted, setSubmitted] = useState(false);

  const adminNumber = "919500655394";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const admissionID = Math.floor(1000 + Math.random() * 9000);

    const message = `TGM Nursing Admission
ID: ${admissionID}
Student: ${formData.studentName}
Mobile: ${formData.mobile}
Course: ${formData.course || "Not Selected"}`;

    window.open(
      `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-start py-10">
      <div className="bg-white rounded-xl shadow-md max-w-2xl w-full p-6">

        <button
          className="text-blue-700 font-semibold mb-4"
          onClick={() => navigate(-1)} // ✅ FIXED
        >
          ← Back
        </button>

        {submitted ? (
          <div className="text-center">
            <h2 className="text-lg font-bold mb-3">
              நீங்கள் விரைவில் அழைக்கப்படுவீர்கள்!
            </h2>
            <p className="text-gray-700 mb-4">
              You will get a call back soon.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">
              Admission Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">

              <div>
                <label>Student Name</label>
                <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
              </div>

              <div>
                <label>Father's Name</label>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
              </div>

              <div>
                <label>Mother's Name</label>
                <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label>Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
                </div>

                <div>
                  <label>Sex</label>
                  <select name="sex" value={formData.sex} onChange={handleChange} required className="w-full border rounded px-2 py-1">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Home Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded px-2 py-1" />
              </div>

              <div>
                <label>Mobile No</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full border rounded px-2 py-1" />
              </div>

              {/* ✅ NEW DROPDOWN */}
              <div>
                <label>Course (Optional)</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select Course</option>
                  <option value="DNA">Diploma Nursing Assistant (DNA)</option>
                  <option value="DPCA">Diploma Patient Care Assistant (DPCA)</option>
                  <option value="XRAY">Diploma X-Ray Technology</option>
                  <option value="DMLT">Diploma Medical Laboratory Technology</option>
                  <option value="DENTAL">Diploma Dental Technology</option>
                  <option value="VHN">Village Health Nurse</option>
                  <option value="ANM">ANM</option>
                  <option value="GNM">GNM</option>
                  <option value="TYPE">Typewriting</option>
                  <option value="BEAUTY">Beautician</option>
                </select>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition"
                >
                  Apply
                </button>
              </div>

            </form>
          </>
        )}
      </div>
    </div>
  );
};