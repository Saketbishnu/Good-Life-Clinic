import { createContext, useCallback, useEffect, useState } from "react";
import api, { backendUrl } from "../config/api";

export const AppContext = createContext();

const AppContextprovider = (props) => {
  const currencySymbol = "\u20B9";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [doctors, setDoctors] = useState([]);

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
    token,
    setToken,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextprovider;
