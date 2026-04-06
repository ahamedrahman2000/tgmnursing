import  { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import AddEvents from "./AddEvent";  
import DashboardHome from "./DashboardHome";
import { supabase } from "../config/supabaseClient";
import { AddVideos } from "./AddVideo";
import CashflowDashboard from "./CashflowDashboard";
import StudentList from "./StudentList";
import StudentForm from "./StudentForm";
import CoursesPage from "./CoursesPage";
const AdminDashboard = () => {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

const logout = async () => {
  await supabase.auth.signOut(); // logout from supabase
  localStorage.removeItem("supabase_session");
  navigate("/admin-login");
};

  return (
   <div className="flex min-h-screen bg-gray-100">

  {/* 🔵 DESKTOP SIDEBAR */}
  <div className="hidden md:block w-64 bg-white shadow-lg p-4">
    <h2 className="text-xl font-bold text-blue-700 mb-6">
      Admin Panel
    </h2>

    <div className="space-y-3">
      <button onClick={() => setActive("dashboard")} className="menu-btn">  Dashboard </button>
      <button onClick={() => setActive("events")} className="menu-btn">Add Events</button>
      <button onClick={() => setActive("videos")} className="menu-btn">Add Videos</button>
      <button onClick={() => setActive("add-student")} className="menu-btn">Register Student</button>
      <button onClick={() => setActive("students")} className="menu-btn">All Students</button>
      <button onClick={() => setActive("courses")} className="menu-btn">All Courses</button>
      <button onClick={() => setActive("cashflow")} className="menu-btn">Management</button>
    </div>

    <button
      onClick={logout}
      className="mt-10 w-full bg-red-500 text-white py-2 rounded"
    >
      Logout
    </button>
  </div>

  {/* 🟢 CONTENT */}
  <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
    {active === "dashboard" && <DashboardHome />}
    {active === "events" && <AddEvents />}
    {active === "videos" && <AddVideos />}
    {active === "add-student" && <StudentForm />}
    {active === "students" && <StudentList />}
    {active === "courses" && <CoursesPage />}
    {active === "cashflow" && <CashflowDashboard />}
  </div>

  {/* 📱 MOBILE BOTTOM NAV */}
  <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t flex justify-around items-center py-2 md:hidden">
<button onClick={() => setActive("dashboard")} className="flex flex-col items-center text-xs">
  📊
  <span>Home</span>
</button>
    <button onClick={() => setActive("events")} className="flex flex-col items-center text-xs">
      📅
      <span>Events</span>
    </button>

    <button onClick={() => setActive("videos")} className="flex flex-col items-center text-xs">
      🎥
      <span>Videos</span>
    </button>

    <button onClick={() => setActive("add-student")} className="flex flex-col items-center text-xs">
      ➕
      <span>Add</span>
    </button>

    <button onClick={() => setActive("students")} className="flex flex-col items-center text-xs">
      👩‍🎓
      <span>Students</span>
    </button>

    <button onClick={() => setActive("cashflow")} className="flex flex-col items-center text-xs">
      👩‍🎓
      <span>Students</span>
    </button>

    <button onClick={logout} className="flex flex-col items-center text-xs text-red-500">
      🚪
      <span>Logout</span>
    </button>

  </div>

</div>
  );
};

export default AdminDashboard;