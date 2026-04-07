import { useState, useEffect } from "react";
import logo from "../assets/images/logos.png";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // ✅ Check Supabase session
  useEffect(() => {
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAdmin(!!session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getSession();
    setIsAdmin(!!data.session);
  };

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Events", path: "/gallery/images" },
    { name: "Videos", path: "/videos" },
  ];

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">

      <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-3">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} className="w-10 h-10" />
          <h1 className="text-lg sm:text-xl font-bold text-blue-800">
            TGM Nursing Institute
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-blue-800">
          
          {menuItems.map((item, i) => (
            <Link key={i} to={item.path} className="hover:text-blue-600">
              {item.name}
            </Link>
          ))}

          {/* ✅ Dynamic Admin/Login */}
          {!isAdmin ? (
            <Link to="/admin-login">Admin</Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-red-500"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-3">

          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
              className="block w-full text-left py-2"
            >
              {item.name}
            </button>
          ))}

          {!isAdmin ? (
            <button
              onClick={() => navigate("/admin-login")}
              className="w-full text-left py-2"
            >
              Admin
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 text-red-500"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;