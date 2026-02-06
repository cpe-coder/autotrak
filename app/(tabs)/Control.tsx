import { icons } from "@/constant/icon";
import { useAuth } from "@/context/auth-context";
import { database } from "@/utils/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { onValue, ref, set } from "firebase/database";
import React from "react";
import {
	Image,
	Modal,
	PanResponder,
	Pressable,
	Text,
	TouchableOpacity,
	View,
	ViewProps,
} from "react-native";
import { WebView } from "react-native-webview";

const SLIDER_HEIGHT = 100;
const MIN_VALUE = 0;
const MAX_VALUE = 180;

function Trootle(props: {
	power:
		| string
		| number
		| bigint
		| boolean
		| React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
		| Iterable<React.ReactNode>
		| React.ReactPortal
		| Promise<
				| string
				| number
				| bigint
				| boolean
				| React.ReactPortal
				| React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
				| Iterable<React.ReactNode>
				| null
				| undefined
		  >
		| null
		| undefined;
	panHandlers: React.JSX.IntrinsicAttributes &
		React.JSX.IntrinsicClassAttributes<View> &
		Readonly<ViewProps>;
	position: number;
}) {
	return (
		<View className="bg-background/70 items-center justify-center py-2 px-0 rounded-lg mx-6">
			<Text className="text-lg text-primary font-semibold mb-2">
				{props.power}
			</Text>

			<View className="relative items-center justify-center h-[150px] w-16 bg-primary rounded-lg overflow-hidden">
				<View
					className="absolute w-6 rounded-md h-[100px] my-4"
					{...props.panHandlers}
				>
					<View
						className="absolute w-12 h-8 bg-secondary rounded-md -left-3"
						style={{
							bottom: props.position - 10,
						}}
					/>
				</View>
			</View>
		</View>
	);
}

export default function Control() {
	const navigation = useNavigation();
	const [isVisible, setIsVisible] = React.useState(false);
	const [isConnected, setIsConnected] = React.useState(false);
	const { userData, userImage } = useAuth();
	const [power, setPower] = React.useState(MIN_VALUE);
	const [position, setPosition] = React.useState(SLIDER_HEIGHT / 100);
	const [suyodValueUp, setSuyodValueUp] = React.useState(false);
	const [suyodValueDown, setSuyodValueDown] = React.useState(false);

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
		setActivePower();
		getConnectedStatus();
	});

	const setActivePower = async () => {
		try {
			const valueRef = ref(database, "forward");
			await set(valueRef, power);
		} catch (error) {
			console.log("Error setting power value:", error);
		}
	};

	const setLeftIn = async () => {
		const valueRef = ref(database, "left");
		await set(valueRef, true);
	};

	const setLeftOut = async () => {
		const valueRef = ref(database, "left");
		await set(valueRef, false);
	};

	const setRightIn = async () => {
		const valueRef = ref(database, "right");
		await set(valueRef, true);
	};

	const setRightOut = async () => {
		const valueRef = ref(database, "right");
		await set(valueRef, false);
	};
	const setSuyodDown = async () => {
		const valueRef = ref(database, "suyodDown");
		setSuyodValueDown((prev) => !prev);
		await set(valueRef, !suyodValueDown);
	};
	const setSuyodUp = async () => {
		const valueRef = ref(database, "suyodUp");
		setSuyodValueUp((prev) => !prev);
		await set(valueRef, !suyodValueUp);
	};

	const getConnectedStatus = async () => {
		const valueRef = ref(database, "isConnected");

		const subscribe = await onValue(valueRef, (snapshot) => {
			const value = snapshot.val();
			setIsConnected(value);
		});
		return () => subscribe();
	};

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: () => true,
		onPanResponderMove: (_, gestureState) => {
			let newY = position + gestureState.dy * -1;
			newY = Math.max(0, Math.min(SLIDER_HEIGHT, newY));
			setPosition(newY);

			const newValue = Math.round(
				MIN_VALUE + (newY / SLIDER_HEIGHT) * (MAX_VALUE - MIN_VALUE),
			);
			setPower(newValue);
		},
		onPanResponderGrant: () => {},
		onPanResponderRelease: () => {},
	});

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
					<View className="flex-row items-center justify-center gap-4">
						<Pressable
							disabled={suyodValueUp}
							onPress={setSuyodDown}
							className={` p-4 rounded-full ${suyodValueDown ? "bg-green-500" : "bg-red-500"} ${suyodValueUp ? "opacity-50" : ""}`}
						>
							<Image
								source={icons.Down}
								resizeMode="contain"
								tintColor={"#fff"}
								className="w-8 h-8"
							/>
						</Pressable>
						<Pressable
							disabled={suyodValueDown}
							onPress={setSuyodUp}
							className={` p-4 rounded-full ${suyodValueUp ? "bg-green-500" : "bg-red-500"} ${suyodValueDown ? "opacity-50" : ""}`}
						>
							<Image
								source={icons.Up}
								resizeMode="contain"
								tintColor={"#fff"}
								className="w-8 h-8"
							/>
						</Pressable>
					</View>
					<Trootle
						power={power}
						position={position}
						panHandlers={panResponder.panHandlers}
					></Trootle>
				</View>
			</Modal>
		</>
	);
}
