"use client";
import { useUser } from "@/context/userContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { user, loadUserFromToken } = useUser() || {};
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

 
 

  

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
