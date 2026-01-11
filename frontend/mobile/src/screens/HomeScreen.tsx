import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { userService, User } from '../services/userService';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Sun, Moon, Calendar, Sparkles } from 'lucide-react-native';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await userService.getProfile();
        setUser(profile);
      } catch (e) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.brand[600]} />
      </View>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user?.name || 'Beautiful'}!</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile' as any)} style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Sparkles color="#FFD700" size={20} />
          <Text style={styles.cardTitle}>Daily Tip</Text>
        </View>
        <Text style={styles.cardText}>
          Hydration is key! Drink at least 8 glasses of water today for glowing skin.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Routine</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Main', { screen: 'Routine' } as any)}
        >
          <View style={styles.actionIcon}>
            <Sun color={theme.colors.brand[600]} size={24} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Morning Routine</Text>
            <Text style={styles.actionSubtitle}>4 steps remaining</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Main', { screen: 'Routine' } as any)}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#E0E7FF' }]}>
            <Moon color="#4338CA" size={24} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Evening Routine</Text>
            <Text style={styles.actionSubtitle}>Start your wind down</Text>
          </View>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.gray[500],
    fontWeight: 'normal',
  },
  userName: {
    ...theme.typography.h1,
    color: theme.colors.gray[900],
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.brand[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...theme.typography.h3,
    color: theme.colors.brand[600],
  },
  card: {
    backgroundColor: theme.colors.brand[600],
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.gray[900],
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.brand[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.gray[900],
  },
  actionSubtitle: {
    fontSize: 12,
    color: theme.colors.gray[500],
    marginTop: 2,
  },
});

export default HomeScreen;