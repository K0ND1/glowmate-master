import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { theme } from '../theme';
import { userService, User } from '../services/userService';
import { Settings, LogOut, Crown, User as UserIcon } from 'lucide-react-native';
import { authService } from '../services/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile();
            setUser(data);
        } catch (error) {
            console.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
        });
    };

    const handlePremiumToggle = () => {
        Alert.alert('Upgrade to Premium', 'Unlock AI analysis and unlimited routines for $9.99/mo.');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <UserIcon color={theme.colors.gray[400]} size={40} />
                </View>
                <Text style={styles.name}>{user?.name || 'User'}</Text>
                <Text style={styles.email}>{user?.email || 'Loading...'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>

                <View style={styles.menuItem}>
                    <View style={styles.menuRow}>
                        <View style={[styles.iconBox, { backgroundColor: '#FFF4E5' }]}>
                            <Crown color="#FF9800" size={20} />
                        </View>
                        <Text style={styles.menuText}>Premium Membership</Text>
                    </View>
                    <TouchableOpacity onPress={handlePremiumToggle} style={styles.premiumButton}>
                        <Text style={styles.premiumButtonText}>UPGRADE</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skin Profile</Text>
                <View style={styles.infoCard}>
                    <Text style={styles.label}>Skin Type</Text>
                    <Text style={styles.value}>{user?.skin_type || 'Not set'}</Text>
                </View>
                <View style={styles.infoCard}>
                    <Text style={styles.label}>Concerns</Text>
                    <Text style={styles.value}>
                        {user?.skin_concerns?.join(', ') || 'None selected'}
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LogOut color={theme.colors.error} size={20} />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: 24,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    name: {
        ...theme.typography.h2,
        color: theme.colors.gray[900],
        marginBottom: 4,
    },
    email: {
        ...theme.typography.body,
        color: theme.colors.gray[500],
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.gray[400],
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuText: {
        fontWeight: '600',
        color: theme.colors.gray[900],
    },
    premiumButton: {
        backgroundColor: '#FF9800',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    premiumButtonText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    infoCard: {
        backgroundColor: theme.colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        color: theme.colors.gray[500],
    },
    value: {
        fontWeight: '600',
        color: theme.colors.gray[900],
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginTop: 16,
    },
    logoutText: {
        color: theme.colors.error,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    version: {
        textAlign: 'center',
        color: theme.colors.gray[400],
        marginTop: 32,
        fontSize: 12,
    },
});

export default ProfileScreen;
