"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  const [logined, setIsLogined] = useState(false);
  const handleClick = () => {
    if (!logined) {
      router.push("/login");
    }
  };

  useEffect(() => {
    const checkIsLoginedOrNott = () => {
      if (user) {
        setIsLogined(true);
      }
      setIsLogined(false);
    };
  }, []);
  const { user, logout } = useUser();
  return <Button onClick={handleClick}>{user ? "logout" : "login"}</Button>;
};

export default Logout;
