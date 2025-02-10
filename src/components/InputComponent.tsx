import React, { ReactNode, useState } from 'react';
import { KeyboardType, TextInput, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTailwind } from 'tailwind-rn';
import { appColors } from '../constants/appColors';

interface Props {
  value: string;
  onChange: (val: string) => void;
  affix?: ReactNode;
  suffix?: ReactNode;
  placeholder?: string;
  isPassword?: boolean;
  allowClear?: boolean;
  type?: KeyboardType;
  onEnd?: () => void;
}

const InputComponent = ({
  value,
  onChange,
  affix,
  suffix,
  placeholder,
  isPassword = false,
  allowClear = false,
  type = 'default',
  onEnd,
}: Props) => {
  const [isShowPass, setIsShowPass] = useState(isPassword);
  const tailwind = useTailwind();

  return (
    <View style={tailwind('flex-row items-center bg-white rounded-xl border border-gray-300 w-full min-h-14 px-4 mb-5')}>
      {affix}
      <TextInput
        style={tailwind('flex-1 p-0 m-0 text-gray-800')}
        value={value}
        placeholder={placeholder}
        onChangeText={onChange}
        secureTextEntry={isShowPass}
        placeholderTextColor="#747688"
        keyboardType={type}
        autoCapitalize="none"
        onEndEditing={onEnd}
      />
      {suffix}
      <TouchableOpacity onPress={() => isPassword ? setIsShowPass(!isShowPass) : onChange('')}>
        {isPassword ? (
          <FontAwesome name={isShowPass ? 'eye-slash' : 'eye'} size={22} color={appColors.gray} />
        ) : (
          value.length > 0 && allowClear && <AntDesign name="close" size={22} color={appColors.text} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default InputComponent;
