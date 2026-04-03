import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Courses from "./pages/Courses"; 
import VideoPage from "./pages/VideoPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import { Routes, Route } from "react-router-dom";
import CourseDetails from "./pages/CourseDetails";
import { AdmissionForm } from "./pages/AdmissionForm";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { Events } from "./pages/Events";
import GalleryPage from "./pages/GalleryPage";
import StudentList from "./pages/StudentsList";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
       <Route path="/gallery/:type" element={<GalleryPage />} />
        <Route path="/videos" element={<VideoPage />} /> 
        <Route path="/events" element={<Events />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentList />
            </ProtectedRoute>
          }
        />
        <Route path="/courses/:courseKey" element={<CourseDetails />} />
        <Route path="/admission" element={<AdmissionForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
