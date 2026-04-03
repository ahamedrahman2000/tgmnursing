import { useState } from "react";
import { Hero } from "./Hero";
import { Stats } from "./Stats";
import { Events } from "./Events";
import { Videos } from "./Videos";
import { AdmissionSection } from "./Facilities";
import { Achievements } from "./Achievements";
import { Trust } from "./Trust";
import { FAQ } from "./FAQ";
import { Contact } from "./Contact";
import { AdmissionForm } from "./AdmissionForm"; // import AdmissionForm
import Footer from "./Footer";

const Home = ({ setPage }) => {
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {showAdmissionForm ? (
        <AdmissionForm goBack={() => setShowAdmissionForm(false)} />
      ) : (
        <>
          {/* 🔴 Announcement */}
          <div className="bg-red-600 text-white text-center py-2 text-xs animate-pulse">
            🎉 Admission Open | Limited Seats | Call Now 📞
          </div>

          {/* 🌟 Hero */}
          <Hero
            setPage={setPage}
            goToAdmission={() => setShowAdmissionForm(true)}
          />

          {/* 📦 Main Container */}
          <div>
            {/* 📊 Stats */}
            <Stats />

            {/* 📰 Events + Videos */}
            <section id="facilities">
              <AdmissionSection />
            </section>
            <Events />

            {/* 📚 Facilities + Benefits */}

            <Achievements />

            <Videos />
            {/* 💬 Trust + FAQ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Trust />
              <section id="faq">
                <FAQ />
              </section>
            </div>

            {/* 📍 Contact */}
            <Contact />
            <Footer />
          </div>

          {/* ❤️ Sticky Bottom CTA (Responsive FIXED) */}
          {/* ❤️ Floating Buttons (Right Side) */}
          <div className="fixed bottom-5 right-4 flex flex-col gap-3 z-50">
            {/* 📞 Call Button */}
            <a
              href="tel:+919500655394"
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center"
            >
              📞
            </a>

            {/* 💬 WhatsApp Button */}
            <a
              href="https://wa.me/919500655394"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center"
            >
              💬
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
