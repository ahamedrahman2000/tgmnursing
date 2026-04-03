import { useState } from "react";
import logo from "../assets/images/logos.png";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Events", path: "/events" },   // ✅ added
    { name: "Videos", path: "/videos" },   // ✅ added
    { name: "Admin", path: "/admin-login" },
  ];

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">

      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-3">

        {/* Logo + Name */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
          <h1 className="text-lg sm:text-xl font-bold text-blue-800">
            TGM Nursing Institute
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-blue-800">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="hover:text-blue-600 transition"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl text-blue-800"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white px-4 pb-3 shadow-lg">
          {menuItems.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                className="w-full text-left py-3 text-blue-800 font-medium"
              >
                {item.name}
              </button>

              {/* Divider */}
              {i !== menuItems.length - 1 && (
                <hr className="border-gray-200" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;