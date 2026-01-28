import { icons } from "@/constant/icon";
import { useAuth } from "@/context/auth-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import {
	launchImageLibraryAsync,
	useMediaLibraryPermissions,
} from "expo-image-picker";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const Settings = () => {
	const [visible, setVisible] = React.useState(false);
	const { userImage, userData } = useAuth();
	const [mediaPermission, requestMediaPermission] =
		useMediaLibraryPermissions();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [refreshing, setRefreshing] = React.useState(false);
	const { onLogout } = useAuth();
	const navigation = useNavigation();
	const [isVisible, setIsVisible] = React.useState(false);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	}, []);

	React.useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			try {
				ScreenOrientation.lockAsync(
					ScreenOrientation.OrientationLock.PORTRAIT_UP,
				);
				setIsVisible(true);
			} catch (error) {
				console.log(error);
			}
		});

		return unsubscribe;
	}, [navigation]);

	const chooseFromLibrary = async () => {
		if (!mediaPermission?.granted) {
			requestMediaPermission();
		} else {
			let result = await launchImageLibraryAsync({
				mediaTypes: "livePhotos",
				allowsEditing: true,
				aspect: [5, 5],
			});
			await SecureStore.deleteItemAsync("image");
			if (!result.canceled) {
				await SecureStore.setItemAsync("image", result.assets[0].uri);
			}
			onRefresh();
		}
	};

	const handleRoute = () => {
		return router.push("/Control");
	};
	return (
		<View className="flex">
			<View className="mt-12">
				<View className=" bg-secondary w-screen h-screen">
					<View className="flex p-4 flex-row gap-2 items-center justify-start">
						<Pressable onPress={handleRoute} className=" mr-5">
							<Ionicons name="arrow-back" size={24} color="gray" />
						</Pressable>
						<Text className="text-text font-bold text-xl">Settings</Text>
					</View>
					<View className="flex w-full justify-center items-center pt-5">
						<Image
							source={!userImage ? icons.User : { uri: userImage.image! }}
							className="w-28 h-28 border border-primary rounded-full"
						/>

						<Text className="text-primary py-5 font-bold text-2xl">
							{!userData ? "AutoTrak User" : userData?.name}
						</Text>
					</View>
					<View className="py-2">
						<Pressable className="flex-row px-4 py-2 justify-start items-center gap-5 active:bg-gray-300/20 transition-all duration-300 active:transition-all active:duration-300">
							<View className="bg-red-500 border-0 rounded-full p-3">
								<MaterialIcons name="alternate-email" size={24} color="white" />
							</View>
							<View>
								<Text className=" text-lg text-text">Email Account</Text>
								<Text className="text-secondText text-xs">
									{userData?.email}
								</Text>
							</View>
						</Pressable>
						<Pressable
							onPress={() => chooseFromLibrary()}
							className="flex-row px-4 py-2 justify-start items-center gap-5 active:bg-gray-300/20 transition-all duration-300 active:transition-all active:duration-300"
						>
							<View className="bg-gray-500 border-0 rounded-full p-3">
								<Entypo name="camera" size={24} color="white" />
							</View>
							<Text className=" text-lg text-text">Change Profile Image</Text>
						</Pressable>
						<Pressable
							onPress={onLogout}
							className="flex-row px-4 py-2 justify-start items-center gap-5 active:bg-gray-300/20 transition-all duration-300 active:transition-all active:duration-300"
						>
							<View className="bg-gray-500 border-0 rounded-full p-3">
								<AntDesign name="logout" size={24} color="white" />
							</View>
							<Text className=" text-lg text-text">Sign Out Your Account</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</View>
	);
};

export default Settings;
