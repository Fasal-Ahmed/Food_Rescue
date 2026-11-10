import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import BrowseScreen from '../screens/BrowseScreen';
import ClaimsScreen from '../screens/ClaimsScreen';
import ImpactScreen from '../screens/ImpactScreen';
import DetailsScreen from '../screens/DetailsScreen';
import DonorsScreen from '../screens/DonorsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const icons = {
  Home: 'home',
  Browse: 'search',
  'My Rescues': 'bag-check',
  Impact: 'leaf',
};

const headerStyle = { backgroundColor: colors.primary };

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle,
        headerTintColor: '#fff',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'FoodRescue' }} />
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen name="My Rescues" component={ClaimsScreen} />
      <Tab.Screen name="Impact" component={ImpactScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle, headerTintColor: '#fff' }}>
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Food Details' }} />
        <Stack.Screen name="Donors" component={DonorsScreen} options={{ title: 'Our Donors' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
