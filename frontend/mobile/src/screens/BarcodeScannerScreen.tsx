import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { ArrowLeft, Zap, ZapOff } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScanFrame from "../components/ScanFrame";
import { RootStackParamList } from "../navigation/AppNavigator";
import { theme } from "../theme";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const FRAME_WIDTH = SCREEN_WIDTH * 0.65;
const FRAME_HEIGHT = FRAME_WIDTH * (290 / 237); // Maintain SVG aspect ratio

const BarcodeScannerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    requestPermission();
  }, []);

  const onBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      // Prevent multiple scans
      if (hasScannedRef.current || !isScanning) return;

      const { data } = result;
      if (data) {
        hasScannedRef.current = true;
        setIsScanning(false);
        console.log(`Scanned code: ${data}`);
        // Navigate to Detail, replacing Scanner so back button goes to List
        navigation.replace("ProductDetail", { barcode: data });
      }
    },
    [navigation, isScanning]
  );

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan products.
        </Text>
        <TouchableOpacity
          onPress={Linking.openSettings}
          style={styles.settingsButton}
        >
          <Text style={styles.settingsButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={flashEnabled}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
        onBarcodeScanned={isScanning ? onBarcodeScanned : undefined}
      />

      {/* Full overlay */}
      <View style={styles.overlay}>
        {/* Header with back and flash buttons */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft color={theme.colors.white} size={24} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleFlash}
            activeOpacity={0.7}
          >
            {flashEnabled ? (
              <Zap color={theme.colors.white} size={24} />
            ) : (
              <ZapOff color={theme.colors.white} size={24} />
            )}
          </TouchableOpacity>
        </View>

        {/* Center scan frame area */}
        <View style={styles.frameContainer}>
          <ScanFrame width={FRAME_WIDTH} height={FRAME_HEIGHT} color="white" />
        </View>

        {/* Bottom area with instruction */}
        <View
          style={[styles.bottomArea, { paddingBottom: insets.bottom + 40 }]}
        >
          <View style={styles.instructionPill}>
            <Text style={styles.instructionText}>Align barcode</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  settingsButton: {
    backgroundColor: theme.colors.brand[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  settingsButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  frameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomArea: {
    alignItems: "center",
  },
  instructionPill: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  instructionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default BarcodeScannerScreen;
