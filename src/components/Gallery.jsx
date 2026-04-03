 

const Gallery = ({ images = [] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img, index) => (
        <div key={index} className="overflow-hidden rounded-xl shadow">
          <img
            src={img}
            alt="event"
            className="w-full h-40 object-cover hover:scale-105 transition"
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;