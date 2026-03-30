 
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";

import dnaImg from "../assets/images/DNA.jpg";
import dpcaImg from "../assets/images/DPCA.jpg";
import xrayImg from "../assets/images/Dxray.jpg";
import dmltImg from "../assets/images/DMLT.jpg";
import dentalImg from "../assets/images/DDT.jpg";
import vhnImg from "../assets/images/vhn.jpg";
import anmImg from "../assets/images/ANM.jpg";
import gnmImg from "../assets/images/gnm.jpg";
import typewritingImg from "../assets/images/Tw.jpg";
import beauticianImg from "../assets/images/beautician.jpg";

const Courses = () => {
  const navigate = useNavigate();

  const courses = [
    { key: "DNA", title: "Diploma Nursing Assistant (DNA)", duration: "2 Years", image: dnaImg },
    { key: "DPCA", title: "Diploma Patient Care Assistant (DPCA)", duration: "2 Years", image: dpcaImg },
    { key: "XRAY", title: "Diploma X-Ray Technology", duration: "2 Years", image: xrayImg },
    { key: "DMLT", title: "Diploma Medical Laboratory Technology (DMLT)", duration: "2 Years", image: dmltImg },
    { key: "DENTAL", title: "Diploma Dental Technology", duration: "2 Years", image: dentalImg },
    { key: "VHN", title: "Village Health Nurse (VHN)", duration: "2 Years", image: vhnImg },
    { key: "ANM", title: "Auxiliary Nurse Midwifery (ANM)", duration: "2 Years", image: anmImg },
    { key: "GNM", title: "General Nursing Midwifery (GNM)", duration: "3 Years", image: gnmImg },
    { key: "TYPE", title: "Typewriting", duration: "6 Months", image: typewritingImg },
    { key: "BEAUTY", title: "Beautician Course", duration: "6 Months", image: beauticianImg },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-8">
        Our Courses
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.key}
            title={course.title}
            duration={course.duration}
            image={course.image}
            onClick={() => navigate(`/courses/${course.key}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Courses;