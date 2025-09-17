import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import EditUserScreen from './src/screens/EditUserScreen'; // AGREGADO
import TabNavigator from './src/navigation/TabNavigation';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!showSplash) {
        setIsLoading(false);
      }
    });

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(loadingTimer);
      unsubscribe();
    };
  }, [showSplash]);

  if (showSplash || isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{ 
                headerShown: true, 
                title: 'Editar Perfil',
                headerStyle: {
                  backgroundColor: '#0a0a0a',
                },
                headerTintColor: '#00d4ff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  color: '#ffffff',
                },
              }}
            />
            <Stack.Screen 
              name="EditUser" 
              component={EditUserScreen}
              options={{ 
                headerShown: true, 
                title: 'Editar Usuario',
                headerStyle: {
                  backgroundColor: '#0a0a0a',
                },
                headerTintColor: '#3b82f6',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  color: '#ffffff',
                },
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}