// // ResetPassword.jsx
// import   { useState } from "react";
// import { supabase } from "../config/supabaseClient";
// import { useNavigate } from "react-router-dom";

// const ResetPassword = () => {
//   const [email, setEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [code, setCode] = useState(""); // token from email link
//   const [step, setStep] = useState(1); // step 1: request, step 2: reset
//   const navigate = useNavigate();

//   // Step 1: request reset email
//   const handleRequestReset = async () => {
//     if (!email) return alert("Please enter your email");

//     const {  error } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: "https://tgmnursing.onrender.com/reset-password", // adjust for deployment
//     });

//     if (error) {
//       alert(error.message);
//     } else {
//       alert("Check your email for reset instructions ✅");
//       setStep(2);
//     }
//   };

//   // Step 2: reset password using token
//   const handleResetPassword = async () => {
//     if (!newPassword || !code) return alert("Please provide all details");

//     const {  error } = await supabase.auth.updateUser({
//       password: newPassword,
//       email: email,
//       // Supabase automatically picks token from URL if using authLink
//     });

//     if (error) {
//       alert(error.message);
//     } else {
//       alert("Password reset successful ✅");
//       navigate("/admin-login");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
//       <div className="bg-white p-6 rounded-2xl shadow w-full max-w-sm">
//         <h2 className="text-xl font-bold mb-5 text-center text-blue-700">
//           Reset Password
//         </h2>

//         {step === 1 && (
//           <>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <button
//               onClick={handleRequestReset}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
//             >
//               Send Reset Email
//             </button>
//           </>
//         )}

//         {step === 2 && (
//           <>
//             <input
//               type="text"
//               placeholder="Enter reset code from email"
//               className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//             />
//             <input
//               type="password"
//               placeholder="Enter new password"
//               className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//             />
//             <button
//               onClick={handleResetPassword}
//               className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
//             >
//               Reset Password
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;

// ResetPassword.jsx
import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = request email, 2 = reset password
  const navigate = useNavigate();

  useEffect(() => {
    // If the page is accessed via Supabase reset link, move to step 2
    const params = new URLSearchParams(window.location.search);
    if (params.get("access_token")) {
      setStep(2);
    }
  }, []);

  // Step 1: request reset email
  const handleRequestReset = async () => {
    if (!email) return alert("Please enter your email");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for reset instructions ✅");
      setStep(2);
    }
  };

  // Step 2: reset password
  const handleResetPassword = async () => {
    if (!newPassword) return alert("Enter a new password");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password reset successful ✅");
      navigate("/admin-login");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-5 text-center text-blue-700">
          Reset Password
        </h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleRequestReset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              Send Reset Email
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;