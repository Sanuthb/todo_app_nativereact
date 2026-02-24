import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type CategoryType = 'Work' | 'Personal' | 'Shopping' | 'Health';

interface CategoryCardProps {
  category: CategoryType;
  count: number;
}

const CATEGORY_COLORS: Record<CategoryType, string> = {
  Work: '#3b82f6', // blue
  Personal: '#f59e0b', // amber
  Shopping: '#10b981', // emerald
  Health: '#fb7185', // rose
};

const CATEGORY_ICONS: Record<CategoryType, keyof typeof Ionicons.prototype.props.name> = {
  Work: 'briefcase',
  Personal: 'person',
  Shopping: 'cart',
  Health: 'fitness',
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, count }) => {
  return (
    <View style={[styles.card, { backgroundColor: `${CATEGORY_COLORS[category]}15` }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${CATEGORY_COLORS[category]}30` }]}>
        <Ionicons name={CATEGORY_ICONS[category]} size={24} color={CATEGORY_COLORS[category]} />
      </View>
      <Text style={styles.categoryName}>{category}</Text>
      <Text style={styles.taskCount}>{count} tasks</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '31%',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  taskCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
  },
});
