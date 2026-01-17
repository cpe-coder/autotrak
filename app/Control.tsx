import { ImageViewer } from "@/components";
import database from "@/utils/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { onValue, ref } from "firebase/database";
import React from "react";
import { Animated, Modal, Text, View } from "react-native";

export default function Control() {
	const navigation = useNavigation();
	const [isVisible, setIsVisible] = React.useState(false);
	const router = useRouter();
	const rotation = React.useRef(new Animated.Value(90)).current;
	const [ripeCount, setRipeCount] = React.useState(0);
	const [disable, setDisable] = React.useState(false);

	React.useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			try {
				ScreenOrientation.lockAsync(
					ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
				);
				setIsVisible(true);
			} catch (error) {
				console.log(error);
			}
		});

		return unsubscribe;
	}, [navigation]);

	const getRipeCount = async () => {
		const valueRef = ref(database, "detection/ripe");

		const subscribe = await onValue(valueRef, (snapshot) => {
			const value = snapshot.val();
			setRipeCount(value);
		});
		return () => subscribe();
	};

	return (
		<>
			<View className="bg-background h-screen w-screen"></View>
			<Modal visible={isVisible} animationType="fade">
				<View className="h-screen w-screen bg-slate-700">
					<ImageViewer />
				</View>
				<View className="flex-row justify-between items-end p-6 absolute z-10 w-full bottom-0">
					<Text className="text-white text-lg">Controls</Text>
				</View>
			</Modal>
		</>
	);
}
