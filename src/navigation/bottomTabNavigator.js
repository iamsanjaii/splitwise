import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Group from '../screens/dashboard/groups';
import Friends from '../screens/dashboard/friends';
import Activity from '../screens/dashboard/activity';
import Account from '../screens/dashboard/account';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <Tab.Navigator
      initialRouteName="Groups"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Groups') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Friends') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Activity') {
            iconName = focused ? 'flash' : 'flash-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={20} color={color} />;
        },
        tabBarActiveTintColor: '#00D95F',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12, paddingBottom: 10 },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: '#151729',
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Groups" component={Group}/>
      <Tab.Screen name="Friends" component={Friends} />
      <Tab.Screen name="Activity" component={Activity} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
}
