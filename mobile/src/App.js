import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
  Platform
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import BrowserScreen from './screens/BrowserScreen';
import TabsScreen from './screens/TabsScreen';
import MenuScreen from './screens/MenuScreen';

import { darkTheme, lightTheme } from '../../shared/themes/theme-system';

const Tab = createBottomTabNavigator();

function App() {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('dark'); // dark, light, auto, desktop
  const [theme, setTheme] = useState(darkTheme);

  useEffect(() => {
    // Determine which theme to use
    let activeTheme;
    
    switch (themeMode) {
      case 'light':
        activeTheme = lightTheme;
        break;
      case 'dark':
        activeTheme = darkTheme;
        break;
      case 'desktop':
      case 'auto':
        activeTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
        break;
      default:
        activeTheme = darkTheme;
    }

    setTheme(activeTheme);
  }, [themeMode, systemColorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={{
        dark: theme.name === 'dark',
        colors: {
          primary: theme.colors.accentBlue,
          background: theme.colors.bgPrimary,
          card: theme.colors.bgSecondary,
          text: theme.colors.textPrimary,
          border: theme.colors.divider,
          notification: theme.colors.accentAmber
        }
      }}>
        <StatusBar
          barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.bgPrimary}
        />
        
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bgPrimary }]}>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: theme.colors.bgSecondary,
                borderTopColor: theme.colors.divider,
                height: Platform.OS === 'ios' ? 84 : 64,
                paddingBottom: Platform.OS === 'ios' ? 24 : 8
              },
              tabBarActiveTintColor: theme.colors.accentBlue,
              tabBarInactiveTintColor: theme.colors.textSecondary
            }}
          >
            <Tab.Screen 
              name="Browser" 
              component={BrowserScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 4 }} />
                )
              }}
            />
            <Tab.Screen 
              name="Tabs" 
              component={TabsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 4 }} />
                ),
                tabBarBadge: 3
              }}
            />
            <Tab.Screen 
              name="Menu" 
              component={MenuScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <View style={{ width: size, height: size, backgroundColor: color, borderRadius: size / 4 }} />
                )
              }}
            />
          </Tab.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
