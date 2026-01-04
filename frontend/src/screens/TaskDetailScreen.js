import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTasks } from '../context/TaskContext';

export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { getTask, toggleTask, deleteTask } = useTasks();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const taskData = await getTask(taskId);
      setTask(taskData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const handleToggle = async () => {
    try {
      await toggleTask(taskId);
      await loadTask();
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  if (loading || !task) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <TouchableOpacity
            style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
            onPress={handleToggle}
          >
            {task.completed && (
              <Ionicons name="checkmark" size={24} color="#fff" />
            )}
          </TouchableOpacity>
          <Text style={[styles.title, task.completed && styles.titleCompleted]}>
            {task.title}
          </Text>
        </View>
      </View>

      {task.description ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>
      ) : null}

      <View style={styles.detailsGrid}>
        <View style={styles.detailCard}>
          <View style={[styles.iconContainer, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
            <Ionicons name="flag" size={24} color={getPriorityColor(task.priority)} />
          </View>
          <Text style={styles.detailLabel}>Priority</Text>
          <Text style={[styles.detailValue, { color: getPriorityColor(task.priority) }]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Text>
        </View>

        <View style={styles.detailCard}>
          <View style={[styles.iconContainer, { backgroundColor: '#6366f1' + '20' }]}>
            <Ionicons name="pricetag" size={24} color="#6366f1" />
          </View>
          <Text style={styles.detailLabel}>Category</Text>
          <Text style={styles.detailValue}>
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </Text>
        </View>
      </View>

      {task.dueDate && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Due Date</Text>
          <View style={[styles.dateCard, isOverdue && styles.dateCardOverdue]}>
            <Ionicons
              name="calendar"
              size={20}
              color={isOverdue ? '#ef4444' : '#6366f1'}
            />
            <Text style={[styles.dateText, isOverdue && styles.dateTextOverdue]}>
              {formatDate(task.dueDate)}
            </Text>
            {isOverdue && (
              <View style={styles.overdueBadge}>
                <Text style={styles.overdueText}>Overdue</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={[styles.statusCard, task.completed && styles.statusCardCompleted]}>
          <Ionicons
            name={task.completed ? 'checkmark-circle' : 'time'}
            size={20}
            color={task.completed ? '#10b981' : '#f59e0b'}
          />
          <Text style={[styles.statusText, task.completed && styles.statusTextCompleted]}>
            {task.completed ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditTask', { taskId: task._id })}
        >
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.editButtonGradient}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Edit Task</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  dateCardOverdue: {
    backgroundColor: '#fee2e2',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  dateTextOverdue: {
    color: '#ef4444',
  },
  overdueBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  overdueText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  statusCardCompleted: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 16,
    color: '#f59e0b',
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: '#10b981',
  },
  actions: {
    padding: 15,
    gap: 12,
    marginBottom: 30,
  },
  editButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fee2e2',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});

