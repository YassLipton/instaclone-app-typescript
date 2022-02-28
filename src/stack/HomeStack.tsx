import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import Home from '../screens/Home';
import HomeCustomHeader from '../elements/HomeCustomHeader';
import Comments from '../screens/Comments';
import BasicCustomHeader from '../elements/BasicCustomHeader';
import AnyProfile from '../screens/AnyProfile';
import Followers from '../screens/Followers';
import AuthContext from '../context/auth-context';
import CreatePost from '../screens/CreatePost';

const Stack = createStackNavigator();

function HomeStack() {

  const { userInfos } = React.useContext(AuthContext)

  return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{headerTitle: () => <HomeCustomHeader />}}
          component={Home}
        />
        <Stack.Screen
          name="AnyProfile"
          options={{headerShown: false}}
          component={AnyProfile}
        />
        <Stack.Screen
          name="CreatePost"
          options={{headerShown: false}}
          component={CreatePost}
        />
        <Stack.Screen
          name="Followers"
          options={{headerTitle: userInfos?.username, headerTitleStyle: {fontWeight: '600'}}}
          component={Followers}
        />
        <Stack.Screen
          name="Comments"
          options={{headerTitle: ({children}) => <BasicCustomHeader name='Commentaires' children={children} />}}
          component={Comments}
        />
      </Stack.Navigator>
  );
}

export default HomeStack;