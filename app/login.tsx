import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function IndexScreen() {
  const { user, loading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAuth = async (mode: 'signin' | 'signup') => {
    setAuthError('');
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
      setPassword('');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  // If already logged in, redirect to the main app (tabs)
  if (user) {
    // @ts-ignore
    return <Redirect href="/" />;
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.authScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.authContainer}>
            <View style={styles.logoContainer}>
              <View style={styles.logoGlow} />
              <Ionicons name="checkbox" size={64} color="#06b6d4" />
            </View>

            <Text style={styles.authTitle}>FocusTask</Text>
            <Text style={styles.authSubtitle}>Master your day with clarity.</Text>

            <View style={styles.authCard}>
              <GlassInput
                label="Email Address"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
              />

              <GlassInput
                label="Password"
                secureTextEntry
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
              />

              {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

              <View style={styles.authButtonRow}>
                <GlassButton
                  disabled={submitting}
                  onPress={() => handleAuth('signin')}
                  title={submitting ? "..." : "Sign In"}
                  style={styles.signInButton}
                />
                <GlassButton
                  disabled={submitting}
                  onPress={() => handleAuth('signup')}
                  title="Sign Up"
                  style={styles.signUpButton}
                  textStyle={styles.signUpButtonText}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#020617', // slate-950
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authContainer: {
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#06b6d4',
    opacity: 0.2,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
  },
  authTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  authSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 48,
  },
  authCard: {
    width: '100%',
    padding: 24,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  errorText: {
    color: '#fb7185',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  authButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  signInButton: {
    flex: 2,
    backgroundColor: '#06b6d4',
    borderWidth: 0,
  },
  signUpButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  signUpButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

