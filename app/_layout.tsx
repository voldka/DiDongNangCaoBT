import { Stack } from "expo-router";
import { TailwindProvider } from "tailwind-rn";
import utilities from '../tailwind.json';
export default function RootLayout() {
  return (
    <TailwindProvider utilities={utilities}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </TailwindProvider>
  );
}
