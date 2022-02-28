import React, { useContext, useEffect, useReducer, useState } from "react";
import { Dimensions, Image, Platform, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import ThemeContext from "../context/theme-context";
import { Text, View } from "../elements";
import profile from '../../assets/images/profile.jpg'
import { User } from "../models";
import AuthContext from "../context/auth-context";
import API_URI from "../../API_URI";
import { RouteProp } from "@react-navigation/native";

const Followers = (props: {
  route: RouteProp<{ 
    params: { 
      defaultView: "followers" | "following"
    } 
  }, 'params'>,
}) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const { defaultView } = props.route.params
  const [activeView, setActiveView] = useState<"followers" | "following">(defaultView)
  const [followedUsers, setFollowedUsers] = useState<User[]>([])

  const { userInfos, signIn } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const { text, primary } = theme.colors

  const [currentUserInfos, setCurrentUserInfos] = useState<User | undefined>()

  useEffect(() => {
    setCurrentUserInfos(userInfos)
    Followed_Users()
  }, [])

  const Followed_Users = async () => {
    if (userInfos) {
      let followedUsersList = []
      for (let followedUserId of userInfos?.following) {
        const request = await fetch(`${API_URI}/user/${followedUserId}`)
        const responseJson = await request.json()
        followedUsersList.push(responseJson)
      }
      setFollowedUsers(followedUsersList)
    }
  }

  const Unfollow_User = async (userToUnfollow: User) => {
    if (currentUserInfos) {
      const id = userToUnfollow._id
      const index = currentUserInfos.following.indexOf(id)
      currentUserInfos?.following.splice(index, 1)
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
        console.log(responseJson)
        signIn(responseJson.accessToken)
        setCurrentUserInfos(currentUserInfos)
        forceUpdate()
      }
    }
  }

  const Follow_User = async (userToFollow: User) => {
    userToFollow?.followers.push(userInfos!._id)
    const request = await fetch(`${API_URI}/user/update/${userToFollow?._id}`, {
      method: "PUT",
      body: JSON.stringify({
        followers: userToFollow.followers
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    userInfos?.following.push(userToFollow!._id)
    if (response.status == 200) {
      const request2 = await fetch(`${API_URI}/user/update/${userToFollow?._id}`, {
        method: "PUT",
        body: JSON.stringify(userToFollow),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const response2 = await request2
    }
  }

  return (
    <View style={styles.container} isBackgrounded>
      <View style={styles.nav}>
        <TouchableOpacity style={[styles.navLink, activeView == 'followers' ? {borderBottomWidth: 1, borderBottomColor: text} : undefined]} onPress={() => setActiveView('followers')}>
          <Text style={activeView == 'followers' ? styles.textStrong : styles.navLinkText}>{userInfos?.followers.length} abonnés</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navLink, activeView == 'following' ? {borderBottomWidth: 1, borderBottomColor: text} : undefined]} onPress={() => setActiveView('following')}>
          <Text style={activeView == 'following' ? styles.textStrong : styles.navLinkText}>{userInfos?.following.length} abonnements</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <ScrollView>
          <View style={styles.mainSort}>
            <Text style={styles.mainSortText}>Trié par <Text style={styles.mainSortTextStrong}>Par défault</Text></Text>
            <TouchableOpacity>
              <Svg width={22} height={22} fill={text} viewBox="0 0 500.667 500.667">
                <Path d="M250.333 500.667C112.308 500.667 0 388.359 0 250.333S112.308 0 250.333 0s250.333 112.308 250.333 250.333-112.307 250.334-250.333 250.334zm0-450.6c-110.425 0-200.267 89.841-200.267 200.267S139.908 450.6 250.333 450.6 450.6 360.759 450.6 250.333 360.759 50.067 250.333 50.067zM209.85 373.593c9.363-3.863 15.45-13.006 15.45-23.126V150.2c0-13.837-11.197-25.033-25.033-25.033-13.837 0-25.033 11.197-25.033 25.033v139.835l-7.334-7.334c-9.779-9.779-25.62-9.779-35.399 0s-9.779 25.62 0 35.399l50.067 50.067a25.027 25.027 0 0 0 17.699 7.334 24.836 24.836 0 0 0 9.583-1.908zm115.583-23.126V210.632l7.334 7.334c9.779 9.779 25.62 9.779 35.399 0s9.779-25.62 0-35.399L318.099 132.5a24.916 24.916 0 0 0-27.282-5.427c-9.363 3.863-15.45 13.006-15.45 23.126v200.267c0 13.837 11.197 25.033 25.033 25.033 13.837.001 25.033-11.196 25.033-25.032z" />
              </Svg>
            </TouchableOpacity>
          </View>
        {
          currentUserInfos && followedUsers.map((user, userIndex) => (
            <View style={styles.userBox} key={userIndex}>
              <View style={styles.userBoxInfos}>
                <Image style={styles.userBoxInfosAvatar} source={{uri: user.profilePicUrl}} />
                <View style={styles.userBoxInfosTextColumn}>
                  <Text style={styles.userBoxInfosTextUsername}>{user.username}</Text>
                  <Text style={styles.userBoxInfosTextFullName}>{user.fullName}</Text>
                </View>
              </View>
              <View style={styles.userBoxActions}>
                <TouchableOpacity style={[styles.userBoxActionsFollowButton, {backgroundColor: primary}]} onPress={() => Unfollow_User(user)}>
                  <Text style={styles.userBoxActionsFollowButtonText}>{currentUserInfos.following.find(followingId => followingId == user._id) !== undefined ? "Abonné(e)" : "S'abonner"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.userBoxActionsOptionsButton}>
                  <Svg width={20} height={20} fill={text} viewBox="0 0 32 32">
                    <Circle cx={16} cy={5} r={3} />
                    <Circle cx={16} cy={16} r={3} />
                    <Circle cx={16} cy={27} r={3} />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
          ))
        }
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  nav: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#8e8e8e'
  },
  navLink: {
    width: Dimensions.get('window').width / 2,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navLinkText: {
    color: '#8e8e8e',
    fontWeight: 'bold'
  },
  textStrong: {
    fontWeight: 'bold'
  },
  main: {
    flex: 1,
    width: Dimensions.get('window').width,
    flexDirection: 'column'
  },
  mainSort: {
    width: '100%',
    marginBottom: 10,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  mainSortText: {
    fontSize: 16
  },
  mainSortTextStrong: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  userBox: {
    width: Dimensions.get('window').width,
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userBoxInfos: {
    flexDirection: 'row',
  },
  userBoxInfosAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  userBoxInfosTextColumn: {
    height: 50,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  userBoxInfosTextUsername: {
    fontWeight: 'bold'
  },
  userBoxInfosTextFullName: {
    color: '#8e8e8e'
  },
  userBoxActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userBoxActionsFollowButton: {
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#8e8e8e',
    borderRadius: 4
  },
  userBoxActionsFollowButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: Platform.OS == 'android' ? 'sans-serif-medium' : undefined
  },
  userBoxActionsOptionsButton: {
    position: 'relative',
    left: 6,
    paddingLeft: 6
  }
})

export default Followers
