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
					tabBarShowLabel: false,
					tabBarStyle: { height: 0 },
				}}
			>
				<Tabs.Screen
					name="Control"
					options={{ headerShown: false, tabBarIconStyle: { display: "none" } }}
				/>
				<Tabs.Screen
					name="Settings"
					options={{
						headerShown: false,
						tabBarShowLabel: false,
						tabBarIconStyle: { display: "none" },
					}}
				/>
			</Tabs>
		</>
	);
}
