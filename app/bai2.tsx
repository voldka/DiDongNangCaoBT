import MainNavigator from "@/src/navigators/MainNavigator";
import SplashScreen from "@/src/screens/SplashScreen";
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import AuthNavigator from "../src/navigators/AuthNavigator";

const Bai2: React.FC = () => {
    // sử dụng useState để lưu thời gian 1.5 giây
    const [isShowSplash, setIsShowSplash] = useState(true);

    // muốn lưu liền thì dùng store redux toolkit
    const [_accessToken, setAccessToken] = useState('');

    // kiểm tra đăng nhập
    const { getItem, setItem } = useAsyncStorage('assetToken');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsShowSplash(false);
        }, 1500);

        return () => clearTimeout(timeout);
    }, []);

    // chạy 01 lần thì dùng useEffect không tham số []
    useEffect(() => {
        checkLogin();
    }, []);

    // Khu vực các hàm
    const checkLogin = async () => {
        const token = await getItem();
        console.log(token);
        // check token
        token && setAccessToken(token);
    };
    const NavigatorElement: JSX.Element = _accessToken ? <MainNavigator /> : <AuthNavigator />;
    // Dùng dấu ! để phủ định điều kiện
    // Background nằm dưới thanh StatusBar
    return (
        <React.Fragment>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            {isShowSplash ? (
                <SplashScreen />
            ) :
                NavigatorElement
            }
        </React.Fragment>
    );
}

export default Bai2;