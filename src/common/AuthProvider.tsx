import * as React from 'react';
import AuthContext from '../context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URI from '../../API_URI';
import { User } from '../models';

const initialAuthState = {
  isLoading: false,
  isSignOut: false,
  userToken: '',
  userInfos: undefined
}

const AuthReducer = (state: any, action: {type: string, token?: string | null, userInfos?: User}) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.token,
        userInfos: action.userInfos,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        userToken: action.token,
        userInfos: action.userInfos,
        isSignOut: false,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        userToken: null,
        userInfos: undefined,
        isSignOut: true,
      };
    default:
      return state;
  }
};

const AuthProvider = (props: {children: React.ReactElement}) => {
  const [state, dispatch] = React.useReducer(AuthReducer, initialAuthState);
  const { userToken, userInfos } = state
  const { children } = props

  const authContext = React.useMemo(
    () => ({
      userToken,
      userInfos,
      checkLog: async () => {
        const token: string | null = await AsyncStorage.getItem('log')
        const request = await fetch(`${API_URI}/user/checkToken/${token}`)
        const response = await request
        if (response.status == 401) {
          await AsyncStorage.removeItem('log')
          dispatch({type: 'SIGN_OUT'})
          return true
        } else {
          const responseJson = await request.json()
          console.log('checkToken', responseJson)
          dispatch({type: 'RESTORE_TOKEN', token: token, userInfos: responseJson});
          return true
        }
      },
      updateUserInfos: async (newUserInfos: User) => {
        const token: string | null = await AsyncStorage.getItem('log')
        dispatch({type: 'RESTORE_TOKEN', token: token, userInfos: newUserInfos})
      },
      signIn: async (param: string) => {
        await AsyncStorage.setItem('log', param)
        const request = await fetch(`${API_URI}/user/checkToken/${param}`)
        const responseJson = await request.json()
        console.log('checkToken', responseJson)
        dispatch({type: 'SIGN_IN', token: param, userInfos: responseJson});
      },
      signOut: async () => {
        await AsyncStorage.removeItem('log')
        dispatch({type: 'SIGN_OUT'})
      },
      signUp: () => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [userToken],
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
