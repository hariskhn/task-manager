import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { TaskProvider } from './src/context/TaskContext';
import HomeScreen from './src/screens/HomeScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import EditTaskScreen from './src/screens/EditTaskScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TaskProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#6366f1',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'My Tasks' }}
            />
            <Stack.Screen 
              name="TaskDetail" 
              component={TaskDetailScreen}
              options={{ title: 'Task Details' }}
            />
            <Stack.Screen 
              name="AddTask" 
              component={AddTaskScreen}
              options={{ title: 'New Task' }}
            />
            <Stack.Screen 
              name="EditTask" 
              component={EditTaskScreen}
              options={{ title: 'Edit Task' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TaskProvider>
    </GestureHandlerRootView>
  );
}

