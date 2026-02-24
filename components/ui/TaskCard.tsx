import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { deleteTask, Task, toggleTaskStatus } from '../../lib/tasks';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const handleToggle = () => {
    toggleTaskStatus(task.id, task.completed);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <Pressable onLongPress={handleDelete} onPress={() => onEdit(task)}>
      <View style={[styles.card, task.completed && styles.completedCard]}>
        <Pressable onPress={handleToggle} style={styles.checkboxContainer}>
          <View style={[
            styles.checkbox, 
            task.completed && styles.checkboxActive
          ]}>
            {task.completed && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
        </Pressable>

        <View style={styles.content}>
          <Text style={[styles.title, task.completed && styles.completedText]}>
            {task.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.categoryText}>{task.category}</Text>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.timeText}>{task.startTime || '09:00 AM'}</Text>
          </View>
        </View>

        <Pressable 
          style={styles.moreButton} 
          onPress={() => {
            Alert.alert(
              'Task Options',
              'Choose an action',
              [
                { text: 'Edit', onPress: () => onEdit(task) },
                { 
                  text: 'Delete', 
                  onPress: handleDelete, 
                  style: 'destructive' 
                },
                { text: 'Cancel', style: 'cancel' }
              ]
            );
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="rgba(255, 255, 255, 0.4)" />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
  },
  completedCard: {
    opacity: 0.6,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#3b82f6',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  bullet: {
    color: 'rgba(255, 255, 255, 0.2)',
  },
  timeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  moreButton: {
    padding: 4,
  },
});
