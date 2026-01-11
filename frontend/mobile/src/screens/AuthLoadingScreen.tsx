import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { devConfig } from "../config/dev";
import { RootStackParamList } from "../navigation/AppNavigator";
import { storage } from "../services/storage";
import { theme } from "../theme";

type AuthLoadingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AuthLoading"
>;

type Props = {
  navigation: AuthLoadingScreenNavigationProp;
};

const AuthLoadingScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const checkToken = async () => {
      // DEV MODE: Bypass authentication when API is not available
      if (devConfig.bypassAuth) {
        console.log("🔓 DEV MODE: Bypassing authentication");
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
        return;
      }

      try {
        const token = await storage.getToken();
        if (token) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "Welcome" }],
          });
        }
      } catch (e) {
        // In case of error, fallback to the welcome screen
        navigation.reset({
          index: 0,
          routes: [{ name: "Welcome" }],
        });
      }
    };

    checkToken();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.brand[600]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white,
  },
});

export default AuthLoadingScreen;
