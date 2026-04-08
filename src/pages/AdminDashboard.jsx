import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

import AddEvents from "./AddEvent";
import DashboardHome from "./DashboardHome";
import { AddVideos } from "./AddVideo";
import CashflowDashboard from "./CashflowDashboard";
import StudentList from "./StudentList";
import StudentForm from "./StudentForm";
import CoursesPage from "./CoursesPage";

const allMenuItems = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "events", label: "Events", icon: "📅" },
  { key: "videos", label: "Videos", icon: "🎥" },
  { key: "add-student", label: "Register", icon: "➕" },
  { key: "students", label: "Students", icon: "👩‍🎓" },
  { key: "courses", label: "Courses", icon: "📚" },
  { key: "cashflow", label: "Management", icon: "💰" },
];

const AdminDashboard = () => {
  const [active, setActive] = useState("dashboard");
  const [showMore, setShowMore] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  // ✅ Fetch user role
  useEffect(() => {
    const getUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setRole(data?.role);
      }
    };

    getUserRole();
  }, []);

  // ✅ FIX: define menuItems AFTER role
  const menuItems =
    role === "admin"
      ? allMenuItems
      : allMenuItems.filter((item) => item.key !== "cashflow");

  // ✅ Mobile split
  const mainMobile = menuItems.slice(0, 4);
  const moreMobile = menuItems.slice(4);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* 🔵 DESKTOP SIDEBAR */}
      <div className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-xl shadow-xl p-5 border-r">
        <h2 className="text-2xl font-bold text-blue-700 mb-8">Admin Panel</h2>

        <div className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl transition
                ${
                  active === item.key
                    ? "bg-blue-600 text-white shadow-lg"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </motion.button>
          ))}
        </div>

        <button
          onClick={logout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      {/* 🟢 MAIN */}
      <div className="flex-1 flex flex-col pb-24 md:pb-6">
        <div className="p-4 md:p-6">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-4 md:p-6 min-h-[80vh]"
          >
            {active === "dashboard" && <DashboardHome />}
            {active === "events" && <AddEvents />}
            {active === "videos" && <AddVideos />}
            {active === "add-student" && <StudentForm />}
            {active === "students" && <StudentList />}
            {active === "courses" && <CoursesPage />}
            {active === "cashflow" && role === "admin" && <CashflowDashboard />}
          </motion.div>
        </div>
      </div>

      {/* 📱 MOBILE BOTTOM NAV */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[95%] bg-white/90 backdrop-blur-xl shadow-xl border rounded-2xl flex justify-around items-center py-2 md:hidden">

        {mainMobile.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActive(item.key);
              setShowMore(false);
            }}
            className={`flex flex-col items-center text-xs px-2 py-1 rounded-lg
              ${
                active === item.key
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600"
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

        <button
          onClick={() => setShowMore(!showMore)}
          className="flex flex-col items-center text-xs px-2 py-1 text-gray-600"
        >
          ⋯
          <span>More</span>
        </button>
      </div>

      {/* 🔥 FLOATING MENU */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[50%] bg-white rounded-2xl shadow-xl p-4 md:hidden"
          >
            <div className="grid grid-cols-1 gap-4 text-center">

              {moreMobile.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActive(item.key);
                    setShowMore(false);
                  }}
                  className="flex flex-col items-center text-sm text-gray-700"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              <button
                onClick={logout}
                className="flex flex-col items-center text-sm text-red-500"
              >
                🚪
                <span>Logout</span>
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;