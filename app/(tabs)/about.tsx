import { Text, View } from "react-native";
import { useTailwind } from "tailwind-rn";

export default function AboutScreen() {
    const tailwind = useTailwind();
    return (
      <View style={tailwind("bg-green-200/100")}>
        <Text style={tailwind("text-bold")}>About screen</Text>
      </View>
    );
  }