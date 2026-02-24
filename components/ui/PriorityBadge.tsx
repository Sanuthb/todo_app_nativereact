import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Priority } from '../../lib/tasks';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const getColors = () => {
    switch (priority) {
      case 'high':
        return { bg: 'rgba(240, 82, 82, 0.2)', text: '#F05252', border: 'rgba(240, 82, 82, 0.3)' };
      case 'medium':
        return { bg: 'rgba(255, 138, 76, 0.2)', text: '#FF8A4C', border: 'rgba(255, 138, 76, 0.3)' };
      case 'low':
        return { bg: 'rgba(49, 196, 141, 0.2)', text: '#31C48D', border: 'rgba(49, 196, 141, 0.3)' };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
