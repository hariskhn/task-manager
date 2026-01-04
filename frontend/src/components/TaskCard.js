import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function TaskCard({ task, onPress }) {
  const { toggleTask } = useTasks();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityLabel = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <TouchableOpacity
        style={[styles.card, task.completed && styles.cardCompleted]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <TouchableOpacity
          style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
          onPress={() => toggleTask(task._id)}
          activeOpacity={0.7}
        >
          {task.completed && (
            <Ionicons name="checkmark" size={20} color="#fff" />
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <Text
            style={[styles.title, task.completed && styles.titleCompleted]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}

          <View style={styles.footer}>
            <View style={styles.tags}>
              <View
                style={[
                  styles.priorityTag,
                  { backgroundColor: getPriorityColor(task.priority) + '20' },
                ]}
              >
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: getPriorityColor(task.priority) },
                  ]}
                />
                <Text
                  style={[
                    styles.priorityText,
                    { color: getPriorityColor(task.priority) },
                  ]}
                >
                  {getPriorityLabel(task.priority)}
                </Text>
              </View>

              {task.category && task.category !== 'general' && (
                <View style={styles.categoryTag}>
                  <Ionicons name="pricetag" size={12} color="#6366f1" />
                  <Text style={styles.categoryText}>{task.category}</Text>
                </View>
              )}

              {task.dueDate && (
                <View
                  style={[
                    styles.dateTag,
                    isOverdue && styles.dateTagOverdue,
                  ]}
                >
                  <Ionicons
                    name="calendar"
                    size={12}
                    color={isOverdue ? '#ef4444' : '#6b7280'}
                  />
                  <Text
                    style={[
                      styles.dateText,
                      isOverdue && styles.dateTextOverdue,
                    ]}
                  >
                    {formatDate(task.dueDate)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#d1d5db"
          style={styles.arrow}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  cardCompleted: {
    opacity: 0.7,
    borderLeftColor: '#10b981',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '500',
  },
  dateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dateTagOverdue: {
    backgroundColor: '#fee2e2',
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  dateTextOverdue: {
    color: '#ef4444',
  },
  arrow: {
    marginLeft: 8,
    alignSelf: 'center',
  },
});

