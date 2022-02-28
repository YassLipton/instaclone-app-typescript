import React, { createRef, Fragment, useEffect, useReducer, useRef, useState } from 'react';
import { Dimensions, StyleSheet, SafeAreaView, Image, Button, StatusBar, ScrollView, Platform, ImageBackground, View as DefaultView, TouchableOpacity as DefaultTouchableOpacity, TouchableWithoutFeedback, TextInput, ScrollViewProps, LayoutChangeEvent } from 'react-native';
import AuthContext from '../context/auth-context';
import ThemeContext from '../context/theme-context';
import {Text, View, TouchableOpacity} from '.'
import Svg, { Circle, Path } from 'react-native-svg'
import { Comment, Post } from '../models';
import AutoHeightImage from 'react-native-auto-height-image';
import like from '../../assets/images/like.png'
import liked from '../../assets/images/liked.png'
import { RouteProp, useNavigation } from '@react-navigation/native';
import API_URI from '../../API_URI';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../stack/MainStack';

type mainScreenProp = StackNavigationProp<RootStackParamList, 'PostList'>

const PostList = (props: {
  route?: RouteProp<{ 
    params: { 
      defaultPostList: Post[],
      selectedPostIndex?: number
    } 
  }, 'params'>,
  defaultPostList?: Post[]
}) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const { userInfos } = React.useContext(AuthContext)
  const { theme } = React.useContext(ThemeContext)
  const { text } = theme.colors
  
  const [commentText, setCommentText] = useState('')

  // const navigate = (param: string, route: any) => {}

  const { navigate } = useNavigation<mainScreenProp>()

  const nav: (screen: string, route: any) => void = navigate

  const navToProfile: (name: string, params: any) => void = navigate

  const [postList, setPostList] = useState<Post[]>([])
  const [selectedPostIndex, setSelectedPostIndex] = useState<number>()
  const [scrollRef, setScrollRef] = useState<ScrollView | null>()

  useEffect(() => {
    if (props.route) {
      const { defaultPostList, selectedPostIndex } = props.route.params
      setPostList(defaultPostList)
      setSelectedPostIndex(selectedPostIndex)
    } else if (props.defaultPostList) {
      const { defaultPostList } = props
      setPostList(defaultPostList)
    }
  }, [props])

  const Update_A_Post = (index: number, postUpdated: Post) => {
    let defaultPostList: Post[] = postList
    defaultPostList[index] = postUpdated
    setPostList(defaultPostList)
    forceUpdate()
  }

  const Like_A_Post = async (postIndex: number) => {
    postList[postIndex].usersWhoLiked.push(userInfos!._id)
    const request = await fetch(`${API_URI}/post/update/${postList[postIndex]._id}`, {
      method: "PUT",
      body: JSON.stringify(postList[postIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      setPostList(postList)
      forceUpdate()
    }
  }

  const Dislike_A_Post = async (postIndex: number) => {
    postList[postIndex].usersWhoLiked.splice(postList[postIndex].usersWhoLiked.indexOf(userInfos!._id))
    const request = await fetch(`${API_URI}/post/update/${postList[postIndex]._id}`, {
      method: "PUT",
      body: JSON.stringify(postList[postIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      setPostList(postList)
      forceUpdate()
    }
  }

  const Like_A_Comment = async (postIndex: number, commentIndex: number) => {
    console.log(postList[postIndex].comments[commentIndex].usersWhoLiked)
    console.log(userInfos!._id)
    postList[postIndex].comments[commentIndex].usersWhoLiked.push(userInfos!._id)
    const request = await fetch(`${API_URI}/post/comment/update/${postList[postIndex].comments[commentIndex]._id}`, {
      method: "PUT",
      body: JSON.stringify(postList[postIndex].comments[commentIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      setPostList(postList)
      forceUpdate()
    }
    console.log('comment liked')
    console.log(postList[postIndex].comments[commentIndex].usersWhoLiked)
  }

  const Dislike_A_Comment = async (postIndex: number, commentIndex: number) => {
    postList[postIndex].comments[commentIndex].usersWhoLiked.splice(postList[postIndex].comments[commentIndex].usersWhoLiked.indexOf(userInfos!._id))
    const request = await fetch(`${API_URI}/post/comment/update/${postList[postIndex].comments[commentIndex]._id}`, {
      method: "PUT",
      body: JSON.stringify(postList[postIndex].comments[commentIndex]),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 200) {
      setPostList(postList)
      forceUpdate()
    }
  }

  const layoutEvent = (event: LayoutChangeEvent, postIndex: number): void => {
    if ((postIndex == selectedPostIndex) && scrollRef !== undefined) {
      const layout = event.nativeEvent.layout
      scrollToRow(postIndex, layout.height)
    } 
  }

  const scrollToRow = (itemIndex: number, rowHeight: number) => {
    scrollRef!.scrollTo({y:itemIndex * rowHeight})
  }

  return (
    <ScrollView ref={ref => setScrollRef(ref)}>
      <View style={styles.container} isCard>
      {
        postList.map((post, postIndex) => (
          <DefaultView style={styles.postBox} onLayout={e => layoutEvent(e, postIndex)} key={postIndex}>
            <View style={styles.postHeader}>
              <DefaultTouchableOpacity style={styles.postHeaderUser} onPress={() => nav('AnyProfile', {selectedUserInfos: post.user})}>
                <Image style={styles.postHeaderUserAvatar} source={{uri: post.user.profilePicUrl}} />
                <View style={styles.postHeaderUserInfos}>
                  <Text style={styles.postHeaderUserInfosUsername}>{post.user.username}</Text>
                  {post.location != '' && <Text style={styles.postHeaderUserInfosLocation}>{post.location}</Text>}
                </View>
              </DefaultTouchableOpacity>
              <DefaultTouchableOpacity style={styles.postHeaderOptions}>
                <Svg width={20} height={20} fill={text} viewBox="0 0 32 32">
                  <Circle cx={16} cy={5} r={3} />
                  <Circle cx={16} cy={16} r={3} />
                  <Circle cx={16} cy={27} r={3} />
                </Svg>
              </DefaultTouchableOpacity>
            </View>
            <AutoHeightImage
              width={Dimensions.get('window').width}
              source={{uri: post.images[0].link}}
            />
            <View style={styles.postActions}>
              <View style={styles.postActionsLeft}>
              {
                post.usersWhoLiked.find(id => id == userInfos!._id) !== undefined
                ?
                <TouchableOpacity onPress={() => Dislike_A_Post(postIndex)}>
                  <Image style={{width: 24, height: 24, marginLeft: 16}} source={liked} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => Like_A_Post(postIndex)}>
                  <Image style={{width: 24, height: 24, marginLeft: 16}} source={like} />
                </TouchableOpacity>
              }
                <TouchableOpacity onPress={() => nav('Comments', {post, postIndex, LikeComment: Like_A_Comment, DislikeComment: Dislike_A_Comment})}>
                  <Svg width={24} height={24} fill={text} style={{marginLeft: 16}} viewBox="0 0 512 512">
                    <Path d="M385.621 390.771c39.335-35.996 61.739-86.636 61.739-140.162 0-104.766-85.233-190-190-190s-190 85.234-190 190c0 125.188 119.958 217.084 241.508 182.919 95.322 21.903 90.336 21.081 92.492 21.081 7.419 0 12.269-7.822 8.944-14.473zM308.589 413.2c-.958 0-1.915.138-2.842.412C196.277 446.06 87.36 363.424 87.36 250.608c0-93.738 76.262-170 170-170s170 76.262 170 170c0 50.256-22.078 97.672-60.573 130.089a10.002 10.002 0 0 0-2.503 12.122l18.637 37.271c-75.846-17.41-72.19-16.89-74.332-16.89z" />
                  </Svg>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Svg width={24} height={24} fill={text} style={{marginLeft: 16}} viewBox="0 0 512 512">
                    <Path d="M448.279 66.692a10 10 0 0 0-10.343-2.378L70.241 191.593a9.999 9.999 0 0 0-1.517 18.228l152.981 83.444 83.444 152.98a10.003 10.003 0 0 0 9.608 5.178 10.003 10.003 0 0 0 8.621-6.694l127.28-367.695a10.003 10.003 0 0 0-2.379-10.342zm-44.885 30.743L227.295 273.533 98.156 203.094zm-91.517 319.378-70.439-129.138 176.099-176.1z" />
                  </Svg>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Svg width={24} height={24} fill={text} style={{marginRight: 16}} viewBox="0 0 512 512">
                  <Path d="M427.36 27.61h-340c-5.523 0-10 4.478-10 10v440a10 10 0 0 0 16.943 7.197L257.36 327.505l163.057 157.303a10 10 0 0 0 16.943-7.197v-440c0-5.523-4.477-10.001-10-10.001zm-10 426.458L264.303 306.413c-1.937-1.868-4.439-2.803-6.942-2.803s-5.006.935-6.943 2.803L97.36 454.068V47.61h320z" />
                </Svg>
              </TouchableOpacity>
            </View>
            <View style={styles.postBelow}>
              <Text style={styles.textStrong}>{post.usersWhoLiked?.length} J'aime</Text>
              <Text style={styles.postCaption}><Text style={styles.textStrong}>{post.user.username}</Text> {post.caption}</Text>
              <Text style={styles.postComments} onPress={() => nav('Comments', {post, postIndex, LikeComment: Like_A_Comment, DislikeComment: Dislike_A_Comment})}>Voir les {post.comments.length} commentaires</Text>
              <View style={styles.postBelowComment}>
                <Image style={styles.postBelowCommentImg} source={{uri: userInfos?.profilePicUrl}} />
                <TextInput
                  placeholder='Ajouter un commentaire...'
                  placeholderTextColor={'grey'}
                  onChangeText={setCommentText}
                />
              </View>
              <Text style={styles.postTime}>il y a 3 jours</Text>
            </View>
          </DefaultView>
        ))
      }
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
    marginBottom: 8
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

export default PostList