import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../theme';
import { userService, SkincareRoutine, RoutineStep } from '../services/userService';
import { Sun, Moon } from 'lucide-react-native';

const RoutineScreen = () => {
    const [routine, setRoutine] = useState<SkincareRoutine | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoutine();
    }, []);

    const fetchRoutine = async () => {
        try {
            const data = await userService.getRoutine();
            setRoutine(data);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to load routine');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.brand[600]} />
            </View>
        );
    }

    const renderStep = (step: RoutineStep) => (
        <View key={step.step_number} style={styles.stepCard}>
            <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{step.step_number}</Text>
            </View>
            <View style={styles.stepContent}>
                <Text style={styles.productName}>{step.product_name}</Text>
                {step.notes && <Text style={styles.notes}>{step.notes}</Text>}
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>My Routine</Text>

            <View style={styles.sectionHeader}>
                <Sun color={theme.colors.brand[500]} size={24} />
                <Text style={styles.sectionTitle}>Morning</Text>
            </View>
            <View style={styles.sectionContent}>
                {routine?.am && routine.am.length > 0 ? (
                    routine.am.map(renderStep)
                ) : (
                    <Text style={styles.emptyText}>No morning steps added yet.</Text>
                )}
            </View>

            <View style={styles.sectionHeader}>
                <Moon color={theme.colors.brand[500]} size={24} />
                <Text style={styles.sectionTitle}>Evening</Text>
            </View>
            <View style={styles.sectionContent}>
                {routine?.pm && routine.pm.length > 0 ? (
                    routine.pm.map(renderStep)
                ) : (
                    <Text style={styles.emptyText}>No evening steps added yet.</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 24,
        paddingTop: 60,
    },
    headerTitle: {
        ...theme.typography.h1,
        color: theme.colors.gray[900],
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    sectionTitle: {
        ...theme.typography.h2,
        color: theme.colors.gray[800],
        marginLeft: 12,
    },
    sectionContent: {
        marginBottom: 32,
    },
    stepCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    stepNumberContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.brand[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    stepNumber: {
        color: theme.colors.brand[600],
        fontWeight: 'bold',
        fontSize: 16,
    },
    stepContent: {
        flex: 1,
    },
    productName: {
        ...theme.typography.body,
        fontWeight: '600',
        color: theme.colors.gray[900],
        marginBottom: 4,
    },
    notes: {
        ...theme.typography.caption,
        color: theme.colors.gray[500],
    },
    emptyText: {
        ...theme.typography.body,
        color: theme.colors.gray[400],
        fontStyle: 'italic',
        marginLeft: 4,
    },
});

export default RoutineScreen;
