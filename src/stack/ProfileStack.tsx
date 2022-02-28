import React, { useContext } from 'react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/Profile';
import ProfileCustomHeader from '../elements/ProfileCustomHeader';
import PostList from '../elements/PostList';
import EditProfile from '../screens/EditProfile';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import Followers from '../screens/Followers';
import AuthContext from '../context/auth-context';
import AnyProfile from '../screens/AnyProfile';

const Stack = createStackNavigator();

const ProfileStack = (props: {
  navigation: NavigationProp<ParamListBase>
}) => {

  const { navigate, getState } = props.navigation

  const { userInfos } = useContext(AuthContext)

  return (
      <Stack.Navigator defaultScreenOptions={{
        headerShown: false
      }}>
        <Stack.Screen
          name="Profile"
          options={{headerTitle: ({children}) => <ProfileCustomHeader />}}
          component={Profile}
        />
        <Stack.Screen
          name="AnyProfile"
          options={{headerShown: false}}
          component={AnyProfile}
        />
        <Stack.Screen
          name="Followers"
          options={{headerTitle: userInfos?.username, headerTitleStyle: {fontWeight: '600'}}}
          component={Followers}
        />
        <Stack.Screen
          name="EditProfile"
          options={{
            headerShown: false,
            headerTitle: 'Modifier profil', 
            headerLeft: () => {
              return (
                <TouchableOpacity>
                  <Icon name='close-outline' size={38} onPress={() => navigate('Profile')}/>
                </TouchableOpacity>
              )
            }, 
            headerLeftContainerStyle: {marginLeft: 8, marginRight: 12}, 
            headerRight: () => (
              <TouchableOpacity>
                <Icon name='checkmark' size={34} color='#0095f6' onPress={() => navigate('Profile')}/>
              </TouchableOpacity>
            ), 
            headerRightContainerStyle: {marginRight: 8}
          }}
          component={EditProfile}
        />
        <Stack.Screen
          name="PostList"
          // options={{headerTitle: ({children}) => <ProfileCustomHeader />}}
          options={{headerTitle: 'Publications'}}
          component={PostList}
        />
      </Stack.Navigator>
  );
}

export default ProfileStack;