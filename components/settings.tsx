import { icons } from "@/constant/icon";
import { useAuth } from "@/context/auth-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
	launchImageLibraryAsync,
	useMediaLibraryPermissions,
} from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import React from "react";
import {
	Image,
	Modal,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const Settings = () => {
	const [visible, setVisible] = React.useState(false);
	const { userImage, userData } = useAuth();
	const [mediaPermission, requestMediaPermission] =
		useMediaLibraryPermissions();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [refreshing, setRefreshing] = React.useState(false);
	const { onLogout } = useAuth();

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	}, []);

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
	return (
		<View className="flex">
			<TouchableOpacity
				style={{
					borderRadius: 12,
				}}
				className="flex-row items-center font-bold"
				onPress={() => setVisible((prev) => !prev)}
			>
				<View className="items-center justify-center rounded-xl bg-gray-300/30 p-2 ">
					<Image
						source={icons.Settings}
						resizeMode="contain"
						tintColor={"white"}
						className="w-6 h-6 bg"
					/>
				</View>
			</TouchableOpacity>

			<Modal
				transparent
				visible={visible}
				onRequestClose={() => setVisible(false)}
				animationType="fade"
			>
				<View className=" bg-background w-screen h-screen">
					<View className="flex p-4 flex-row gap-2 items-center justify-start">
						<Pressable onPress={() => setVisible(false)} className=" mr-5">
							<Ionicons name="arrow-back" size={24} color="white" />
						</Pressable>
						<Text className="text-text font-bold text-xl">Settings</Text>
					</View>
					<View className="flex w-full justify-center items-center pt-5">
						<Image
							source={!userImage ? icons.User : { uri: userImage.image }}
							className="w-28 h-28 border border-primary rounded-full"
						/>

						<Text className="text-text py-5 font-bold text-2xl">
							{!userData ? "AutoTrak User" : userData?.name}
						</Text>
					</View>
					<View className="py-2">
						<Pressable className="flex-row px-4 py-2 justify-start items-center gap-5 active:bg-gray-300/20 transition-all duration-300 active:transition-all active:duration-300">
							<View className="bg-secondText rounded-full p-3">
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
							<View className="bg-secondText rounded-full p-3">
								<Entypo name="camera" size={24} color="white" />
							</View>
							<Text className=" text-lg text-text">Change Profile Image</Text>
						</Pressable>
						<Pressable
							onPress={onLogout}
							className="flex-row px-4 py-2 justify-start items-center gap-5 active:bg-gray-300/20 transition-all duration-300 active:transition-all active:duration-300"
						>
							<View className="bg-secondText rounded-full p-3">
								<AntDesign name="logout" size={24} color="white" />
							</View>
							<Text className=" text-lg text-text">Sign Out Your Account</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default Settings;
