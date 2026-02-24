import { TaskCard } from '@/components/ui/TaskCard';
import { TaskModal } from '@/components/ui/TaskModal';
import { useAuth } from '@/contexts/auth-context';
import { groupTasksByDate, subscribeToTasks, Task } from '@/lib/tasks';
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

export default function ScheduleScreen() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToTasks(user.uid, (updatedTasks) => {
        setTasks(updatedTasks);
      });
      return unsubscribe;
    }
  }, [user]);

  const groupedTasks = useMemo(() => groupTasksByDate(tasks), [tasks]);

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Schedule</Text>
          <Text style={styles.subtitle}>Your timeline for today & beyond</Text>
        </View>
        
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {Object.keys(groupedTasks).length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="rgba(255, 255, 255, 0.1)" />
              <Text style={styles.emptyText}>No tasks scheduled yet</Text>
            </View>
          ) : (
            Object.entries(groupedTasks).map(([date, dateTasks]) => (
              <View key={date} style={styles.dateGroup}>
                <View style={styles.dateHeader}>
                  <View style={styles.dateDot} />
                  <Text style={styles.dateLabel}>{date}</Text>
                </View>
                <View style={styles.timeline}>
                  <View style={styles.timelineLine} />
                  <View style={styles.tasksContainer}>
                    {dateTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onEdit={openEditModal} />
                    ))}
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

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
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  dateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06b6d4',
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  timeline: {
    flexDirection: 'row',
    marginLeft: 3,
  },
  timelineLine: {
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 20,
  },
  tasksContainer: {
    flex: 1,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 18,
  },
});
