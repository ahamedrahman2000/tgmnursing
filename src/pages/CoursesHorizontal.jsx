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

const CoursesHorizontal = () => {
  const navigate = useNavigate();

  const courses = [
    { key: "DNA", title: "Diploma Nursing Assistant", duration: "2 Years", image: dnaImg },
    { key: "DPCA", title: "Patient Care Assistant", duration: "2 Years", image: dpcaImg },
    { key: "XRAY", title: "X-Ray Technology", duration: "2 Years", image: xrayImg },
    { key: "DMLT", title: "Medical Lab Technology", duration: "2 Years", image: dmltImg },
    { key: "DENTAL", title: "Dental Technology", duration: "2 Years", image: dentalImg },
    { key: "VHN", title: "Village Health Nurse", duration: "2 Years", image: vhnImg },
    { key: "ANM", title: "ANM", duration: "2 Years", image: anmImg },
    { key: "GNM", title: "GNM", duration: "3 Years", image: gnmImg },
    { key: "TYPE", title: "Typewriting", duration: "6 Months", image: typewritingImg },
    { key: "BEAUTY", title: "Beautician", duration: "6 Months", image: beauticianImg },
  ];

  return (
    <div className="bg-gray-50 px-3 py-4 sm:p-6">

  {/* TITLE */}
  <h1 className="text-xl sm:text-3xl font-bold text-center text-blue-700 mb-4">
    Our Courses
  </h1>

  {/* HORIZONTAL SCROLL */}
  <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">

    {courses.map((course) => (
      <div
        key={course.key}
        onClick={() => navigate(`/courses/${course.key}`)}
        className="min-w-[160px] sm:min-w-[220px] bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
      >
        {/* IMAGE */}
        <img
          src={course.image}
          alt={course.title}
          className="h-28 sm:h-40 w-full object-cover rounded-t-xl"
        />

        {/* CONTENT */}
        <div className="p-2">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2">
            {course.title}
          </h3>

          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
            ⏳ {course.duration}
          </p>
        </div>
      </div>
    ))}

  </div>
</div>
  );
};

export default CoursesHorizontal;