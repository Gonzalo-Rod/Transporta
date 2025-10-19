import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Home from '../../screens/home';
import ContactScreen from '../../screens/contact';
import UserProfile from '../../screens/profile';
import Reservations from '../../screens/reservation';

const Tab = createBottomTabNavigator();

const ICONS_BY_ROUTE = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Reservations: { focused: 'calendar', unfocused: 'calendar-outline' },
  Contact: { focused: 'call', unfocused: 'call-outline' },
  UserProfile: { focused: 'person', unfocused: 'person-outline' },
};

const renderTabIcon = ({ routeName, focused, color, size }) => {
  const iconSet = ICONS_BY_ROUTE[routeName] || ICONS_BY_ROUTE.Home;
  const iconName = focused ? iconSet.focused : iconSet.unfocused;
  return <Ionicons name={iconName} size={size} color={color} />;
};

export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, 
        tabBarIcon: ({ focused, color, size }) =>
          renderTabIcon({ routeName: route.name, focused, color, size }),
        tabBarActiveTintColor: '#6B9AC4', 
        tabBarInactiveTintColor: 'gray', 
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Reservations" component={Reservations} />
      <Tab.Screen name="Contact" component={ContactScreen} />
      <Tab.Screen name="UserProfile" component={UserProfile} />
    </Tab.Navigator>
  );
}
