import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Clipboard, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { waitlistService } from '../services/waitlist';

type WaitlistScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Waitlist'>;

type Props = {
    navigation: WaitlistScreenNavigationProp;
};

const BenefitsItem = ({ text }: { text: string }) => (
    <View style={styles.benefitItem}>
        <View style={styles.checkContainer}>
            <Text style={styles.checkText}>✓</Text>
        </View>
        <Text style={styles.benefitText}>{text}</Text>
    </View>
);

const WaitlistScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [referralData, setReferralData] = useState<{ position: number; referralCode: string; points: number } | null>(null);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async () => {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setLoading(true);
        setStatus('idle');
        try {
            const response = await waitlistService.joinWaitlist(email);
            setReferralData(response.data);
            setStatus('success');
            setEmail('');
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            Alert.alert('Error', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!referralData) return;
        const link = `https://glowmate.tech/join?ref=${referralData.referralCode}`;
        Clipboard.setString(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (status === 'success' && referralData) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.successCard}>
                        <View style={styles.emojiContainer}>
                            <Text style={styles.emoji}>🎉</Text>
                        </View>
                        <Text style={styles.h2}>You're on the list!</Text>

                        <View style={styles.positionCard}>
                            <Text style={styles.positionLabel}>CURRENT POSITION</Text>
                            <Text style={styles.positionNumber}>#{referralData.position}</Text>
                            <Text style={styles.positionSub}>people ahead of you</Text>
                        </View>

                        <Text style={styles.shareTitle}>Invite friends & get early access</Text>
                        <Text style={styles.shareDesc}>
                            Earn <Text style={{ color: theme.colors.success, fontWeight: 'bold' }}>{referralData.points || 10} points</Text> for every friend who joins.
                        </Text>

                        <View style={styles.linkContainer}>
                            <Text style={styles.linkText} numberOfLines={1}>
                                glowmate.tech/join?ref={referralData.referralCode}
                            </Text>
                            <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                                <Text style={styles.copyButtonText}>{copied ? 'Copied!' : 'Copy'}</Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            title="Register another email"
                            variant="ghost"
                            onPress={() => { setStatus('idle'); setReferralData(null); }}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.heroSection}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoEmoji}>✨</Text>
                    </View>
                    <Text style={styles.h1}>
                        Join the <Text style={{ color: theme.colors.brand[600] }}>GlowMate</Text> Waitlist
                    </Text>
                    <Text style={styles.description}>
                        Be the first to experience personalized skincare routines powered by AI.
                    </Text>

                    <View style={styles.benefits}>
                        <BenefitsItem text="Early access to features" />
                        <BenefitsItem text="Exclusive community access" />
                        <BenefitsItem text="Priority support" />
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.h2}>Get Early Access</Text>
                    <Input
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        containerStyle={{ marginBottom: 16 }}
                    />
                    <Button
                        title="Join Waitlist"
                        onPress={handleSubmit}
                        loading={loading}
                    />
                    <Text style={styles.disclaimer}>
                        By joining, you agree to our Terms and Privacy Policy.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: theme.colors.gray[600],
        fontSize: 16,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    heroSection: {
        marginBottom: 40,
    },
    logoContainer: {
        width: 64,
        height: 64,
        backgroundColor: theme.colors.brand[600],
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: theme.colors.brand[200],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
    },
    logoEmoji: {
        fontSize: 32,
    },
    h1: {
        ...theme.typography.h1,
        color: theme.colors.gray[900],
        marginBottom: 16,
    },
    h2: {
        ...theme.typography.h2,
        color: theme.colors.gray[900],
        marginBottom: 24,
    },
    description: {
        ...theme.typography.body,
        color: theme.colors.gray[600],
        marginBottom: 32,
    },
    benefits: {
        gap: 16,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.success + '20', // 20% opacity
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkText: {
        color: theme.colors.success,
        fontSize: 12,
        fontWeight: 'bold',
    },
    benefitText: {
        color: theme.colors.gray[700],
        fontSize: 16,
    },
    formSection: {
        marginTop: 20,
    },
    disclaimer: {
        ...theme.typography.caption,
        color: theme.colors.gray[500],
        textAlign: 'center',
        marginTop: 24,
    },
    // Success state styles
    successCard: {
        alignItems: 'center',
        paddingTop: 40,
    },
    emojiContainer: {
        width: 80,
        height: 80,
        backgroundColor: theme.colors.success + '20',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emoji: {
        fontSize: 40,
    },
    positionCard: {
        backgroundColor: theme.colors.brand[50],
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        width: '100%',
        marginBottom: 32,
    },
    positionLabel: {
        color: theme.colors.brand[600],
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 8,
    },
    positionNumber: {
        fontSize: 48,
        fontWeight: '900',
        color: theme.colors.brand[600],
    },
    positionSub: {
        color: theme.colors.brand[500],
        fontSize: 14,
    },
    shareTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.gray[900],
        marginBottom: 8,
    },
    shareDesc: {
        textAlign: 'center',
        color: theme.colors.gray[600],
        marginBottom: 24,
    },
    linkContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.gray[50],
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.gray[200],
        padding: 4,
        alignItems: 'center',
        width: '100%',
        marginBottom: 24,
    },
    linkText: {
        flex: 1,
        paddingHorizontal: 12,
        color: theme.colors.gray[600],
        fontSize: 14,
    },
    copyButton: {
        backgroundColor: theme.colors.brand[600],
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 6,
    },
    copyButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default WaitlistScreen;
