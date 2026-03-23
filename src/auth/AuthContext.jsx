import { createContext, useContext, useState } from "react";

const API = "/api";

const AuthContext = createContext();

function decodeTokenPayload(token) {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");

    return JSON.parse(atob(normalizedPayload));
  } catch {
    return null;
  }
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Server returned an invalid response.");
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const decodedToken = decodeTokenPayload(token);
  const userId = decodedToken?.id ?? null;
  const user = decodedToken ? { id: userId, ...decodedToken } : null;

  const register = async (credentials) => {
    const response = await fetch(API + "/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await parseResponse(response);
    if (!response.ok) {
      throw Error(result.message || "Registration failed.");
    }
    setToken(result.token);
    sessionStorage.setItem("token", result.token);
  };

  const login = async (credentials) => {
    const response = await fetch(API + "/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await parseResponse(response);
    if (!response.ok) {
      throw Error(result.message || "Login failed.");
    }
    setToken(result.token);
    sessionStorage.setItem("token", result.token);
  };

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("token");
  };

  const getAccountDetails = async (token) => {
    const response = await fetch(API + "/users/me", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    const result = await parseResponse(response);
    if (!response.ok) {
      throw Error(result.message || "Could not load account details.");
    }
    return result;
  };

  const value = { token, user, userId, register, login, logout, getAccountDetails };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within AuthProvider");
  return context;
}
