import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Category, NewTask, Priority, Task, addTask, updateTask } from '../../lib/tasks';
import { GlassInput } from './GlassInput';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  taskToEdit?: Task | null;
}

const CATEGORIES: Category[] = ['Work', 'Personal', 'Shopping', 'Health'];
const TIMES = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

export const TaskModal = ({ visible, onClose, userId, taskToEdit }: TaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('Personal');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [dateString, setDateString] = useState(new Date().toLocaleDateString());
  const [deadline, setDeadline] = useState(new Date());

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category || 'Personal');
      setStartTime(taskToEdit.startTime || '09:00 AM');
      setDateString(taskToEdit.deadline.toLocaleDateString());
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Personal');
      setStartTime('09:00 AM');
      setDateString(new Date().toLocaleDateString());
    }
  }, [taskToEdit, visible]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const taskData: NewTask = {
      title,
      description,
      priority,
      category,
      startTime,
      deadline: new Date(dateString) || new Date(),
      completed: false
    };

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, taskData);
      } else {
        await addTask(userId, taskData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('Personal');
    setStartTime('09:00 AM');
    setDateString(new Date().toLocaleDateString());
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardView}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Pressable onPress={onClose}>
                <Ionicons name="close" size={28} color="#fff" />
              </Pressable>
              <Text style={styles.modalTitle}>{taskToEdit ? 'Edit Task' : 'New Task'}</Text>
              <Pressable onPress={clearForm}>
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.inputWrapper}>
                <GlassInput
                  label="Task Title"
                  placeholder="What needs to be done?"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.inputWrapper}>
                <GlassInput
                  label="Start Time"
                  placeholder="e.g. 09:30 AM"
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>

              <View style={styles.inputWrapper}>
                <GlassInput
                  label="Due Date"
                  placeholder="MM/DD/YYYY"
                  value={dateString}
                  onChangeText={setDateString}
                />
              </View>

              <View style={styles.selectorsRow}>
                <View style={styles.selectorColumn}>
                  <Text style={styles.label}>Category</Text>
                  <View style={styles.categoryGrid}>
                    {CATEGORIES.map(c => (
                      <Pressable 
                        key={c} 
                        onPress={() => setCategory(c)}
                        style={[
                          styles.categoryChip,
                          category === c && styles.categoryChipActive
                        ]}
                      >
                        <Text style={[
                          styles.categoryChipText,
                          category === c && styles.categoryChipTextActive
                        ]}>{c}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.selectorsRow}>
                <View style={styles.selectorColumn}>
                  <Text style={styles.label}>Priority</Text>
                  <View style={styles.priorityGrid}>
                    {(['low', 'medium', 'high'] as const).map(p => (
                      <Pressable 
                        key={p} 
                        onPress={() => setPriority(p)}
                        style={[
                          styles.priorityChip,
                          priority === p && styles.priorityChipActive
                        ]}
                      >
                        <Text style={[
                          styles.priorityChipText,
                          priority === p && styles.priorityChipTextActive
                        ]}>{p.charAt(0).toUpperCase() + p.slice(1)}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              <Pressable style={[styles.saveButton, !title.trim() && styles.disabledButton]} onPress={handleSubmit} disabled={!title.trim()}>
                <Text style={styles.saveButtonText}>{taskToEdit ? 'Update Task' : 'Save Task'}</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.95)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#020617',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 20,
    maxHeight: '95%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  clearText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 24,
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 16,
    marginBottom: 8,
  },
  titleInputContainer: {
    marginBottom: 32,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholderTitle: {
    color: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    marginBottom: 32,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  row: {
    marginBottom: 32,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 16,
    gap: 16,
  },
  dateIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: 14,
    color: '#fff',
  },
  dateValue: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  selectorsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 32,
  },
  selectorColumn: {
    flex: 1,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectorValue: {
    color: '#fff',
    fontSize: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  categoryChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryChipText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  priorityChipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  priorityChipText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priorityChipTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
