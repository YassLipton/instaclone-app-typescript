import React from "react"
import { DarkTheme, DefaultTheme } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'

const myDarkTheme = {
  ...DarkTheme,
  colors:{
      ...DarkTheme.colors,   
      primary: '#4c34e0', 
      secondary: '#121212', 
      third: '#cccccc', 
      card: '#282828',
      text:"#fff",
      statusBarColor:"#000"
  },
  dark: true
}

const myLightTheme = {
  ...DefaultTheme,
  colors:{
      ...DefaultTheme.colors, 
      primary: '#4c34e0', 
      secondary: '#737373',
      background: '#f5f7fb',
      card: '#ececee',
      text:"#262626",
      statusBarColor:"rgb(242, 242, 242)"
  }
}

const currentTheme = async () => {
  const value = await AsyncStorage.getItem('theme')
  return value
}

const initialThemeState = {
  mode: 'light', 
  setMode: (mode: 'light' | 'dark') => {},
  theme: myLightTheme
}

const ThemeContext = React.createContext(initialThemeState)

ThemeContext.displayName = 'ThemeContext'

export default ThemeContext