import MainNavigator from "@/src/navigators/MainNavigator";
import SplashScreen from "@/src/screens/SplashScreen";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StatusBar, View, Text } from "react-native";
import AuthNavigator from "../src/navigators/AuthNavigator";

const Bai2: React.FC = () => {
  return (
    <React.Fragment>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Hello, world!</Text>
      </View>
    </React.Fragment>
  );
};

export default Bai2;
