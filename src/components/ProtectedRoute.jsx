// import { Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { supabase } from "../config/supabaseClient";

// const ProtectedRoute = ({ children }) => {
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const checkUser = async () => {
//       const { data } = await supabase.auth.getUser();
//       setUser(data.user);
//       setLoading(false);
//     };

//     checkUser();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   if (!user) return <Navigate to="/admin-login" replace />;

//   return children;
// };

// export default ProtectedRoute;

// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser(); // get active user
      setUser(data.user || null);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/admin-login" replace />;

  return children;
};

export default ProtectedRoute;