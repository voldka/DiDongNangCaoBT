import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';

const HomeScreen = () => {
    const tailwind = useTailwind();
    return (
        <View style={tailwind('flex-1 justify-center items-center')}>
            <Text>HomeScreen</Text>
            <Button
                title="Logout"
                onPress={async () => {
                    await AsyncStorage.clear();
                }}
            />
        </View>
    );
};

export default HomeScreen;