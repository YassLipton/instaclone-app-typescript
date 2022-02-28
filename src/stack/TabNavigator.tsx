import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeCustomHeader from '../elements/HomeCustomHeader';
import ProfileCustomHeader from '../elements/ProfileCustomHeader';
import home from '../../assets/tab_bar_images/home.png'
import home_active from '../../assets/tab_bar_images/home-active.png'
import search from '../../assets/tab_bar_images/search.png'
import search_active from '../../assets/tab_bar_images/search-active.png'
import camera from '../../assets/tab_bar_images/camera.png'
import camera_active from '../../assets/tab_bar_images/camera-active.png'
import igtv from '../../assets/tab_bar_images/igtv.png'
import igtv_active from '../../assets/tab_bar_images/igtv-active.png'
import profile from '../../assets/images/profile.jpg'
import AuthContext from '../context/auth-context';
import UnavailableScreen from '../screens/UnavailableScreen';

const Tab = createBottomTabNavigator()

function MyTabs() {
  let theme = useTheme()
  const { userInfos } = React.useContext(AuthContext)

  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarStyle: {backgroundColor: theme.dark ? '#121212' : '#fff'}
      }}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ tabBarIcon: ({focused}) => focused ? <Image style={{width: 28, height: 28}} source={home_active} /> : <Image style={{width: 28, height: 28}} source={home} />, tabBarActiveTintColor: '#4c34e0', tabBarLabel:() => null, headerShown: false }} />
      <Tab.Screen name="Search" component={UnavailableScreen} options={{ tabBarIcon: ({focused}) => focused ? <Image style={{width: 28, height: 28}} source={search_active} /> : <Image style={{width: 28, height: 28}} source={search} />, tabBarActiveTintColor: '#4c34e0', tabBarLabel:() => null, headerTitle: () => <HomeCustomHeader /> }} />
      <Tab.Screen name="Camera" component={UnavailableScreen} options={{ tabBarIcon: ({focused}) => focused ? <Image style={{width: 28, height: 28}} source={camera_active} /> : <Image style={{width: 28, height: 28}} source={camera} />, tabBarActiveTintColor: '#4c34e0', tabBarLabel:() => null, headerTitle: () => <HomeCustomHeader /> }} />
      <Tab.Screen name="IGTV" component={UnavailableScreen} options={{ tabBarIcon: ({focused}) => focused ? <Image style={{width: 28, height: 28}} source={igtv_active} /> : <Image style={{width: 28, height: 28}} source={igtv} />, tabBarActiveTintColor: '#4c34e0', tabBarLabel:() => null, headerTitle: () => <HomeCustomHeader /> }} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ tabBarIcon: ({focused}) => focused ? <Image style={{width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#000'}} source={{uri: userInfos?.profilePicUrl} || profile} /> : <Image style={{width: 28, height: 28, borderRadius: 14}} source={{uri: userInfos?.profilePicUrl} || profile} />, tabBarActiveTintColor: '#4c34e0', tabBarLabel:() => null, headerShown: false }} />
    </Tab.Navigator>
  )
}

export default MyTabs