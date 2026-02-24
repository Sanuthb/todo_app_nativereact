import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from './firebase';

export type Priority = 'low' | 'medium' | 'high';
export type Category = 'Work' | 'Personal' | 'Shopping' | 'Health';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  deadline: Date;
  startTime?: string; // e.g. "09:00 AM"
  priority: Priority;
  category: Category;
  completed: boolean;
  createdAt: Date;
}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'userId'>;

const TASKS_COLLECTION = 'tasks';

export const subscribeToTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        deadline: data.deadline?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        category: data.category || 'Personal',
        startTime: data.startTime || '09:00 AM',
      } as Task;
    });
    callback(tasks);
  });
};

export const addTask = async (userId: string, task: NewTask) => {
  return addDoc(collection(db, TASKS_COLLECTION), {
    ...task,
    userId,
    deadline: Timestamp.fromDate(task.deadline),
    createdAt: serverTimestamp(),
    completed: false,
  });
};

export const toggleTaskStatus = async (taskId: string, currentStatus: boolean) => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  return updateDoc(taskRef, {
    completed: !currentStatus,
  });
};

export const deleteTask = async (taskId: string) => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  return deleteDoc(taskRef);
};

export const updateTask = async (taskId: string, updates: Partial<NewTask>) => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  const firestoreUpdates: any = { ...updates };
  if (updates.deadline) {
    firestoreUpdates.deadline = Timestamp.fromDate(updates.deadline);
  }
  return updateDoc(taskRef, firestoreUpdates);
};

export const groupTasksByDate = (tasks: Task[]) => {
  return tasks.reduce((groups: { [key: string]: Task[] }, task) => {
    const date = task.deadline.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});
};
