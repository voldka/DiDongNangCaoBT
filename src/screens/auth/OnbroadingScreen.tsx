import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { useTailwind } from 'tailwind-rn';
import { appColors } from '../../constants/appColors';
import { globalStyles } from '../../styles/globalStyles';
const OnboardingScreen = ({ navigation }: any) => {
    const tailwind = useTailwind();
    const [index, setIndex] = useState(0);

    return (
        <View style={[globalStyles.container]}>
            <Swiper
                loop={false}
                onIndexChanged={(num) => setIndex(num)}
                index={index}
                activeDotColor={appColors.white}
            >
                <Image
                    resizeMode='contain'
                    source={require('../../../assets/images/onboarding-1.png')}
                    style={tailwind('flex-1 w-full h-full')}
                />
                <Image
                    resizeMode='contain'
                    source={require('../../../assets/images/onboarding-2.png')}
                    style={tailwind('flex-1 w-full h-full')}
                />
                <Image
                    resizeMode='contain'
                    source={require('../../../assets/images/onboarding-2.png')}
                    style={tailwind('flex-1 w-full h-full')}
                />
            </Swiper>
            <View
                style={tailwind(
                    'absolute bottom-5 right-5 left-5 flex-row justify-between items-center px-4 py-5'
                )}            >
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.text}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() =>
                        index < 2 ? setIndex(index + 1) : navigation.navigate('LoginScreen')
                    }>
                    <Text style={[styles.text]}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    text: {
        color: appColors.white,
        fontSize: 16,
        fontWeight: '500',
    },
});  