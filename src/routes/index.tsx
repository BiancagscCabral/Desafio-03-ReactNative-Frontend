import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../screens/Home';
import { Details } from '../screens/Details';
import { Login } from '../screens/Login';
import { AddProduct } from '../screens/AddProduct';
import { Product } from '../types';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Details: { product: Product };
  // MUDANÇA AQUI: Agora aceita um "productToEdit" opcional (?)
  AddProduct: { productToEdit?: Product } | undefined; 
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ title: 'NexoApp' }} />
        <Stack.Screen name="Details" component={Details} options={{ title: 'Detalhes' }} />
        
        <Stack.Screen 
          name="AddProduct" 
          component={AddProduct} 
          options={{ title: 'Cadastrar Produto' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}