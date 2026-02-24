import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

interface ProgressCardProps {
  completed: number;
  total: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.card}>
      <View style={styles.textColumn}>
        <Text style={styles.title}>Daily Progress</Text>
        <Text style={styles.subtitle}>{completed} of {total} tasks completed</Text>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Keep going!</Text>
        </Pressable>
      </View>
      
      <View style={styles.progressContainer}>
        <Svg width="100" height="100" viewBox="0 0 100 100">
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="8"
            fill="none"
          />
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#06b6d4"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </Svg>
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageContainer: {
    position: 'absolute',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
