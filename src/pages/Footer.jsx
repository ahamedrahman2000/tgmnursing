import { useNavigate } from "react-router-dom";
import {
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import logo from "../assets/images/logos.png";
import VisitorFooter from "./VisitorFooter";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-br from-blue-900 to-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-5 py-10 grid gap-8 md:grid-cols-3">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="TGM Nursing Logo"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h2 className="text-xl font-bold tracking-wide leading-tight">
              TGM Nursing
            </h2>
            <p className="text-sm text-gray-300 leading-tight">
              Institute of Paramedical Science
              <br />
              <span className="text-gray-400 text-xs">
                செவிலியர் பயிற்சி நிறுவனம்
              </span>
            </p>
          </div>
        </div>

        {/* CENTER */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-200">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
            <p
              onClick={() => navigate("/admission")}
              className="cursor-pointer hover:text-white"
            >
              📄 Admission
            </p>
            <p
              onClick={() => navigate("/courses")}
              className="cursor-pointer hover:text-white"
            >
              📚 Courses
            </p>
            <p
              onClick={() => navigate("/videos")}
              className="cursor-pointer hover:text-white"
            >
              🎥 Videos
            </p>
            <a href="#offers" className="hover:text-white">
              🎓 Fee Offers
            </a>
            <a href="#facilities" className="hover:text-white">
              🏥 Facilities
            </a>
            <a href="#faq" className="hover:text-white">
              ❓ FAQ
            </a>
            <p
              onClick={() => navigate("/aboutus")}
              className="cursor-pointer hover:text-white"
            >
              ℹ️ About Us
            </p>
            <p
              onClick={() => navigate("/privacy")}
              className="cursor-pointer hover:text-white"
            >
              🔒 Privacy Policy
            </p>
            <p
              onClick={() => navigate("/terms")}
              className="cursor-pointer hover:text-white"
            >
              📜 Terms & Conditions
            </p>
            <p
              onClick={() => navigate("/resources")}
              className="cursor-pointer hover:text-white"
            >
              📚 Our Other Resources
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-200">Contact</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            📍 Thirukovilur Road,   Thiyagadurgam - 606206
          </p>
          <p className="text-sm mt-3 font-medium">📞 95006 55394</p>
          <p className="text-xs mt-1 text-gray-400">
            ✉️ tgmnursing2019@gmail.com
            <VisitorFooter />
          </p>
  
          <div className="flex gap-4 mt-4 text-2xl">
            <a
              href="https://www.instagram.com/tgmnursing/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              style={{ color: "#E4405F" }} // Instagram pink
            >
              <FaInstagram />
            </a>

            <a
              href="https://wa.me/9500655394"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              style={{ color: "#25D366" }} // WhatsApp green
            >
              <FaWhatsapp />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              style={{ color: "#1877F2" }} // Facebook blue
            >
              <FaFacebookF />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              style={{ color: "#1DA1F2" }} // Twitter blue
            >
              <FaTwitter />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              style={{ color: "#FF0000" }} // YouTube red
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-white/10 mx-5"></div>

      {/* BOTTOM BAR */}
      <div className="bg-black text-gray-400 text-xs py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-2">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} TGM Nursing Institute
          </p>
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition"
          >
            Developed by{" "}
            <span className="font-semibold text-white">EliteCode Academy</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
