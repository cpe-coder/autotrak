import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

import { icons } from "@/constant/icon";

interface FormFieldProps {
	title: string;
	value: string;
	placeholder: string;
	handleChangeText: (text: string) => void;
	otherStyles: string;
	borderStyle?: string;
}

const InputField: React.FC<FormFieldProps> = ({
	title,
	value,
	placeholder,
	handleChangeText,
	otherStyles,
	borderStyle,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<View className={`space-y-2 ${otherStyles}`}>
			<Text className="text-base text-gray-100  mb-2 font-medium">{title}</Text>

			<View
				className={`w-full h-16 px-4 bg-black-100 rounded-2xl border  border-primary  focus:border-primary flex flex-row items-center ${borderStyle} `}
			>
				<TextInput
					className="flex-1 text-gray-500 font-semibold text-base"
					value={value}
					placeholder={placeholder}
					placeholderTextColor="#1a5f3a"
					onChangeText={handleChangeText}
					secureTextEntry={title === "Password" && !showPassword}
					{...props}
				/>

				{title === "Password" && (
					<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
						<Image
							source={!showPassword ? icons.eye : icons.eyeClose}
							className="w-6 h-6 text-primary"
							resizeMode="contain"
							tintColor={"#1a5f3a"}
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default InputField;
