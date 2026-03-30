import  { useState } from "react";

const faqData = [
  {
    question: "What are the fees? | கட்டணங்கள் எவ்வளவு?",
    answer:
      "Our fees are affordable and flexible.\nஎங்கள் கட்டணங்கள் வசதியானதும் கட்டமைக்கப்பட்டதும் ஆகும்.",
  },
  {
    question: "Is hostel available? | ஹோஸ்டல் வசதி உள்ளதா?",
    answer:
      "Yes, free hostel facility is available.\nஆம், இலவச ஹோஸ்டல் வசதி உள்ளது.",
  },
  {
    question: "Will I get a job? | வேலை கிடைக்குமா?",
    answer:
      "Yes, 100% placement support provided.\nஆம், 100% வேலை வாய்ப்பு உதவி வழங்கப்படுகிறது.",
  },
  {
    question: "Is it government approved? | அரசு அங்கீகாரம் உள்ளதா?",
    answer:
      "Yes, Central Government Approved.\nஆம், மத்திய அரசு அங்கீகரிக்கப்பட்டது.",
  },

  // 🔥 NEW FAQs

  {
    question: "What courses are available? | என்னென்ன பாடங்கள் உள்ளன?",
    answer:
      "We offer Nursing, DMLT, GNM, ANM and more paramedical courses.\nநாங்கள் நர்சிங், DMLT, GNM, ANM போன்ற பல பாடங்களை வழங்குகிறோம்.",
  },
  {
    question: "What is the course duration? | படிப்பு காலம் எவ்வளவு?",
    answer:
      "Courses range from 6 months to 3 years.\nபாடநெறிகள் 6 மாதம் முதல் 3 ஆண்டுகள் வரை இருக்கும்.",
  },
  {
    question: "Who can apply? | யார் சேரலாம்?",
    answer:
      "Students who completed 10th or 12th can apply.\n10ம் அல்லது 12ம் வகுப்பு முடித்தவர்கள் சேரலாம்.",
  },
  {
    question: "Is practical training provided? | நடைமுறை பயிற்சி உண்டா?",
    answer:
      "Yes, we provide hospital-based practical training.\nஆம், மருத்துவமனையில் நடைமுறை பயிற்சி வழங்கப்படுகிறது.",
  },
  {
    question: "Any fee concession available? | கட்டண சலுகை உள்ளதா?",
    answer:
      "Yes, concessions available for eligible students.\nஆம், தகுதியான மாணவர்களுக்கு கட்டண சலுகை உள்ளது.",
  },
  {
    question: "Is transport available? | போக்குவரத்து வசதி உள்ளதா?",
    answer:
      "Students can use local transport facilities.\nமாணவர்கள் உள்ளூர் போக்குவரத்தை பயன்படுத்தலாம்.",
  },
  {
    question: "What documents are required? | என்னென்ன ஆவணங்கள் தேவை?",
    answer:
      "Aadhar, Mark Sheets, TC, and photos are required.\nஆதார், மார்க் சீட், TC மற்றும் புகைப்படங்கள் தேவை.",
  },
  {
    question: "When does admission start? | சேர்க்கை எப்போது தொடங்கும்?",
    answer:
      "Admissions are open now. Limited seats available.\nசேர்க்கை தற்போது நடைபெற்று வருகிறது.",
  },
];
export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-white p-3 sm:p-5 rounded-xl shadow-sm max-w-3xl mx-auto">

      {/* Title */}
      <h2 className="text-base sm:text-lg font-bold mb-3 text-center text-gray-800">
        ❓ FAQ
      </h2>

      <div className="space-y-2">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border rounded-md overflow-hidden"
          >
            {/* Question */}
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="w-full flex justify-between items-center px-3 py-2 bg-gray-50 hover:bg-gray-100"
            >
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-left">
                {item.question}
              </span>

              <span className="text-gray-500 text-sm">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {/* Answer */}
            {openIndex === index && (
              <div className="px-3 py-2 text-xs sm:text-sm text-gray-600 bg-white whitespace-pre-line leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};