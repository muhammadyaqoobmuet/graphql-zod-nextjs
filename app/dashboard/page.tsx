"use client";
import { useUser } from "@/context/userContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { user, loadUserFromToken } = useUser() || {};
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

//   useEffect(() => {
//     const initializeUser = async () => {
//       const token = localStorage.getItem("_productivity-track-token");
//       if (!token) {
//         router.push("/register");
//         return;
//       }
//       if (loadUserFromToken) {
//         await loadUserFromToken();
//       }
//       setIsLoading(false);
//     };

//     initializeUser();
//   }, [loadUserFromToken, router]);

//   console.log("Dashboard user:", user);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

  if (!user) {
    return <div>Please log in to access dashboard</div>;
  }

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <p>Hello, {user.email}!</p>
      <p>User ID: {user.id}</p>
      <p>Created: {user.createdAt}</p>
    </div>
  );
};

export default Dashboard;
