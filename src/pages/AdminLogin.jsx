// import  { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../config/supabaseClient"; // make sure you have supabase client initialized

// const AdminLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       // Supabase sign-in
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) {
//         alert(error.message);
//         return;
//       }

//       if (data?.user) {
//         alert("Login successful ✅");

//         // Optionally save session info
//         localStorage.setItem("supabase_session", JSON.stringify(data.session));

//         // Navigate to dashboard
//         navigate("/admin-dashboard");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!email) return alert("Enter your email first");

//     const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: "https://tgmnursing.onrender.com/reset-password",
//     });

//     if (error) {
//       alert(error.message);
//     } else {
//       alert("Password reset email sent ✅");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
//       <div className="bg-white p-6 rounded-2xl shadow w-full max-w-sm">

//         <h2 className="text-xl font-bold mb-5 text-center text-blue-700">
//           Admin Login
//         </h2>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           onClick={handleLogin}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition mb-2"
//         >
//           Login
//         </button>

//         <p className="text-xs text-right text-blue-600 cursor-pointer" onClick={handleForgotPassword}>
//           Forgot Password?
//         </p>

//       </div>
//     </div>
//   );
// };

// export default AdminLogin;

 // src/pages/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        navigate("/admin-dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  // ✅ Handle login
  const handleLogin = async () => {
    if (!email || !password) return alert("Enter email & password");

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data?.user) {
        alert("Login successful ✅");
        // Session is automatically managed by Supabase
        navigate("/admin-dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle password reset
  const handleForgotPassword = async () => {
    if (!email) return alert("Enter your email first");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password reset email sent ✅");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-5 text-center text-blue-700">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition mb-2"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          className="text-xs text-right text-blue-600 cursor-pointer hover:underline"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;