import * as React from 'react';
import {DarkTheme, DefaultTheme} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import { Appearance, AppearanceProvider, useColorScheme } from 'react-native-appearance'
import MainStack from './src/stack/MainStack'
import AuthProvider from './src/common/AuthProvider'
import ThemeProvider from './src/common/ThemeProvider'
import { LogBox } from 'react-native';

function App() {
  return (
    <AppearanceProvider>
      <ThemeProvider>
        <AuthProvider>
          <MainStack />
        </AuthProvider>
      </ThemeProvider>
    </AppearanceProvider>
  )
}

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
])

export default App