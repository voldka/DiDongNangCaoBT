import { Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import { useTailwind } from "tailwind-rn";

const Bai1a: React.FC = () => {
    const tailwind = useTailwind();
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState<number>(10);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (timeLeft <= 0) {
                clearTimeout(timer);
                router.replace('/' as Href);
            } else {
                setTimeLeft(pre => pre -= 1)
            }

        }, 1_000);

        return () => clearTimeout(timer); // Clean up the timer
    }, [timeLeft]);
    return (
        <SafeAreaView style={tailwind('h-full')}>
            <Text style={tailwind('inline border-2 border-red-500/100')}> sẽ chuyển trang sau {timeLeft} giây</Text>
            <Button title='đặt lại 10 giây' onPress={() => setTimeLeft(10)}></Button>
            <View style={tailwind('py-3')}>

                <Text>Tên tôi là: Lê Minh Tài </Text>
                <Text>Tôi là sinh viên trường HCMUTE</Text>
            </View>
        </SafeAreaView>
    )
};

export default Bai1a