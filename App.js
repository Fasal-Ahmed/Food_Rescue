import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { FoodProvider } from './src/context/FoodContext';

export default function App() {
  return (
    <FoodProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </FoodProvider>
  );
}
