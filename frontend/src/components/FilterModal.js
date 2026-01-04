import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function FilterModal({ visible, onClose, filters, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  const priorityOptions = [
    { label: 'All', value: 'all' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  const categoryOptions = [
    { label: 'All', value: 'all' },
    { label: 'Work', value: 'work' },
    { label: 'Personal', value: 'personal' },
    { label: 'Shopping', value: 'shopping' },
    { label: 'Health', value: 'health' },
    { label: 'General', value: 'general' },
  ];

  const sortOptions = [
    { label: 'Date', value: 'date' },
    { label: 'Priority', value: 'priority' },
  ];

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: 'all',
      priority: 'all',
      category: 'all',
      search: '',
      sortBy: 'date',
    };
    setLocalFilters(resetFilters);
    onApply(resetFilters);
  };

  const OptionButton = ({ label, value, selected, onPress, color }) => (
    <TouchableOpacity
      style={[styles.optionButton, selected && styles.optionButtonSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {selected && (
        <View style={[styles.selectedIndicator, { backgroundColor: color }]} />
      )}
      <Text
        style={[
          styles.optionText,
          selected && styles.optionTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Status Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={styles.optionsContainer}>
                {statusOptions.map((option) => (
                  <OptionButton
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    selected={localFilters.status === option.value}
                    onPress={() =>
                      setLocalFilters({ ...localFilters, status: option.value })
                    }
                    color="#6366f1"
                  />
                ))}
              </View>
            </View>

            {/* Priority Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Priority</Text>
              <View style={styles.optionsContainer}>
                {priorityOptions.map((option) => (
                  <OptionButton
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    selected={localFilters.priority === option.value}
                    onPress={() =>
                      setLocalFilters({ ...localFilters, priority: option.value })
                    }
                    color="#f59e0b"
                  />
                ))}
              </View>
            </View>

            {/* Category Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.optionsContainer}>
                {categoryOptions.map((option) => (
                  <OptionButton
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    selected={localFilters.category === option.value}
                    onPress={() =>
                      setLocalFilters({ ...localFilters, category: option.value })
                    }
                    color="#8b5cf6"
                  />
                ))}
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.optionsContainer}>
                {sortOptions.map((option) => (
                  <OptionButton
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    selected={localFilters.sortBy === option.value}
                    onPress={() =>
                      setLocalFilters({ ...localFilters, sortBy: option.value })
                    }
                    color="#10b981"
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.applyButtonGradient}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
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
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#eef2ff',
    borderColor: '#6366f1',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  optionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#6366f1',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  applyButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

