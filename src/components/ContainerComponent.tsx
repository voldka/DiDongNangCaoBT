import { useNavigation } from '@react-navigation/native';
import React, { ReactNode } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you're using Material Icons
import { useTailwind } from 'tailwind-rn';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { globalStyles } from '../styles/globalStyles';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';

interface Props {
  isImageBackground?: boolean;
  isScroll?: boolean;
  title?: string;
  children: ReactNode;
  back?: boolean;
}

const ContainerComponent = (props: Props) => {
  const { children, isScroll, isImageBackground, title, back } = props;
  const navigation = useNavigation();
  const tailwind = useTailwind();
  const headerComponent = () => (
    <View style={tailwind("flex-1 pt-7")}>
      {(title || back) && (
        <RowComponent
          styles={tailwind("px-4 py-2 min-w-12 min-h-12 justify-start")} >
          {back && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tailwind("mr-4")}>
              <Icon name="arrow-back" size={24} color={appColors.text} />
            </TouchableOpacity>
          )}
          {title && (
            <TextComponent
              text={title}
              size={16}
              font={fontFamilies.medium}
              flex={1}
            />
          )}

        </RowComponent>
      )}
      {returnContainer}
    </View>
  );

  const returnContainer = isScroll ? (
    <ScrollView style={tailwind("flex-1")} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={tailwind("flex-1")}>{children}</View>
  );

  return isImageBackground ? (
    <ImageBackground
      source={require('../../assets/images/splash-img.png')}
      style={tailwind("flex-1")}
      imageStyle={tailwind("flex-1")}
    >
      <SafeAreaView style={tailwind("flex-1")}>{headerComponent()}</SafeAreaView>
    </ImageBackground>
  ) : (
    <SafeAreaView style={[globalStyles.container]}>
      <View>{headerComponent()}</View>
    </SafeAreaView>
  );
};

export default ContainerComponent;