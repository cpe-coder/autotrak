import { useAuth } from "@/context/auth-context";
import { Redirect, Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
	const { authState } = useAuth();
	const [isAuthenticated, setIsAthenticated] = React.useState(false);

	React.useEffect(() => {
		if (!authState?.authenticated) {
			setIsAthenticated(true);
			return;
		}
		setIsAthenticated(false);
		return;
	}, [authState]);

	if (isAuthenticated) {
		return <Redirect href={"/sign-in"} />;
	}

	return (
		<>
			<Tabs
				screenOptions={{
					headerShadowVisible: false,
					tabBarActiveTintColor: "#00ffb2",
					tabBarInactiveTintColor: "white",
					tabBarStyle: {
						backgroundColor: "#0a0f1c",
						borderTopWidth: 0,
					},
				}}
			>
				<Tabs.Screen name="Control" options={{ headerShown: false }} />
			</Tabs>
		</>
	);
}
