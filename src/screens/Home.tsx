import React, { useEffect, useReducer, useState } from 'react';
import { Dimensions, StyleSheet, SafeAreaView, Image, Button, StatusBar, ScrollView, Platform, ImageBackground, TouchableOpacity as DefaultTouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import AuthContext from '../context/auth-context';
import {Text, View, TouchableOpacity} from '../elements'
import mufc from '../../assets/images/mufc.jpg'
import fernandes from '../../assets/images/fernandes.jpg'
import profile from '../../assets/images/profile.jpg'
import Svg, { Circle, Path } from 'react-native-svg'
import AutoHeightImage from 'react-native-auto-height-image'
import ThemeContext from '../context/theme-context';
import { TextInput } from 'react-native-gesture-handler';
import { NavigationContainerProps, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../stack/MainStack';
import { Post } from '../models';
import API_URI from '../../API_URI';
import PostContainer from '../elements/PostContainer';
import PostList from '../elements/PostList';

type mainScreenProp = StackNavigationProp<RootStackParamList, 'Home'>

const Home = () => {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([])
  const [commentText, setCommentText] = useState('')
  const { theme } = React.useContext(ThemeContext)
  const { text } = theme.colors
  const { signOut, userInfos } = React.useContext(AuthContext)

  const { addListener } = useNavigation<mainScreenProp>()

  useEffect(() => {
    const Posts_Listing = async (): Promise<void> => {
      const request = await fetch(`${API_URI}/post`)
      const responseJson = await request.json()
      setDisplayedPosts(responseJson)
    }
    addListener('focus', Posts_Listing)
    Posts_Listing()
  }, [])

  return (
    <ScrollView>
      <View style={styles.container}>
        {userInfos && <PostList defaultPostList={displayedPosts} />}
      {/* {
        userInfos && displayedPosts.map((post, postIndex) => (
          <PostContainer 
            post={post} 
            postIndex={postIndex} 
            navigate={navigate} 
            updatePost={Update_A_Post}
            LikePost={Like_A_Post}
            DislikePost={Dislike_A_Post}
            LikeComment={Like_A_Comment}
            DislikeComment={Dislike_A_Comment}
          />
        ))
      } */}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  postBox: {
    width: Dimensions.get('window').width,
    marginBottom: 12
  },
  postHeader: {
    width: Dimensions.get('window').width,
    height: 52,
    // backgroundColor: 'pink',
    flexDirection: 'row'
  },
  postHeaderUser: {
    width: Dimensions.get('window').width - 40,
    height: 52,
    paddingHorizontal: 10,
    // backgroundColor: 'cyan',
    flexDirection: 'row',
    alignItems: 'center'
  },
  postHeaderUserAvatar: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dbdbdb'
  },
  postHeaderUserInfos: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  postHeaderUserInfosUsername: {
    fontWeight: 'bold'
  },
  postHeaderUserInfosLocation: {
    fontSize: 12
  },
  postHeaderOptions: {
    width: 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  postActions: {
    width: Dimensions.get('window').width,
    height: 45,
    // backgroundColor: 'pink',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  postActionsLeft: {
    flexDirection: 'row'
  },
  postBelow: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 12
  },
  textStrong: {
    fontWeight: 'bold'
  },
  postCaption: {
    marginTop: 2,
    marginBottom: 2,
  },
  postComments: {
    color: '#8e8e8e'
  },
  postBelowComment: {
    flexDirection: 'row',
    marginTop: 4
  },
  postBelowCommentImg: {
    width: 30,
    height: 30,
    marginRight: 8,
    borderRadius: 15
  },
  postTime: {
    fontSize: 11,
    color: 'grey',
    marginTop: 4
  }
})

export default Home