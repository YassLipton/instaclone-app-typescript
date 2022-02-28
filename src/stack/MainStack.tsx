import * as React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import AuthContext from '../context/auth-context';
import Loading from '../screens/Loading';
//import BottomBar from './BottomBar';
import { navigationRef } from '../../RootNavigation';
import { StatusBar, ActivityIndicator, Text } from 'react-native';
import ThemeContext from '../context/theme-context';
import SignIn from '../screens/SignIn';
import Nav from '../elements/HomeCustomHeader';
import SignUp from '../screens/SignUp';

const Stack = createStackNavigator();

const myDarkTheme={
  ...DarkTheme,
  colors:{
      ...DarkTheme.colors,   
      text:"#fff",
      statusBarColor:"#000"
  },
  dark: true
}

const myLightTheme={
  ...DefaultTheme,
  colors:{
      ...DefaultTheme.colors,
      text:"#000",
      statusBarColor:"rgb(242, 242, 242)"
  }
}

const MainStack = () => {
  const { userToken, signOut, checkLog } = React.useContext(AuthContext)
  const { mode } = React.useContext(ThemeContext)
  const [ logChecked, setLogChecked ] = React.useState(false)

  React.useEffect(() => {
    if (!logChecked) {
      checkLog()
      setLogChecked(true)
    }
  }, [userToken])

  return (
      <NavigationContainer ref={navigationRef} theme={mode === 'light' ? myLightTheme : myDarkTheme}>
        <StatusBar backgroundColor='#cfc357' />
        <Stack.Navigator>
        {
          logChecked
            ?
            <>
            {
              userToken
              ?
              <Stack.Screen
                name="Main"
                options={{
                  headerShown: false
                }}
                component={TabNavigator}
              />
              :
              <>
                <Stack.Screen
                  name="SignIn"
                  options={{
                    headerShown: false
                  }}
                  component={SignIn}
                />
                <Stack.Screen
                  name="SignUp"
                  options={{
                    headerShown: false
                  }}
                  component={SignUp}
                />
              </>
            }
            </>
            :
            <Stack.Screen
              name="Loading"
              component={Loading}
            />
        }
        </Stack.Navigator>
        {/* <BottomBar /> */}
      </NavigationContainer>
  );
}

export type RootStackParamList = {
  ProfileStack: undefined;
  Home: undefined;
  CreatePost: undefined;
  Comments: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Profile: undefined;
  AnyProfile: undefined;
  Followers: undefined;
  PostList: undefined;
  EditProfile: undefined;
}

export default MainStack;