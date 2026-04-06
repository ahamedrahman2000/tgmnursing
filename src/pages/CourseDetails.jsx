import { useParams, useNavigate } from "react-router-dom";

const courseData = {
  DNA: {
    title: "Diploma Nursing Assistant (DNA)",
    duration: "2 Years",
    eligibility: "10th or 12th Pass",
    training: "Basic nursing care, patient handling, hospital procedures.",
    practical: "Hospital ward training, patient care practice.",
    jobs: "Nursing Assistant, Ward Assistant, Hospital Helper.",
    salary: "₹10,000 - ₹18,000 / month",
    certification: "Government / Institution Approved Certificate",
    growth: "Can become Staff Nurse with higher studies.",
    higherStudies: "GNM, B.Sc Nursing",
    admission: "Direct admission with basic qualification.",
  },

  DPCA: {
    title: "Diploma Patient Care Assistant (DPCA)",
    duration: "2 Years",
    eligibility: "10th or 12th Pass",
    training: "Patient care, hygiene, medical support.",
    practical: "Hospital and home care training.",
    jobs: "Patient Care Assistant, Home Care Nurse.",
    salary: "₹10,000 - ₹20,000 / month",
    certification: "Certified Patient Care Assistant",
    growth: "Senior Care Assistant / Nursing roles.",
    higherStudies: "GNM, Nursing Courses",
    admission: "Direct admission.",
  },

  XRAY: {
    title: "Diploma X-Ray Technology",
    duration: "2 Years",
    eligibility: "12th Science preferred",
    training: "Radiology basics, X-ray machine handling.",
    practical: "Scan centers & hospital radiology training.",
    jobs: "X-Ray Technician, Radiology Assistant.",
    salary: "₹15,000 - ₹30,000 / month",
    certification: "Radiology Technician Certificate",
    growth: "Senior Radiographer, CT Scan Specialist.",
    higherStudies: "B.Sc Radiology",
    admission: "Based on 12th qualification.",
  },

  DMLT: {
    title: "Diploma Medical Laboratory Technology (DMLT)",
    duration: "2 Years",
    eligibility: "12th Science",
    training: "Lab testing, blood analysis, diagnostics.",
    practical: "Lab practical training in hospitals.",
    jobs: "Lab Technician, Blood Bank Staff.",
    salary: "₹15,000 - ₹25,000 / month",
    certification: "DMLT Certificate",
    growth: "Senior Lab Technician",
    higherStudies: "B.Sc MLT",
    admission: "Science background required.",
  },

  DENTAL: {
    title: "Diploma Dental Technology",
    duration: "2 Years",
    eligibility: "10th or 12th Pass",
    training: "Dental care, assisting dentists.",
    practical: "Dental clinic training.",
    jobs: "Dental Assistant, Lab Technician.",
    salary: "₹12,000 - ₹25,000 / month",
    certification: "Dental Technician Certificate",
    growth: "Dental Specialist Assistant",
    higherStudies: "Advanced Dental Courses",
    admission: "Direct admission.",
  },

  VHN: {
    title: "Village Health Nurse (VHN)",
    duration: "2 Years",
    eligibility: "10th Pass",
    training: "Community health, maternal care.",
    practical: "Village health camps training.",
    jobs: "Village Nurse, Health Worker.",
    salary: "₹8,000 - ₹18,000 / month",
    certification: "Government Health Certificate",
    growth: "Health Supervisor",
    higherStudies: "ANM, GNM",
    admission: "Basic qualification required.",
  },

  ANM: {
    title: "Auxiliary Nurse Midwifery (ANM)",
    duration: "2 Years",
    eligibility: "12th Pass",
    training: "Nursing, maternity care.",
    practical: "Hospital maternity ward training.",
    jobs: "ANM Nurse, Clinic Nurse.",
    salary: "₹12,000 - ₹25,000 / month",
    certification: "ANM Certificate",
    growth: "Staff Nurse",
    higherStudies: "GNM, B.Sc Nursing",
    admission: "Based on 12th marks.",
  },

  GNM: {
    title: "General Nursing Midwifery (GNM)",
    duration: "3 Years",
    eligibility: "12th Science preferred",
    training: "Full nursing training, ICU care.",
    practical: "Hospital internship training.",
    jobs: "Staff Nurse, ICU Nurse.",
    salary: "₹18,000 - ₹40,000 / month",
    certification: "Registered Nurse Certificate",
    growth: "Senior Nurse, Nurse Manager",
    higherStudies: "B.Sc Nursing, M.Sc Nursing",
    admission: "Merit-based admission.",
  },

  TYPE: {
    title: "Typewriting",
    duration: "6 Months",
    eligibility: "Anyone can apply",
    training: "Typing skills (Tamil & English).",
    practical: "Typing practice sessions.",
    jobs: "Data Entry Operator, Office Assistant.",
    salary: "₹8,000 - ₹15,000 / month",
    certification: "Typewriting Certificate",
    growth: "Office Executive",
    higherStudies: "Computer Courses",
    admission: "Direct admission.",
  },

  BEAUTY: {
    title: "Beautician Course",
    duration: "6 Months",
    eligibility: "Anyone can apply",
    training: "Makeup, skincare, salon training.",
    practical: "Live salon training.",
    jobs: "Beautician, Makeup Artist.",
    salary: "₹10,000 - ₹50,000 / month",
    certification: "Beautician Certificate",
    growth: "Salon Owner, Trainer",
    higherStudies: "Advanced Beauty Courses",
    admission: "Direct admission.",
  },
};

const CourseDetails = () => {
  const { courseKey } = useParams();
  const navigate = useNavigate();

  const course = courseData[courseKey];

  if (!course) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 font-semibold">Course not found</p>
        <button
          onClick={() => navigate("/courses")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-10 space-y-6">

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 mb-1 text-center">
        {course.title}
      </h1>

      <p className="text-center text-gray-600 text-sm sm:text-base mb-6">
        ⏳ Duration: {course.duration}
      </p>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        {/* LEFT SIDE */}
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow space-y-2 sm:space-y-3 text-sm sm:text-base">
          <h2 className="text-md sm:text-lg font-semibold text-blue-600 mb-1">
            📘 Course Details
          </h2>

          <p><b>Eligibility:</b> {course.eligibility}</p>
          <p><b>Training:</b> {course.training}</p>
          <p><b>Practical:</b> {course.practical}</p>
          <p><b>Admission:</b> {course.admission}</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow space-y-2 sm:space-y-3 text-sm sm:text-base">
          <h2 className="text-md sm:text-lg font-semibold text-blue-600 mb-1">
            💼 Career Info
          </h2>

          <p><b>Job Opportunities:</b> {course.jobs}</p>
          <p><b>Salary Range:</b> {course.salary}</p>
          <p><b>Certification:</b> {course.certification}</p>
          <p><b>Career Growth:</b> {course.growth}</p>
          <p><b>Higher Studies:</b> {course.higherStudies}</p>
        </div>

      </div>

      {/* APPLY BUTTON */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
        <button
          onClick={() => navigate("/admission")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md transition w-full sm:w-auto"
        >
          📞 Apply Now
        </button>

        <button
          onClick={() => navigate("/courses")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition w-full sm:w-auto"
        >
          ⬅ Back to Courses
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
