import * as React from 'react';
import {DarkTheme, DefaultTheme} from '@react-navigation/native'
import { Appearance } from 'react-native-appearance'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ThemeContext from '../context/theme-context';

const myDarkTheme = {
  ...DarkTheme,
  colors:{
      ...DarkTheme.colors,   
      primary: '#0095f6', 
      secondary: '#121212', 
      third: '#cccccc', 
      // card: '#282828',
      background: '#000',
      card: '#000',
      text:"#fff",
      statusBarColor:"#000"
  },
  dark: true
}

const myLightTheme = {
  ...DefaultTheme,
  colors:{
      ...DefaultTheme.colors, 
      primary: '#0095f6', 
      secondary: '#737373',
      background: '#fff',
      card: '#fff',
      text:"#262626",
      statusBarColor:"rgb(242, 242, 242)"
  }
}

const ThemeProvider = (props: {children: React.ReactElement}) => {
  const [themeState, setThemeState] = React.useState('light')
  const { children } = props

  const setMode = async (mode: string) => {
    setThemeState(mode)
    await AsyncStorage.setItem('theme', mode)
  }

  const currentTheme = async () => {
    const value = await AsyncStorage.getItem('theme')
    if (value == 'dark') {
      setMode('dark')
    }
  }

  React.useEffect(() => {
    currentTheme()
  }, [])

  return (
      <ThemeContext.Provider 
        value={{
          mode: themeState, 
          setMode: setMode,
          theme: themeState == 'light' ? myLightTheme : myDarkTheme
        }}
      >
        {children}
      </ThemeContext.Provider>
  );
}

export default ThemeProvider;