import * as React from 'react';
import { User } from '../models';

const initialAuthState: {
  userToken: null,
  userInfos: User | undefined,
  signIn: (param: string) => void,
  signOut: () => void,
  signUp: () => void,
  checkLog: () => void,
  updateUserInfos: (newUserInfos: User) => void,

} = {
  userToken: null,
  userInfos: undefined,
  signIn: (param: string) => {},
  signOut: () => {},
  signUp: () => {},
  checkLog: () => {},
  updateUserInfos: (newUserInfos: User) => {},
}

const AuthContext = React.createContext(initialAuthState);

export default AuthContext;