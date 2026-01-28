import { icons } from "@/constant/icon";
import { useAuth } from "@/context/auth-context";
import { database } from "@/utils/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { onValue, ref, set } from "firebase/database";
import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

export default function Control() {
	const navigation = useNavigation();
	const [isVisible, setIsVisible] = React.useState(false);
	const [isConnected, setIsConnected] = React.useState(false);
	const { userData, userImage } = useAuth();

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

	React.useEffect(() => {
		getConnectedStatus();
	}, []);

	const setForwardIn = async () => {
		const valueRef = ref(database, "forward");
		console.log("Pressed In");
		await set(valueRef, true);
	};

	const setForwardOut = async () => {
		const valueRef = ref(database, "forward");
		console.log("Pressed out");
		await set(valueRef, false);
	};

	const setLeftIn = async () => {
		const valueRef = ref(database, "left");
		console.log("Pressed In");
		await set(valueRef, true);
	};

	const setLeftOut = async () => {
		const valueRef = ref(database, "left");
		console.log("Pressed In");
		await set(valueRef, false);
	};

	const setRightIn = async () => {
		const valueRef = ref(database, "right");
		console.log("Pressed In");
		await set(valueRef, true);
	};

	const setRightOut = async () => {
		const valueRef = ref(database, "right");
		console.log("Pressed In");
		await set(valueRef, false);
	};

	const getConnectedStatus = async () => {
		const valueRef = ref(database, "isConnected");

		const subscribe = await onValue(valueRef, (snapshot) => {
			const value = snapshot.val();
			setIsConnected(value);
		});
		return () => subscribe();
	};

	return (
		<>
			<View className=" h-screen w-screen"></View>
			<Modal visible={isVisible} animationType="fade">
				<View className="flex-row justify-between items-end py-10 px-20 absolute z-10 w-full top-0">
					<Text
						className={` font-bold ${isConnected ? "text-green-500" : "text-red-500"}`}
					>
						{isConnected ? "🟢 Connected" : "🔴 Not connected"}
					</Text>

					<TouchableOpacity onPress={() => router.push("/Settings")}>
						<View className="flex justify-center items-center bg-gray-200 p-1 rounded-lg flex-row gap-2">
							<View>
								<Image
									source={!userImage ? icons.User : { uri: userImage.image! }}
									className="w-10 h-10 border border-primary rounded-full"
								/>
							</View>
							<View>
								<Text className="text-left text-text font-bold">
									{!userData ? "AutoTrak User" : userData?.name}
								</Text>
								<Text className="text-left text-secondText font-semibold">
									{!userData ? "AutoTrak Email" : userData?.email}
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View>
				<View className="h-screen w-screen border">
					<WebView
						className="w-screen h-screen"
						source={{ uri: "http://192.168.43.55:81/stream" }}
					/>
				</View>
				<View className="flex-row justify-between items-end py-10 px-20 absolute z-10 w-full bottom-0">
					<View className="flex-row items-center justify-center gap-4">
						<TouchableOpacity onPressIn={setLeftIn} onPressOut={setLeftOut}>
							<View className="p-4 bg-[#1a5f3a] rounded-full">
								<Image
									source={icons.Left}
									alt="Left"
									className="w-10 h-10"
									tintColor={"#fff"}
								/>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPressIn={setRightIn} onPressOut={setRightOut}>
							<View className="p-4 bg-[#1a5f3a] rounded-full">
								<Image
									source={icons.Right}
									alt="Right"
									className="w-10 h-10"
									tintColor={"#fff"}
								/>
							</View>
						</TouchableOpacity>
					</View>
					<View>
						<TouchableOpacity
							onPressIn={setForwardIn}
							onPressOut={setForwardOut}
						>
							<View className="p-4 bg-[#1a5f3a] rounded-full">
								<Image
									source={icons.Up}
									alt="Up"
									className="w-14 h-14"
									tintColor={"#fff"}
								/>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</>
	);
}
