import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService } from '../services/auth';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const SKIN_TYPES = ["normal", "dry", "oily", "combination", "sensitive"];
const SKIN_CONDITIONS_OPTIONS = ["Acne", "Rosacea", "Eczema", "Psoriasis", "Hyperpigmentation"];
const ALLERGENS_OPTIONS = ["Linalool", "Limonene", "Geraniol", "Fragrance", "Parabens", "Sulfates"];

const SelectionModal = ({ visible, onClose, data, onSelect, selectedItems, multiSelect = false, title }: any) => (
  <Modal visible={visible} transparent={true} animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={item => item}
          renderItem={({ item }) => {
            const isSelected = multiSelect
              ? selectedItems.includes(item)
              : selectedItems === item;

            return (
              <TouchableOpacity
                style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                onPress={() => onSelect(item)}
              >
                <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                  {item} {isSelected && '✓'}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        <Button title="Done" onPress={onClose} style={{ marginTop: 16 }} />
      </View>
    </View>
  </Modal>
);

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const [skinType, setSkinType] = useState<string | null>(null);
  const [skinConditions, setSkinConditions] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);

  const [modals, setModals] = useState({ skinType: false, problems: false, allergens: false });
  const [loading, setLoading] = useState(false);

  const toggleModal = (key: keyof typeof modals, value: boolean) => {
    setModals(prev => ({ ...prev, [key]: value }));
  };

  const toggleMultiSelect = (item: string, current: string[], setter: any) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !skinType) {
      Alert.alert('Missing Fields', 'Please fill in all required fields (Name, Email, Password, Skin Type).');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Note: AuthService register currently only accepts email/pass/confirm. 
      // We should probably update authService to accept profile data, or assume explicit different endpoint.
      // But for now, we'll assume the API expects the full payload. 
      // I'll update the Register component to call API directly or update logic.
      // The API Wrapper handles JSON body.
      // Wait, let's use a "registerWithProfile" or just pass extra data if the function signature allows?
      // authService.register takes distinct args. I should update authService or call api.post directly here 
      // matching the previous screen's logic.

      const payload = {
        email,
        password,
        name,
        age: parseInt(age) || 0,
        skinType,
        skinConditions,
        allergens,
      };

      // Direct API call via api service to ensure we send full payload
      const response: any = await authService.register(payload.email, payload.password, payload.password);
      // Note: The above only sends auth data if following previous signature. 
      // I should fix AuthService to support full payload or just ignore profile data for this MVP step 
      // OR stick to the previous code implementation that sent everything.
      // Looking at previous RegisterScreen.tsx, it sent everything to /v1/auth/register.

      // I should probably execute the registration with full payload.
      // Let's assume authService needs an upgrade or I bypass it for specific payload.
      // I will use `api.post` manually here for full profile or assume I updated authService.
      // BUT I can't easily edit multiple files at once and I'm editing RegisterScreen now.
      // I'll use `api.post` from services/api directly.
    } catch (error: any) {
      // Just mocking the success if failure is due to limited backend
      Alert.alert('Registration Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Refined handleRegister with direct API usage for extended profile
  const onRegister = async () => {
    if (!name || !email || !password || !skinType) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // Replicating original logic but with our API wrapper
      const payload = {
        email,
        password,
        name,
        age: parseInt(age) || 18,
        skinType,
        skinConditions,
        allergens,
      };

      // Using a direct call to ensure Profile data is sent, as authService might be simple
      // But we need to import api. 
      // Workaround: Re-importing api inside component file is fine.
      const { api } = require('../services/api');

      const response = await api.post('/auth/register', payload, false);

      if (response && (response.token || response.data?.token)) {
        const token = response.token || response.data.token;
        const { storage } = require('../services/storage');
        await storage.setToken(token);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        Alert.alert('Success', 'Account created! Please log in.');
        navigation.navigate('Login');
      }

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Tell us about your skin for personalized results.</Text>

          <View style={styles.form}>
            <Input label="Name" value={name} onChangeText={setName} placeholder="Your name" />
            <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="hello@glowmate.tech" />
            <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Create a password" />
            <Input label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Confirm password" />
            <Input label="Age" value={age} onChangeText={setAge} keyboardType="numeric" placeholder="e.g. 25" />

            {/* Selectors */}
            <TouchableOpacity onPress={() => toggleModal('skinType', true)} style={styles.selector}>
              <Text style={styles.selectorLabel}>Skin Type *</Text>
              <Text style={skinType ? styles.selectorValue : styles.selectorPlaceholder}>{skinType || 'Select Skin Type'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleModal('problems', true)} style={styles.selector}>
              <Text style={styles.selectorLabel}>Skin Conditions</Text>
              <Text style={skinConditions.length ? styles.selectorValue : styles.selectorPlaceholder}>
                {skinConditions.length ? skinConditions.join(', ') : 'Select Conditions'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleModal('allergens', true)} style={styles.selector}>
              <Text style={styles.selectorLabel}>Allergens</Text>
              <Text style={allergens.length ? styles.selectorValue : styles.selectorPlaceholder}>
                {allergens.length ? allergens.join(', ') : 'Select Allergens'}
              </Text>
            </TouchableOpacity>

            <Button title="Register" onPress={onRegister} loading={loading} style={{ marginTop: 24 }} />
          </View>

          {/* Modals */}
          <SelectionModal
            visible={modals.skinType}
            title="Select Skin Type"
            data={SKIN_TYPES}
            selectedItems={skinType}
            onSelect={(item: string) => { setSkinType(item); toggleModal('skinType', false); }}
            onClose={() => toggleModal('skinType', false)}
          />

          <SelectionModal
            visible={modals.problems}
            title="Select Skin Conditions"
            data={SKIN_CONDITIONS_OPTIONS}
            multiSelect
            selectedItems={skinConditions}
            onSelect={(item: string) => toggleMultiSelect(item, skinConditions, setSkinConditions)}
            onClose={() => toggleModal('problems', false)}
          />

          <SelectionModal
            visible={modals.allergens}
            title="Select Allergens"
            data={ALLERGENS_OPTIONS}
            multiSelect
            selectedItems={allergens}
            onSelect={(item: string) => toggleMultiSelect(item, allergens, setAllergens)}
            onClose={() => toggleModal('allergens', false)}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 50,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.gray[500],
    marginBottom: 32,
  },
  form: {
    gap: 0,
  },
  selector: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    padding: 14,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.gray[50],
  },
  selectorLabel: {
    fontSize: 12,
    color: theme.colors.gray[700],
    fontWeight: '500',
    marginBottom: 4,
  },
  selectorValue: {
    fontSize: 16,
    color: theme.colors.gray[900],
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: theme.colors.gray[400],
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  modalItemSelected: {
    backgroundColor: theme.colors.brand[50],
  },
  modalItemText: {
    fontSize: 16,
    color: theme.colors.gray[700],
  },
  modalItemTextSelected: {
    color: theme.colors.brand[600],
    fontWeight: 'bold',
  },
});

export default RegisterScreen;