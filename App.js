import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TodoListScreen from './src/screens/TodoListScreen';
import TodoFormScreen from './src/screens/TodoFormScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TodoList"
            component={TodoListScreen}
            options={{
              title: 'Minhas Tarefas',
              headerLeft: null,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="TodoForm"
            component={TodoFormScreen}
            options={{ title: 'Nova Tarefa' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
