import React, { ReactNode } from 'react';
import {
    StyleProp,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { TextComponent } from '.';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { globalStyles } from '../styles/globalStyles';

interface Props {
    icon?: ReactNode;
    text: string;
    type?: 'primary' | 'text' | 'link';
    color?: string;
    styles?: StyleProp<ViewStyle>;
    textColor?: string;
    textStyles?: StyleProp<TextStyle>;
    textFont?: string;
    onPress?: () => void;
    iconFlex?: 'right' | 'left';
    disable?: boolean;
}

const ButtonComponent = (props: Props) => {
    const {
        icon,
        text,
        textColor,
        textStyles,
        textFont,
        color,
        styles,
        onPress,
        iconFlex,
        type,
        disable,
    } = props;
    let bodyContent = (
        <TouchableOpacity onPress={onPress}>
            <TextComponent
                flex={0}
                text={text}
                color={type === 'link' ? appColors.primary : appColors.text}
            />
        </TouchableOpacity>
    )
    if (type !== "link") {
        bodyContent = (
            <TouchableOpacity
                disabled={disable}
                onPress={onPress}
                style={[
                    globalStyles.button,
                    globalStyles.shadow,
                    {
                        backgroundColor: color
                            ? color
                            : disable
                                ? appColors.gray4
                                : appColors.primary,
                        marginBottom: 17,
                    },
                    styles,
                ]}
            >
                {icon && iconFlex === 'left' && icon}
                <TextComponent
                    text={text}
                    color={textColor ?? appColors.white}
                    styles={[
                        textStyles,
                        {
                            marginLeft: icon ? 12 : 0,
                            fontSize: 16,
                            textAlign: 'center',
                        },
                    ]}
                    flex={icon && iconFlex === 'right' ? 1 : 0}
                    font={textFont ?? fontFamilies.medium}
                />
                {icon && iconFlex === 'right' && icon}
            </TouchableOpacity>
        )
    }
    return (
        <View style={{ alignItems: 'center' }}>
            {bodyContent}
        </View>
    );
};

export default ButtonComponent;