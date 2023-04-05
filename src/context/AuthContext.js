import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { userLogin, userRegister } from "../service/LoginService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [patientInfo, setPatientInfo] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [bottomBarVisible, setBottomBarVisible] = useState(true);

  const login = async (name, password) => {
    setIsLoading(true);

    try {
      const res = await userLogin(name, password);
      setUserInfo(res);
      await AsyncStorage.setItem("userInfo", JSON.stringify(res));
    } catch (e) {
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);

    try {
      await userRegister(name, email, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem("userInfo");
    setUserInfo({});
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);
      let userInfo = await AsyncStorage.getItem("userInfo");
      userInfo = JSON.parse(userInfo);
      console.log("isLoggedIn");
      console.log(userInfo);
      if (userInfo) {
        setUserInfo(userInfo);
      }
      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        splashLoading,
        register,
        login,
        logout,
        bottomBarVisible,
        setBottomBarVisible,
        patientInfo,
        setPatientInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
