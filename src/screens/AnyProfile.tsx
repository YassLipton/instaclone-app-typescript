import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Dimensions, StyleSheet, Image, TouchableOpacity, Button, ActivityIndicator, ScrollView } from 'react-native';
import ThemeContext from '../context/theme-context';
import { Text, View } from '../elements';
import profile from '../../assets/images/profile.jpg'
import Svg, { Path } from 'react-native-svg';
import { Post, User } from '../models';
import API_URI from '../../API_URI';
import AuthContext from '../context/auth-context';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../stack/MainStack';
import * as ImagePicker from 'expo-image-picker';

type mainScreenProp = StackNavigationProp<RootStackParamList, 'Profile'>

const AnyProfile = (props: {
  route: RouteProp<{ 
    params: { 
      selectedUserInfos: User
    } 
  }, 'params'>,
}) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const { selectedUserInfos } = props.route.params
  const { userInfos, signIn } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const { background, card, text, primary } = theme.colors
  const [postViewActive, setPostViewActive] = useState('galery')
  const [isLoading, setLoading] = useState<boolean>(true)
  const [allUserPosts, setAllUserPosts] = useState<Post[]>([])

  const [currentSelectedUserInfos, setCurrentSelectedUserInfos] = useState(selectedUserInfos)
  const [currentUserInfos, setCurrentUserInfos] = useState<User | undefined>(userInfos)

  const { navigate, goBack } = useNavigation<mainScreenProp>()

  const navToPosts: (screen: string, route: {defaultPostList: Post[], selectedPostIndex?: number}) => void = navigate

  const navToFollowers: (screen: string, route: {defaultView: "followers" | "following"}) => void = navigate

  useEffect(() => {
    console.log(currentSelectedUserInfos)
    const Posts_Listing = async () => {
      const request = await fetch(`${API_URI}/post/listByUser/${currentSelectedUserInfos?._id}`)
      const responseJson = await request.json()
      setAllUserPosts(responseJson)
    }
    Posts_Listing()
    setLoading(false)
  }, [])

  const Follow_User = async () => {
    if (currentUserInfos) {
      console.log('currentSelectedUserInfos1', currentSelectedUserInfos.followers)
      currentSelectedUserInfos.followers.push(currentUserInfos._id)
      setCurrentSelectedUserInfos(currentSelectedUserInfos)
      forceUpdate()
      console.log('currentSelectedUserInfos2', currentSelectedUserInfos.followers)
      const request = await fetch(`${API_URI}/user/update/${currentSelectedUserInfos._id}`, {
        method: "PUT",
        body: JSON.stringify({
          followers: currentSelectedUserInfos.followers
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const response = await request
      if (response.status == 200) {
        console.log('currentUserInfos3', currentUserInfos.following)
        currentUserInfos.following.push(currentSelectedUserInfos._id)
        setCurrentUserInfos(currentUserInfos)
        forceUpdate()
        console.log('currentUserInfos4', currentUserInfos.following)
        const request2 = await fetch(`${API_URI}/user/update/${currentUserInfos._id}`, {
          method: "PUT",
          body: JSON.stringify({
            following: currentUserInfos.following
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const response2 = await request2
        const responseJson2 = await request2.json()
        if (response2.status == 200) {
          console.log('responseJson2', responseJson2)
          signIn(responseJson2.accessToken)
        }
      }
    }
  }

  const Unfollow_User = async () => {
    if (currentUserInfos) {
      const id = currentUserInfos._id
      const index = currentSelectedUserInfos.followers.indexOf(id)
      currentSelectedUserInfos?.followers.splice(index, 1)
      setCurrentSelectedUserInfos(currentSelectedUserInfos)
      forceUpdate()
      const request = await fetch(`${API_URI}/user/update/${currentSelectedUserInfos?._id}`, {
        method: "PUT",
        body: JSON.stringify({
          followers: currentSelectedUserInfos.followers
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const response = await request
      if (response.status == 200) {
        const id = currentSelectedUserInfos._id
        const index = currentUserInfos.following.indexOf(id)
        currentUserInfos?.following.splice(index, 1)
        setCurrentUserInfos(currentUserInfos)
        forceUpdate()
        const request = await fetch(`${API_URI}/user/update/${currentUserInfos?._id}`, {
          method: "PUT",
          body: JSON.stringify({
            following: currentUserInfos.following
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const response = await request
        if (response.status == 200) {
          const responseJson = await request.json()
          signIn(responseJson.accessToken)
        }
      }
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: background}}>
      <View style={styles.navContainer}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={goBack}>
            <Svg width={24} height={24} fill={text} style={{marginLeft: 16, marginRight: 22}} viewBox="0 0 24 24">
              <Path d="M22 11H4.414l5.293-5.293a1 1 0 1 0-1.414-1.414l-7 7a1 1 0 0 0 0 1.414l7 7a1 1 0 0 0 1.414-1.414L4.414 13H22a1 1 0 0 0 0-2z" />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.title}>{currentSelectedUserInfos.username}</Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity>
            <Svg width={24} height={24} fill={text} style={{marginLeft: 16}} viewBox="0 0 512 512">
              <Path d="M367.36 247.61h-100v-100c0-5.523-4.478-10-10-10-5.523 0-10 4.477-10 10v100h-100c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10h100v100c0 5.522 4.477 10 10 10 5.522 0 10-4.478 10-10v-100h100c5.522 0 10-4.478 10-10 0-5.523-4.477-10-10-10z" />
              <Path d="M374.36 57.61h-234c-43.078 0-78 34.922-78 78v244c0 43.078 34.922 78 78 78h234c43.078 0 78-34.922 78-78v-244c0-43.078-34.922-78-78-78zm58 322c0 32.032-25.968 58-58 58h-234c-32.033 0-58-25.968-58-58v-244c0-32.033 25.967-58 58-58h234c32.032 0 58 25.967 58 58z" />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity>
            <Svg width={22} height={24} fill={text} style={{marginLeft: 20}} viewBox="0 -53 384 384">
              <Path d="M368 154.668H16c-8.832 0-16-7.168-16-16s7.168-16 16-16h352c8.832 0 16 7.168 16 16s-7.168 16-16 16zM368 32H16C7.168 32 0 24.832 0 16S7.168 0 16 0h352c8.832 0 16 7.168 16 16s-7.168 16-16 16zM368 277.332H16c-8.832 0-16-7.168-16-16s7.168-16 16-16h352c8.832 0 16 7.168 16 16s-7.168 16-16 16zm0 0" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{backgroundColor: card}}>
        <View style={styles.container} isCard>
          <View style={styles.headerContainer}>
            <View style={styles.headerMain}>
              <Image style={styles.headerMainAvatar} source={{uri: currentSelectedUserInfos?.profilePicUrl}} />
              <View style={styles.headerMainCountContainer}>
                <TouchableOpacity style={styles.headerMainCountBox} onPress={() => console.log(currentSelectedUserInfos)}>
                  <Text style={styles.headerMainCountNumber}>{allUserPosts.length}</Text>
                  <Text style={styles.headerMainCountLabel} numberOfLines={1} ellipsizeMode='tail'>Publications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerMainCountBox} onPress={() => navToFollowers('Followers', {defaultView: 'followers'})}>
                  <Text style={styles.headerMainCountNumber}>{currentSelectedUserInfos?.followers?.length}</Text>
                  <Text style={styles.headerMainCountLabel} numberOfLines={1} ellipsizeMode='tail'>Abonnés</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerMainCountBox} onPress={() => navToFollowers('Followers', {defaultView: 'following'})}>
                  <Text style={styles.headerMainCountNumber}>{currentSelectedUserInfos?.following?.length}</Text>
                  <Text style={styles.headerMainCountLabel} numberOfLines={1} ellipsizeMode='tail'>Abonnements</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.headerInfos}>
              <Text style={styles.headerInfosUsername}>{currentSelectedUserInfos?.fullName}</Text>
              <Text>{currentSelectedUserInfos?.bio}</Text>
              <Text style={styles.headerInfosLink} onPress={() => console.log('test')}>{currentSelectedUserInfos?.link}</Text>
            </View>
            {
              currentUserInfos?.following.find(followingId => followingId == currentSelectedUserInfos._id) !== undefined
              ?
              <TouchableOpacity style={styles.headerUnfollowButton} onPress={() => Unfollow_User()}>
                <Text style={styles.headerUnfollowButtonText}>Abonné(e)</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={[styles.headerFollowButton, {backgroundColor: primary}]} onPress={() => Follow_User()}>
                <Text style={styles.headerFollowButtonText}>S'abonner</Text>
              </TouchableOpacity>
            }
            {/* <Text>{pickedImagePath}</Text> */}
          </View>
          <View style={styles.postContainer}>
            <View style={styles.postLinks}>
              <TouchableOpacity style={postViewActive == 'galery' ? styles.postLinkActive : styles.postLink} onPress={() => setPostViewActive('galery')}>
                <Svg width={28} height={28} fill='#000' viewBox="0 0 512 512">
                  <Path d="M422.36 82.61h-330c-5.523 0-10 4.477-10 10v330c0 5.522 4.477 10 10 10h330c5.522 0 10-4.478 10-10v-330c0-5.523-4.477-10-10-10zm-320 130h90v90h-90zm110 0h90v90h-90zm110 0h90v90h-90zm90-20h-90v-90h90zm-110 0h-90v-90h90zm-200-90h90v90h-90zm0 220h90v90h-90zm110 0h90v90h-90zm200 90h-90v-90h90z" />
                </Svg>
              </TouchableOpacity>
              <TouchableOpacity style={postViewActive == 'identified' ? styles.postLinkActive : styles.postLink} onPress={() => setPostViewActive('identified')}>
                <Svg width={28} height={28} fill='#000' viewBox="0 0 512 512">
                  <Path d="M256.11 152.61c-44.112 0-80 35.888-80 80s35.888 80 80 80c44.113 0 80-35.888 80-80s-35.887-80-80-80zm0 140c-33.084 0-60-26.916-60-60s26.916-60 60-60 60 26.916 60 60-26.916 60-60 60z" />
                  <Path d="M424.86 92.61H298.104l-32.106-55.039a10 10 0 0 0-17.276.001L216.616 92.61H89.86c-26.191 0-47.5 21.309-47.5 47.5v295c0 26.191 21.309 47.5 47.5 47.5h335c26.191 0 47.5-21.309 47.5-47.5v-295c0-26.191-21.308-47.5-47.5-47.5zm-285.5 370v-71.5c0-26.743 22.257-48.5 49-48.5h135.5c26.743 0 48.5 21.757 48.5 48.5v71.5zm313-27.5c0 15.163-12.337 27.5-27.5 27.5h-32.5v-71.5c0-37.771-30.729-68.5-68.5-68.5h-135.5c-37.771 0-69 30.729-69 68.5v71.5h-29.5c-15.164 0-27.5-12.337-27.5-27.5v-295c0-15.163 12.336-27.5 27.5-27.5h132.5a10 10 0 0 0 8.638-4.962l26.363-45.191 26.362 45.192a10 10 0 0 0 8.638 4.961h132.5c15.163 0 27.5 12.337 27.5 27.5v295z" />
                </Svg>
              </TouchableOpacity>
            </View>
            <View style={styles.postImages}>
            {
              allUserPosts.map((post, postIndex) => (
                <TouchableOpacity style={styles.postImageTouchable} onPress={() => navToPosts('PostList', {defaultPostList: allUserPosts, selectedPostIndex: postIndex})} key={postIndex}>
                  <Image style={styles.postImage} source={{uri: post.images[0].link}} />
                </TouchableOpacity>
              ))
            }
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const HORIZONTAL_PADDING = 12
const AVATAR_DIMENSION = 80
const AVATAR_DIMENSION_MARGIN_RIGHT = 16

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: HORIZONTAL_PADDING
  },
  navContainer: {
    width: Dimensions.get('window').width - 15,
    height: 60,
    // backgroundColor: 'pink',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    position: 'relative',
    bottom: 2
  },
  iconsContainer: {
    flexDirection: 'row'
  },
  headerContainer: {
    width: Dimensions.get('window').width,
    flexDirection: 'column'
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12
  },
  headerMainAvatar: {
    width: AVATAR_DIMENSION,
    height: AVATAR_DIMENSION,
    borderRadius: AVATAR_DIMENSION / 2,
    marginRight: AVATAR_DIMENSION_MARGIN_RIGHT
  },
  headerMainCountContainer: {
    width: Dimensions.get('window').width - (HORIZONTAL_PADDING * 2) - AVATAR_DIMENSION - AVATAR_DIMENSION_MARGIN_RIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerMainCountBox: {
    width: '30%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerMainCountNumber: {
    fontSize: 19,
    fontWeight: 'bold'
  },
  headerMainCountLabel: {
    fontWeight: 'normal'
  },
  headerInfos: {
    flexDirection: 'column',
    marginBottom: 12
  },
  headerInfosUsername: {
    fontWeight: 'bold'
  },
  headerInfosLink: {
    color: '#00376b'
  },
  headerUnfollowButton: {
    width: Dimensions.get('window').width - (HORIZONTAL_PADDING * 2),
    padding: 6,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  headerUnfollowButtonText: {
    fontWeight: 'bold'
  },
  headerFollowButton: {
    width: Dimensions.get('window').width - (HORIZONTAL_PADDING * 2),
    padding: 6,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  headerFollowButtonText: {
    fontWeight: 'bold',
    color: '#fff'
  },
  postContainer: {
    width: Dimensions.get('window').width,
    position: 'relative',
    right: HORIZONTAL_PADDING,
    marginTop: 12,
    marginBottom: 8,
    flexDirection: 'column'
  },
  postLinks: {
    width: '100%',
    height: 50,
    flexDirection: 'row'
  },
  postLink: {
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postLinkActive: {
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#262626'
  },
  postImages: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  postImageTouchable: {
    width: (Dimensions.get('window').width / 3) - 4,
    height: (Dimensions.get('window').width / 3) - 4,
    backgroundColor: 'grey',
    marginRight: 4,
    marginTop: 4
  },
  postImage: {
    width: (Dimensions.get('window').width / 3) - 4,
    height: (Dimensions.get('window').width / 3) - 4,
  }
});

export default AnyProfile