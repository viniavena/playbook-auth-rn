import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from '../screens/MainScreen';

const Stack = createStackNavigator();

export default function PrivateRoutes() {
  return (
    <Stack.Navigator initialRouteName="Main Screen">
      <Stack.Screen
        name="Main Screen"
        component={MainScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
