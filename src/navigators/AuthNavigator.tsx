import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen, OnbroadingScreen } from "../screens";

const AuthNavigator = () => {
    const Stack = createNativeStackNavigator();

    // Auth goi Login |
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="OnbroadingScreen" component={OnbroadingScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;