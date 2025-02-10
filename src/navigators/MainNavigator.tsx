import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";

const MainNavigator = () => {
    const Stack = createNativeStackNavigator();

    // Main go! Tab
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
    );
};

export default MainNavigator;