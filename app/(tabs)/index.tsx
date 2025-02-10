import { Href, Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useTailwind } from "tailwind-rn";

export default function Index() {
  const tailwind = useTailwind();
  const linkButtons: JSX.Element[] = [];
  for (let i = 1; i < 5; ++i) {
    linkButtons.push(
      <View key={`view_${i}`} style={tailwind("w-full mb-4 border-red-500")}>
        <Link href={`/bai${i}` as Href} style={tailwind("w-full p-3 text-center bg-blue-500/100 border border-red-500 rounded-lg")}>
          <Text style={tailwind("text-white/100 text-xl")}>Bài {i}</Text>
        </Link>
      </View>
    )
  }
  return (
    <ScrollView contentContainerStyle={tailwind("flex-1 justify-center items-center p-4")}>
      {linkButtons}
      <Link href="/about" style={tailwind("w-full p-3 text-center border border-red-500 rounded-lg")}>
        <Text style={tailwind("text-red-500/100")}>Go to About screen</Text>
      </Link>
    </ScrollView>
  );
}