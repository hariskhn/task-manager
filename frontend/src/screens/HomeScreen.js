import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import StatsCard from '../components/StatsCard';
import FilterModal from '../components/FilterModal';

export default function HomeScreen({ navigation }) {
  const { tasks, loading, stats, filters, updateFilters, fetchTasks } = useTasks();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
    updateFilters({ search: text });
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
    setShowFilters(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const activeFilterCount = [
    filters.status !== 'all',
    filters.priority !== 'all',
    filters.category !== 'all',
  ].filter(Boolean).length;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Task Manager</Text>
        <Text style={styles.headerSubtitle}>
          {stats.pending} tasks pending
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchTasks} />
        }
      >
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatsCard
            title="Total"
            value={stats.total}
            icon="list"
            color="#6366f1"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon="checkmark-circle"
            color="#10b981"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon="time"
            color="#f59e0b"
          />
          <StatsCard
            title="High Priority"
            value={stats.highPriority}
            icon="flag"
            color="#ef4444"
          />
        </View>

        {/* Search and Filter Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tasks..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="filter" size={20} color="#fff" />
            {activeFilterCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Tasks List */}
        <View style={styles.tasksContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {filters.status === 'all' ? 'All Tasks' : 
               filters.status === 'completed' ? 'Completed Tasks' : 'Active Tasks'}
            </Text>
            <Text style={styles.taskCount}>{tasks.length} tasks</Text>
          </View>

          {tasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle-outline" size={80} color="#d1d5db" />
              <Text style={styles.emptyText}>No tasks found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery || activeFilterCount > 0
                  ? 'Try adjusting your filters'
                  : 'Create your first task to get started'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TaskCard
                  task={item}
                  onPress={() => navigation.navigate('TaskDetail', { taskId: item._id })}
                />
              )}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={handleFilterChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonActive: {
    backgroundColor: '#8b5cf6',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tasksContainer: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  taskCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

