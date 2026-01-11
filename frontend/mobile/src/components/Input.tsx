import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity, Pressable } from 'react-native';
import { theme } from '../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    secureTextEntry,
    style,
    ...props
}) => {
    const [isSecure, setIsSecure] = useState(secureTextEntry);
    const [isFocused, setIsFocused] = useState(false);

    const toggleSecure = () => setIsSecure(!isSecure);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputContainer,
                isFocused && styles.focused,
                !!error && styles.errorBorder
            ]}>
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={theme.colors.gray[400]}
                    secureTextEntry={isSecure}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={toggleSecure} style={styles.eyeIcon}>
                        <Text style={styles.eyeText}>{isSecure ? 'Show' : 'Hide'}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        ...theme.typography.caption,
        color: theme.colors.gray[700],
        marginBottom: 6,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray[50], // Match web: bg-gray-50
        borderWidth: 1,
        borderColor: theme.colors.gray[200],
        borderRadius: theme.borderRadius.m,
        paddingHorizontal: 12,
    },
    focused: {
        borderColor: theme.colors.brand[500],
        backgroundColor: theme.colors.white,
    },
    errorBorder: {
        borderColor: theme.colors.error,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        color: theme.colors.gray[900],
        fontSize: 16,
    },
    eyeIcon: {
        padding: 8,
    },
    eyeText: {
        fontSize: 12,
        color: theme.colors.gray[500],
    },
    errorText: {
        ...theme.typography.caption,
        color: theme.colors.error,
        marginTop: 4,
    },
});
