import { createContext, useContext, useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Get user info from Google
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${response.access_token}` },
          }
        );

        // Check if user exists in our database
        const checkUserResponse = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/user/check-user`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ googleId: userInfo.data.sub }),
          }
        );
        const checkUserData = await checkUserResponse.json();

        if (!checkUserData.exists) {
          // Register new user

          const registerResponse = await fetch(
            `${import.meta.env.VITE_SERVER_URI}/api/user/register`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                googleId: userInfo.data.sub,
                email: userInfo.data.email,
                username: userInfo.data.email.split("@")[0],
                picture: userInfo.data.picture,
              }),
            }
          );
          const userData = await registerResponse.json();
          setUser(userData);
        } else {
          setUser(checkUserData.user);
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    },
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
