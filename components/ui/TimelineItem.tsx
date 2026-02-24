import { Task } from '@/lib/tasks';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TimelineItemProps {
  time: string;
  tasks: Task[];
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ time, tasks }) => {
  return (
    <View style={styles.container}>
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.dividerColumn}>
        <View style={styles.dot} />
        <View style={styles.line} />
      </View>
      <View style={styles.tasksColumn}>
        {tasks.map((task) => (
          <View key={task.id} style={[
            styles.taskCard,
            { backgroundColor: task.category === 'Work' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)' }
          ]}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskCategory}>{task.category}</Text>
          </View>
        ))}
        {tasks.length === 0 && <View style={styles.spacer} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 80,
  },
  timeColumn: {
    width: 60,
    alignItems: 'flex-end',
    paddingTop: 4,
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dividerColumn: {
    width: 40,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginTop: 8,
    zIndex: 1,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tasksColumn: {
    flex: 1,
    paddingBottom: 20,
  },
  taskCard: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  taskTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  taskCategory: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    marginTop: 2,
  },
  spacer: {
    height: 60,
  },
});
