import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainContainer from './bottomTabNavigator';
import CreateGroup from '../components/createGroup';
import GroupPage from '../components/group-page';
import AddExpense from '../components/addexpense';
import Login from '../screens/auth/login';
import { UserContext } from '../services/usercontext';

const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={MainContainer} options={{ headerShown: false }} />
    <Stack.Screen name="CreateGroup" component={CreateGroup} options={{ headerShown: false }} />
    <Stack.Screen name="GroupPage" component={GroupPage} options={{ headerShown: false }} />
    <Stack.Screen name="AddExpense" component={AddExpense} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const StackNavigator = () => {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login" component={Login} />
      ) : (
        <Stack.Screen name="Home" component={MainStack} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
