 
const CourseCard = ({ title, duration, image, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white cursor-pointer rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
  >
    <div className="h-40 w-full overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4 text-center">
      <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-800">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 mt-1">{duration}</p>
    </div>
  </div>
);

export default CourseCard;