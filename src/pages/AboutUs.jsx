 
import aboutImg from "../assets/images/Group1.jpeg"; // Your image

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white  mt-10 px-6 md:px-24">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gradient-to-r from-blue-600 via-purple-600 to-pink-500 tracking-wide">
        About Us
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
      
         <div className="md:w-1/2 flex justify-center">
          <img
            src={aboutImg}
            alt="TGM Nursing Institute"
            className="rounded-2xl shadow-xl w-full object-cover max-h-[500px] md:max-h-[400px]"
          />
        </div>

        <div className="md:w-1/2 space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
          <p>
            Welcome to{" "}
            <strong className="text-blue-600">TGM Nursing Institute</strong>, a 
            <span className="text-purple-600 font-medium"> premier paramedical training institute </span>
            located in <span className="text-pink-500 font-semibold">Thiyagadurgam, Kallakurichi District</span>. 
            We provide skill-based healthcare education, combining theory with hands-on practical training.
          </p>

          <p>
            <strong className="text-green-600">Our Mission:</strong> 
            <span className="text-gray-800"> To deliver high-quality nursing and paramedical education, ensuring our students are job-ready and confident to succeed in the healthcare industry.</span>
          </p>

          <p>
            <strong className="text-orange-600">Our Vision:</strong> 
            <span className="text-gray-800"> To be the most trusted center for healthcare education in Tamil Nadu, recognized for excellence in training and placement support.</span>
          </p>

          <p>
            We are <strong className="text-blue-500">centrally approved</strong> with modern classrooms, practical labs, free hostel facilities, and expert faculty. Every student is guided towards achieving professional competence and holistic development.
          </p>

          <p>
            Join <strong className="text-pink-600">TGM Nursing Institute</strong> and take the first step towards a rewarding career in healthcare.
          </p>
        </div>

        
       
      </div>
    </div>
  );
};

export default AboutUs;