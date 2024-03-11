import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/MainScreen';
import Home from './screens/Home';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

type YourNavigatorParamList = {
  MainScreen: undefined;
  Home: undefined;
  // Agrega más pantallas aquí si es necesario
};



const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name='MainScreen' component={MainScreen} options={{ headerShown: false }}/>
        {/* Agrega más pantallas aquí */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
