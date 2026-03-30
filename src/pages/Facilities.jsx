 
const facilitiesData = [
  { icon: "💧", label: "R.O Water" },
  { icon: "🎥", label: "CCTV" },
  { icon: "🖥️", label: "Smart Class" },
  { icon: "🏠", label: "Free Hostel" },
  { icon: "🧪", label: "Practical Training" },
  { icon: "👨‍⚕️", label: "Doctors" },
];

const benefitsData = [
  { icon: "🎽", label: "Uniform" },
  { icon: "📚", label: "Books" },
  { icon: "🆔", label: "ID Card" },
  { icon: "🧘", label: "Training" },
];

export const AdmissionSection = () => {
  return (
    <div className="bg-white rounded-2xl mb-2 shadow-md p-4 sm:p-6">

      {/* Title */}
      <h2 className="text-lg sm:text-xl font-bold text-blue-700 mb-5 text-center">
        Admission Benefits & Facilities
      </h2>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SIDE - TEXT CONTENT */}
        <div className="space-y-4 text-sm text-gray-700">

          {/* Fee Concession */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">🎓 Fee Concessions (சிறப்பு சலுகைகள்)</h3>
            <ul className="space-y-1 text-xs sm:text-sm">
              <li>✔ Orphan Girls (பெற்றோர் இல்லாத பெண்கள்)</li>
              <li>✔ Women Sportspersons (விளையாட்டு பெண்கள்)</li>
              <li>✔ Differently-abled Women (மாற்றுத்திறனாளி பெண்கள்)</li>
              <li>✔ Widowed Women (விதவை பெண்கள்)</li>
              <li>✔ 10th ≥ 350 | 12th ≥ 400</li>
            </ul>
            <p className="text-[11px] text-green-600 mt-1">
              அனைத்து மாணவிகளுக்கும் கட்டண தள்ளுபடி வழங்கப்படும்
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">🎁 Benefits</h3>
            <ul className="space-y-1 text-xs sm:text-sm">
              <li>✔ 100% Job Guarantee (100% வேலை வாய்ப்பு)</li>
              <li>✔ Govt Approved (அரசு அங்கீகாரம்)</li>
            </ul>
          </div>

          {/* Free Classes */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">🧘 Free Training</h3>
            <ul className="space-y-1 text-xs sm:text-sm">
              <li>✔ Yoga (யோகா)</li>
              <li>✔ Sports (விளையாட்டு)</li>
              <li>✔ Self Defense (சுய பாதுகாப்பு)</li>
            </ul>
          </div>

        </div>

        {/* RIGHT SIDE - ICON GRID */}
        <div className="space-y-5">

          {/* Facilities */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">🏥 Facilities</h3>
            <div className="grid grid-cols-2 gap-2">
              {facilitiesData.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                >
                  <span className="text-base">{f.icon}</span>
                  <span className="text-xs sm:text-sm">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Free Items */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">🎒 Free Items</h3>
            <div className="grid grid-cols-2 gap-2">
              {benefitsData.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                >
                  <span className="text-base">{b.icon}</span>
                  <span className="text-xs sm:text-sm">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};