import { createContext, useCallback, useEffect, useState } from "react";
import api, { backendUrl } from "../config/api";
import { assets } from "../assets/assets";

export const AppContext = createContext();

const normalizeUserData = (user) => ({
  ...user,
  image: user?.image || assets.profile_pic,
});

const AppContextprovider = (props) => {
  const currencySymbol = "\u20B9";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [doctors, setDoctors] = useState([]);
  const [userData, setUserData] = useState(null);

  const getDoctorsData = useCallback(async () => {
    try {
      const { data } = await api.get("/api/doctor/list");

      if (data.success) {
        setDoctors(data.doctors || []);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error.message);
      setDoctors([]);
    }
  }, []);

  useEffect(() => {
    getDoctorsData();
  }, [getDoctorsData]);

  const getUserProfile = useCallback(async () => {
    if (!token) {
      setUserData(null);
      return null;
    }

    const { data } = await api.get("/api/user/profile");

    if (data.success) {
      const normalizedUser = normalizeUserData(data.user);
      setUserData(normalizedUser);
      return normalizedUser;
    }

    setUserData(null);
    return null;
  }, [token]);

  useEffect(() => {
    getUserProfile().catch((error) => {
      console.error("Failed to fetch user profile:", error.message);
      setUserData(null);
    });
  }, [getUserProfile]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    const handleTokenCleared = () => setToken("");

    window.addEventListener("auth-token-cleared", handleTokenCleared);

    return () => {
      window.removeEventListener("auth-token-cleared", handleTokenCleared);
    };
  }, []);

  const value = {
    api,
    backendUrl,
    currencySymbol,
    doctors,
    getDoctorsData,
    getUserProfile,
    token,
    setToken,
    userData,
    setUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextprovider;
