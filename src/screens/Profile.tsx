import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Image, TouchableOpacity, Button, ActivityIndicator, ScrollView } from 'react-native';
import ThemeContext from '../context/theme-context';
import { Text, View } from '../elements';
import profile from '../../assets/images/profile.jpg'
import Svg, { Path } from 'react-native-svg';
import { Post } from '../models';
import API_URI from '../../API_URI';
import AuthContext from '../context/auth-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../stack/MainStack';
import * as ImagePicker from 'expo-image-picker';

type mainScreenProp = StackNavigationProp<RootStackParamList, 'Profile'>

const Profile = () => {
  const { userInfos } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const { background, card } = theme.colors
  const [postViewActive, setPostViewActive] = useState('galery')
  const [isLoading, setLoading] = useState<boolean>(true)
  const [allUserPosts, setAllUserPosts] = useState<Post[]>([])

  const { navigate, addListener } = useNavigation<mainScreenProp>()

  const navToPosts: (screen: string, route: {defaultPostList: Post[], selectedPostIndex?: number}) => void = navigate

  const navToFollowers: (screen: string, route: {defaultView: "followers" | "following"}) => void = navigate

  useEffect(() => {
    console.log(userInfos)
    const Posts_Listing = async () => {
      const request = await fetch(`${API_URI}/post/listByUser/${userInfos?._id}`)
      const responseJson = await request.json()
      setAllUserPosts(responseJson)
    }
    addListener('focus', Posts_Listing)
    Posts_Listing()
    setLoading(false)
  }, [])

  return (
    <ScrollView style={{backgroundColor: card}}>
      <View style={styles.container} isCard>
        <View style={styles.headerContainer}>
          <View style={styles.headerMain}>
            <Image style={styles.headerMainAvatar} source={{uri: userInfos?.profilePicUrl}} />
            <View style={styles.headerMainCountContainer}>
              <TouchableOpacity style={styles.headerMainCountBox} onPress={() => console.log(userInfos)}>
                <Text style={styles.headerMainCountNumber}>{allUserPosts.length}</Text>
                <Text style={styles.headerMainCountLabel} numberOfLines={1} ellipsizeMode='tail'>Publications</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerMainCountBox} onPress={() => navToFollowers('Followers', {defaultView: 'followers'})}>
                <Text style={styles.headerMainCountNumber}>{userInfos?.followers?.length}</Text>
                <Text style={styles.headerMainCountLabel} numberOfLines={1} ellipsizeMode='tail'>Abonnés</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerMainCountBox} onPress={() => navToFollowers('Followers', {defaultView: 'following'})}>
                <Text style={styles.headerMainCountNumber}>{userInfos?.following?.length}</Text>
                <Text style={styles.headerMainCountLabel} numberOfLines={1} ellipsizeMode='tail'>Abonnements</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerInfos}>
            <Text style={styles.headerInfosUsername}>{userInfos?.fullName}</Text>
            <Text>{userInfos?.bio}</Text>
            <Text style={styles.headerInfosLink} onPress={() => console.log('test')}>{userInfos?.link}</Text>
          </View>
          <TouchableOpacity style={styles.headerEditButton} onPress={() => navigate('EditProfile')}>
            <Text style={styles.headerEditButtonText}>Modifier profil</Text>
          </TouchableOpacity>
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
  headerEditButton: {
    width: Dimensions.get('window').width - (HORIZONTAL_PADDING * 2),
    padding: 6,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  headerEditButtonText: {
    fontWeight: 'bold'
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

export default Profile