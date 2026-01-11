import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../theme';
import { Button } from '../components/Button';

type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>✨</Text>
        </View>
        <Text style={styles.title}>Welcome to <Text style={styles.highlight}>GlowMate</Text></Text>
        <Text style={styles.subtitle}>Your AI-powered skincare companion.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Log In"
          onPress={() => navigation.navigate('Login')}
          style={styles.buttonSpacing}
        />
        <Button
          title="Sign Up"
          variant="secondary"
          onPress={() => navigation.navigate('Register')}
          style={styles.buttonSpacing}
        />
        <Button
          title="Join Waitlist"
          variant="outline"
          onPress={() => navigation.navigate('Waitlist')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.l,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoText: {
    fontSize: 60,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.gray[900],
    textAlign: 'center',
    marginBottom: theme.spacing.s,
  },
  highlight: {
    color: theme.colors.brand[600],
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.gray[500],
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: theme.spacing.xl,
  },
  buttonSpacing: {
    marginBottom: theme.spacing.m,
  },
});

export default WelcomeScreen;