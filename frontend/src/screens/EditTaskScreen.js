import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '../context/TaskContext';

export default function EditTaskScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { getTask, updateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const priorities = [
    { label: 'Low', value: 'low', color: '#10b981' },
    { label: 'Medium', value: 'medium', color: '#f59e0b' },
    { label: 'High', value: 'high', color: '#ef4444' },
  ];

  const categories = [
    { label: 'General', value: 'general' },
    { label: 'Work', value: 'work' },
    { label: 'Personal', value: 'personal' },
    { label: 'Shopping', value: 'shopping' },
    { label: 'Health', value: 'health' },
  ];

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const task = await getTask(taskId);
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setCategory(task.category);
      if (task.dueDate) {
        setDueDate(new Date(task.dueDate));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load task');
      navigation.goBack();
    } finally {
      setInitialLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDueDate(selectedDate);
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    } else if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        dueDate: dueDate ? dueDate.toISOString() : null,
      };

      await updateTask(taskId, taskData);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task title"
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter task description"
            placeholderTextColor="#9ca3af"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        {/* Priority Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.optionsContainer}>
            {priorities.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.optionButton,
                  priority === item.value && styles.optionButtonSelected,
                  { borderColor: item.color },
                ]}
                onPress={() => setPriority(item.value)}
                activeOpacity={0.7}
              >
                {priority === item.value && (
                  <View style={[styles.selectedDot, { backgroundColor: item.color }]} />
                )}
                <Text
                  style={[
                    styles.optionText,
                    priority === item.value && { color: item.color, fontWeight: '600' },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.optionsContainer}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.optionButton,
                  category === item.value && styles.optionButtonSelected,
                ]}
                onPress={() => setCategory(item.value)}
                activeOpacity={0.7}
              >
                {category === item.value && (
                  <View style={[styles.selectedDot, { backgroundColor: '#6366f1' }]} />
                )}
                <Text
                  style={[
                    styles.optionText,
                    category === item.value && { color: '#6366f1', fontWeight: '600' },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Due Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#6366f1" />
            <Text style={[styles.dateText, !dueDate && styles.dateTextPlaceholder]}>
              {formatDate(dueDate)}
            </Text>
            {dueDate && (
              <TouchableOpacity
                onPress={() => setDueDate(null)}
                style={styles.clearDateButton}
              >
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Updating...' : 'Update Task'}
            </Text>
          </LinearGradient>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  optionButtonSelected: {
    backgroundColor: '#eef2ff',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  optionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  dateTextPlaceholder: {
    color: '#9ca3af',
  },
  clearDateButton: {
    marginLeft: 'auto',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

