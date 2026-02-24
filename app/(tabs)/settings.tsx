import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { signOut, user } = useAuth();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
               <Ionicons name="person" size={40} color="#06b6d4" />
            </View>
            <View>
              <Text style={styles.email}>{user?.email}</Text>
              <Text style={styles.memberSince}>Member since Feb 2026</Text>
            </View>
          </View>

          <Pressable onPress={signOut} style={styles.signOutButton}>
            <Ionicons name="log-out-outline" size={24} color="#fb7185" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 24,
    gap: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(251, 113, 133, 0.1)',
    gap: 8,
  },
  signOutText: {
    color: '#fb7185',
    fontSize: 16,
    fontWeight: '600',
  },
});
