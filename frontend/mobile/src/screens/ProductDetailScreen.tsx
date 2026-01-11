import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Info, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Product, productService } from "../services/productService";
import { theme } from "../theme";

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { barcode } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUnknownProduct, setIsUnknownProduct] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [barcode]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getByBarcode(barcode);
      setProduct(data);
      setIsUnknownProduct(false);
    } catch (error: any) {
      // Show mock product when not found
      setProduct({
        id: `mock-${barcode}`,
        barcode: barcode,
        name: "Unknown Product",
        brand: "Scanned Product",
        description: `This product was scanned with barcode: ${barcode}. Product details are not yet in our database.`,
        ingredients: [],
        image_url: undefined,
      });
      setIsUnknownProduct(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    Alert.alert(
      "Add Product",
      "Would you like to contribute this product's information to our database?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add Product",
          onPress: () => {
            Alert.alert(
              "Coming Soon",
              "Product contribution feature is coming soon!"
            );
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.brand[600]} />
      </View>
    );
  }

  if (!product) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>
                {product.name.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>

          {product.barcode && (
            <View style={styles.barcodeContainer}>
              <Text style={styles.barcodeLabel}>Barcode:</Text>
              <Text style={styles.barcodeValue}>{product.barcode}</Text>
            </View>
          )}

          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.bodyText}>{product.description}</Text>
            </View>
          )}

          {product.ingredients && product.ingredients.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <Info color={theme.colors.gray[400]} size={16} />
              </View>
              <View style={styles.ingredientsList}>
                {product.ingredients.map((ing, index) => (
                  <View key={index} style={styles.ingredientBadge}>
                    <Text style={styles.ingredientText}>{ing}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 16) + 16 },
        ]}
      >
        {isUnknownProduct ? (
          <TouchableOpacity
            style={styles.addProductButton}
            onPress={handleAddProduct}
          >
            <Plus color={theme.colors.white} size={20} />
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Adding to routine is coming next update!"
              )
            }
          >
            <Text style={styles.addButtonText}>Add to Routine</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  image: {
    width: "80%",
    height: "80%",
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.gray[100],
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: "bold",
    color: theme.colors.gray[400],
  },
  infoContainer: {
    padding: 24,
  },
  brand: {
    fontSize: 14,
    color: theme.colors.brand[600],
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  name: {
    ...theme.typography.h2,
    color: theme.colors.gray[900],
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.gray[900],
    marginBottom: 8,
  },
  bodyText: {
    ...theme.typography.body,
    color: theme.colors.gray[600],
    lineHeight: 22,
  },
  ingredientsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ingredientBadge: {
    backgroundColor: theme.colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ingredientText: {
    fontSize: 12,
    color: theme.colors.gray[700],
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[100],
  },
  addButton: {
    backgroundColor: theme.colors.brand[600],
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addProductButton: {
    backgroundColor: theme.colors.brand[500],
    height: 50,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  barcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  barcodeLabel: {
    fontSize: 12,
    color: theme.colors.gray[500],
    fontWeight: "500",
  },
  barcodeValue: {
    fontSize: 14,
    color: theme.colors.gray[800],
    fontWeight: "600",
    fontFamily: "monospace",
  },
});

export default ProductDetailScreen;
