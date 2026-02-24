import { TaskCard } from '@/components/ui/TaskCard';
import { TaskModal } from '@/components/ui/TaskModal';
import { useAuth } from '@/contexts/auth-context';
import { Task, subscribeToTasks } from '@/lib/tasks';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InboxScreen() {
  const { user, loading, signOut } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToTasks(user.uid, (updatedTasks) => {
        setTasks(updatedTasks);
      });
      return unsubscribe;
    }
  }, [user]);

  const sortedTasks = useMemo(() => {
    let filtered = [...tasks];
    
    if (filter === 'pending') {
      filtered = filtered.filter(t => !t.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    }

    return filtered.sort((a, b) => {
      // 1. Completed tasks at the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // 2. Priority: High(3) > Medium(2) > Low(1)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      // 3. Deadline: Closest first
      return a.deadline.getTime() - b.deadline.getTime();
    });
  }, [tasks, filter]);

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setTaskToEdit(null);
    setModalVisible(true);
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.username}>{user.email?.split('@')[0] || 'User'}</Text>
          </View>
          <Pressable onPress={signOut} style={styles.signOutButton}>
            <Ionicons name="log-out-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
          </Pressable>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{tasks.filter(t => t.completed).length}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{tasks.filter(t => !t.completed).length}</Text>
            <Text style={styles.statLabel}>Ready</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterChip,
                  filter === f && styles.filterChipActive
                ]}
              >
                <Text style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive
                ]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Your Tasks</Text>
          <Pressable onPress={openAddModal} style={styles.addButton}>
            <Ionicons name="add" size={28} color="#020617" />
          </Pressable>
        </View>

        <FlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard task={item} onEdit={openEditModal} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="rgba(255, 255, 255, 0.1)" />
              <Text style={styles.emptyText}>No tasks found. Create one!</Text>
            </View>
          }
        />

        <TaskModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          userId={user.uid}
          taskToEdit={taskToEdit}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#020617', // slate-950
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  signOutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  emptyContainer: {
    marginTop: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 16,
  },
  filterContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  filterScroll: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterChipActive: {
    backgroundColor: '#06b6d4',
    borderColor: '#06b6d4',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  filterTextActive: {
    color: '#020617',
  },
});
