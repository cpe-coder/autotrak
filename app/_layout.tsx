import { AuthProvider } from "@/context/auth-context";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
	return (
		<AuthProvider>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="index" />
				<Stack.Screen name="(auth)" />
				<Stack.Screen name="(tabs)" />
			</Stack>
		</AuthProvider>
	);
}
