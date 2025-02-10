import MainNavigator from "@/src/navigators/MainNavigator";
import SplashScreen from "@/src/screens/SplashScreen";
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import AuthNavigator from "../src/navigators/AuthNavigator";

const bai2B: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  return (
    <>
      <StatusBar barStyle="dark-content" />
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </>
  );
}

export default bai2B;