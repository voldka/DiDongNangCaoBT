import { Href, Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useTailwind } from "tailwind-rn";

export default function Index() {
  const tailwind = useTailwind();
  const linkButtons: JSX.Element[] = [];
  for (let i = 1; i < 3; ++i) {
    linkButtons.push(
      <View key={`view_${i}`} style={tailwind("w-full mb-4 border-red-500")}>
        <Link href={`/bai${i}` as Href} style={tailwind("w-full p-3 text-center bg-blue-500/100 border border-red-500 rounded-lg")}>
          <Text style={tailwind("text-white/100 text-xl")}>task {i}</Text>
        </Link>
      </View>
    )
  }
  
  return (
    <ScrollView contentContainerStyle={tailwind("flex-1 justify-center items-center p-4")}>
      {linkButtons}
      <View style={tailwind("w-full mb-4 border-red-500")}>
        <Link href="/home" style={tailwind("w-full p-3 text-center bg-blue-500/100 border border-red-500 rounded-lg")}>
          <Text style={tailwind("text-white/100 text-xl")}>Task 3 || Go to Home screen</Text>
        </Link>
      </View>
      <View style={tailwind("w-full mb-4 border-red-500")}>
        <Link href="/login" style={tailwind("w-full p-3 text-center bg-blue-500/100 border border-red-500 rounded-lg")}>
          <Text style={tailwind("text-white/100 text-xl")}>Go to Login</Text>
        </Link>
      </View>
      <View style={tailwind("w-full mb-4 border-red-500")}>
        <Link href="/welcome" style={tailwind("w-full p-3 text-center bg-blue-500/100 border border-red-500 rounded-lg")}>
          <Text style={tailwind("text-white/100 text-xl")}>Go to Welcome</Text>
        </Link>
      </View>
      <View style={tailwind("w-full mb-4 border-red-500")}>
        <Link href="/profile" style={tailwind("w-full p-3 text-center bg-blue-500/100 border border-red-500 rounded-lg")}>
          <Text style={tailwind("text-white/100 text-xl")}>Go to Profile</Text>
        </Link>
      </View>
      <Link href="/about" style={tailwind("w-full p-3 text-center border border-red-500 rounded-lg")}>
        <Text style={tailwind("text-red-500/100")}>Go to About screen</Text>
      </Link>
    </ScrollView>
  );
}