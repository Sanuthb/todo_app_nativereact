import { useAuth } from '@/contexts/auth-context';
import { Task, subscribeToTasks } from '@/lib/tasks';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatsScreen() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToTasks(user.uid, (updatedTasks) => {
        setTasks(updatedTasks);
      });
      return unsubscribe;
    }
  }, [user]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const priorityDist = tasks.reduce((acc: any, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    }, { low: 0, medium: 0, high: 0 });

    const categoryDist = tasks.reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    return { total, completed, pending, completionRate, priorityDist, categoryDist };
  }, [tasks]);

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your focus and progress</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Progress Ring Placeholder */}
          <View style={styles.mainScoreCard}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreValue}>{stats.completionRate}%</Text>
              <Text style={styles.scoreLabel}>Completed</Text>
            </View>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreTitle}>Productivity Score</Text>
              <Text style={styles.scoreDescription}>
                You've completed {stats.completed} out of {stats.total} tasks. Keep it up!
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.miniStatCard}>
               <Ionicons name="flash" size={20} color="#06b6d4" />
               <Text style={styles.miniStatValue}>{stats.pending}</Text>
               <Text style={styles.miniStatLabel}>Pending</Text>
            </View>
            <View style={styles.miniStatCard}>
               <Ionicons name="checkmark-done" size={20} color="#10b981" />
               <Text style={styles.miniStatValue}>{stats.completed}</Text>
               <Text style={styles.miniStatLabel}>Done</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Priority Breakdown</Text>
          <View style={styles.breakdownCard}>
            {Object.entries(stats.priorityDist).map(([priority, count]: [string, any]) => (
              <View key={priority} style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <Text style={styles.breakdownLabel}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Text>
                  <Text style={styles.breakdownValue}>{count}</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[
                    styles.progressBarFill, 
                    { 
                      width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`,
                      backgroundColor: priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#3b82f6'
                    }
                  ]} />
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryGrid}>
            {Object.entries(stats.categoryDist).map(([cat, count]: [string, any]) => (
              <View key={cat} style={styles.categoryStatCard}>
                <Text style={styles.categoryStatCount}>{count}</Text>
                <Text style={styles.categoryStatLabel}>{cat}</Text>
              </View>
            ))}
            {Object.keys(stats.categoryDist).length === 0 && (
              <Text style={styles.emptyText}>No category data available</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  mainScoreCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  scoreInfo: {
    flex: 1,
    marginLeft: 24,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  miniStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  miniStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  breakdownCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 32,
    gap: 20,
  },
  breakdownItem: {
    gap: 8,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  breakdownValue: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryStatCard: {
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  categoryStatCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryStatLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
    textAlign: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 14,
    marginTop: 8,
  },
});
