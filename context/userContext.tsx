"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DocumentNode, gql } from "@apollo/client";
import { client } from "@/components/providers";

// GraphQL queries
export function getCreateUserQuery(): DocumentNode {
  const CREATE_USER = gql`
    mutation CreateUser($input: AuthInput!) {
      createUser(input: $input) {
        id
        email
        token
        createdAt
      }
    }
  `;
  return CREATE_USER;
}
export function getLoginUserQuery(): DocumentNode {
  const LOGIN_USER = gql`
    query LoginUser($input: AuthInput!) {
      loginUser(input: $input) {
        email
        token
        issues {
          name
          id
          status
          content
        }
      }
    }
  `;
  return LOGIN_USER;
}

export function getMeQuery(): DocumentNode {
  const ME_QUERY = gql`
    query Me {
      me {
        id
        email
        createdAt
      }
    }
  `;
  return ME_QUERY;
}

// Create the context
// Type definitions for user data
interface User {
  id: string;
  email: string;
  token: string;
  createdAt: string;
}

const UserContext = createContext<{
  user: User | null;
  signUpUser: (email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUserFromToken: () => Promise<void>;
} | null>(null);

// Provider
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Signup function
  const signUpUser = async (email: string, password: string) => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const { data } = await client.mutate({
        mutation: getCreateUserQuery(),
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      console.log("Full response data:", data);

      const createdUser = data?.createUser;
      if (createdUser) {
        // Store token in localStorage
        localStorage.setItem("_productivity-track-token", createdUser.token);
        setUser(createdUser);
        console.log("User signed up:", createdUser);
      }
    } catch (error: unknown) {
      let errorMessage = "Unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      console.error("Error signing up user:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const { data } = await client.query({
        query: getLoginUserQuery(),
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      console.log("Full response data:", data);

      const LoginUser = data?.loginUser;
      if (LoginUser) {
        // Store token in localStorage
        localStorage.setItem("_productivity-track-token", LoginUser.token);
        setUser(LoginUser);
        console.log("User signed up:", LoginUser);
      }
    } catch (error: unknown) {
      let errorMessage = "Unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      console.error("Error signing up user:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const logout = () => {
    setUser(null);
    localStorage.removeItem("_productivity-track-token");
  };

  const loadUserFromToken = async () => {
    const token = localStorage.getItem("_productivity-track-token");
    if (token) {
      try {
        // Create a temporary client with the token for the request
        const { data } = await client.query({
          query: getMeQuery(),
          context: {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        });

        if (data?.me) {
          const userData = {
            ...data.me,
            token: token, // Add the token back to the user object
          };
          setUser(userData);
          console.log("User loaded from token:", userData);
        }
      } catch (error) {
        console.error("Failed to load user from token:", error);
        localStorage.removeItem("_productivity-track-token");
        setUser(null);
      }
    }
  };

  // Load user from localStorage on mount
  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, signUpUser, loginUser, logout, loadUserFromToken }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = () => {
  return useContext(UserContext);
};
