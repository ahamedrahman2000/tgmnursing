import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

const VisitorFooter = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  // Function to get user IP
  const getUserIP = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip || "unknown";
    } catch (err) {
      console.error("Failed to get IP:", err);
      return "unknown";
    }
  };

  // Function to insert visitor (only if not already tracked)
  const trackVisitor = async () => {
    const alreadyVisited = localStorage.getItem("hasVisited");
    if (alreadyVisited) return; // skip if already counted this session

    const ip = await getUserIP();
    const { error } = await supabase.from("visitors").insert([{ ip_address: ip }]);
    if (error) console.error("Error tracking visitor:", error);

    // mark as visited
    localStorage.setItem("hasVisited", "true");
  };

  // Function to fetch visitor count
  const fetchVisitorCount = async () => {
    const { count, error } = await supabase.from("visitors").select("*", { count: "exact" });
    if (!error) setVisitorCount(count || 0);
  };

  useEffect(() => {
    // Track visitor once per session
    trackVisitor();

    // Fetch initial count
    fetchVisitorCount();

    // Subscribe to real-time inserts
    const subscription = supabase
      .channel("public:visitors")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "visitors" },
        () => setVisitorCount(prev => prev + 1)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <footer className=" mt-1 text-white ">
      🌐 Total Visitors: {visitorCount}
    </footer>
  );
};

export default VisitorFooter;