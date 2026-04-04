// Contact.jsx
export const Contact = () => (
  <div className="bg-white p-6 rounded-2xl shadow-lg  mt-6">
    <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center md:text-left">
      Contact Us
    </h2>

    <div className="flex flex-col md:flex-row md:gap-8 items-start">
      
      {/* Left: Address + Phone + Email */}
      <div className="md:w-1/2 space-y-3 text-sm sm:text-base">
        <p>
          📍 <span className="font-semibold">Address:</span> TGM Institute, Thirukovilur Road, Near Police Station, Thiyagadurgam, 606206
        </p>
        <p>
          📞 <span className="font-semibold">Phone:</span> 95006 55394 / 94428 88394
        </p>
        <p>
          ✉️ <span className="font-semibold">Email:</span> tgmnursing2019@gmail.com
        </p>

        {/* CTA Buttons */}
       
      </div>

      {/* Right: Map */}
      <div className="md:w-1/2 mt-6 md:mt-0 rounded-xl overflow-hidden shadow-inner">
        <iframe
          src="https://maps.google.com/maps?q=TGM%20Institute%2C%20Thirukovilur%20Road%2C%20Near%20Police%20Station%2C%20Thiyagadurgam%20606206&t=&z=15&ie=UTF8&iwloc=&output=embed"
          className="w-full h-64 sm:h-80 md:h-full"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
           title="map"
        ></iframe>
      </div>
    </div>
  </div>
);