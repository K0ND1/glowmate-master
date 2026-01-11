import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { Calendar, Home, Scan, Search, User } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WaitlistScreen from "../screens/WaitlistScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

import BarcodeScannerScreen from "../screens/BarcodeScannerScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import ProductListScreen from "../screens/ProductListScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RoutineScreen from "../screens/RoutineScreen";
import WriteReviewScreen from "../screens/WriteReviewScreen";
import { theme } from "../theme";

export type RootStackParamList = {
  AuthLoading: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Waitlist: undefined;
  Main: undefined;
  ProductDetail: { barcode: string };
  BarcodeScanner: undefined;
  WriteReview: { barcode: string };
};

export type MainTabParamList = {
  Home: undefined;
  Products: undefined;
  Scan: undefined;
  Routine: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom Scan Button Component
const ScanTabButton = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate("BarcodeScanner");
  };

  return (
    <TouchableOpacity
      style={tabStyles.scanButtonContainer}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={tabStyles.scanButtonInner}>
        <Scan color="#fff" size={24} />
      </View>
      <Text style={tabStyles.scanLabel}>Scan</Text>
    </TouchableOpacity>
  );
};

// Placeholder component for the Scan tab (won't actually render)
const ScanPlaceholder = () => null;

const tabStyles = StyleSheet.create({
  scanButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 4,
  },
  scanButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.brand[500],
    justifyContent: "center",
    alignItems: "center",
    marginTop: -28,
    shadowColor: theme.colors.brand[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  scanLabel: {
    fontSize: 10,
    color: theme.colors.brand[500],
    marginTop: 2,
    fontWeight: "500",
  },
});

const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand[500],
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          borderTopColor: "transparent",
          height: 52 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          title: "Dashboard",
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductListScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          title: "Products",
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanPlaceholder}
        options={{
          tabBarButton: () => <ScanTabButton />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tab.Screen
        name="Routine"
        component={RoutineScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Calendar color={color} size={size} />
          ),
          title: "Routine",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AuthLoading"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: true,
          title: "Create Account",
        }}
      />
      <Stack.Screen
        name="Waitlist"
        component={WaitlistScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: true, title: "Product Details" }}
      />
      <Stack.Screen
        name="BarcodeScanner"
        component={BarcodeScannerScreen}
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="WriteReview"
        component={WriteReviewScreen}
        options={{ headerShown: true, title: "Write Review" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
