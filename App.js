import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './src/screens/auth/login';

import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/stacknavigator';
import { UserProvider } from './src/services/usercontext';
export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
        <StackNavigator />
      </UserProvider>
    </NavigationContainer>
  );
}
