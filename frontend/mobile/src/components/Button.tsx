import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
    leftIcon,
}) => {
    const getBackgroundColor = () => {
        if (disabled) return theme.colors.gray[300];
        switch (variant) {
            case 'primary': return theme.colors.brand[600];
            case 'secondary': return theme.colors.brand[100];
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return theme.colors.brand[600];
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.gray[500];
        switch (variant) {
            case 'primary': return theme.colors.white;
            case 'secondary': return theme.colors.brand[700];
            case 'outline': return theme.colors.brand[600];
            case 'ghost': return theme.colors.brand[600];
            default: return theme.colors.white;
        }
    };

    const getBorderColor = () => {
        if (variant === 'outline') return theme.colors.brand[600];
        return 'transparent';
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderWidth: variant === 'outline' ? 1 : 0,
                },
                style,
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {leftIcon && leftIcon}
                    <Text style={[styles.text, { color: getTextColor(), marginLeft: leftIcon ? 8 : 0 }, textStyle]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        ...theme.typography.button,
    },
});
