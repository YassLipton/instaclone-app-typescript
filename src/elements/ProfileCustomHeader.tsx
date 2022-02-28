import { useFonts } from "expo-font"
import React, { useEffect } from "react"
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native"
import Svg, { Path } from "react-native-svg"
import { Text, View } from "."
import AuthContext from "../context/auth-context"
import ThemeContext from "../context/theme-context"
import Loading from "../screens/Loading"

const ProfileCustomHeader = () => {
  const { userInfos, signOut } = React.useContext(AuthContext)
  const { theme } = React.useContext(ThemeContext)
  const { text } = theme.colors
  const [fontLoaded] = useFonts({
    Fontspring: require('../../assets/fonts/Fontspring-DEMO-blue_vinyl_regular_ps_ot.otf')
  })

  return (
    fontLoaded
    ?
    <View style={styles.container}>
      <Text style={styles.title}>{userInfos?.username}</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity>
          <Svg width={24} height={24} fill={text} style={{marginLeft: 16}}  viewBox="0 0 512 512">
            <Path d="M367.36 247.61h-100v-100c0-5.523-4.478-10-10-10-5.523 0-10 4.477-10 10v100h-100c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10h100v100c0 5.522 4.477 10 10 10 5.522 0 10-4.478 10-10v-100h100c5.522 0 10-4.478 10-10 0-5.523-4.477-10-10-10z" />
            <Path d="M374.36 57.61h-234c-43.078 0-78 34.922-78 78v244c0 43.078 34.922 78 78 78h234c43.078 0 78-34.922 78-78v-244c0-43.078-34.922-78-78-78zm58 322c0 32.032-25.968 58-58 58h-234c-32.033 0-58-25.968-58-58v-244c0-32.033 25.967-58 58-58h234c32.032 0 58 25.967 58 58z" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity>
          <Svg width={20} height={20} fill={text} style={{marginLeft: 20, position: 'relative', top: 2}} viewBox="0 0 512 512" onPress={signOut}>
            <Path d="M255.15 468.625H63.787c-11.737 0-21.262-9.526-21.262-21.262V64.638c0-11.737 9.526-21.262 21.262-21.262H255.15c11.758 0 21.262-9.504 21.262-21.262S266.908.85 255.15.85H63.787C28.619.85 0 29.47 0 64.638v382.724c0 35.168 28.619 63.787 63.787 63.787H255.15c11.758 0 21.262-9.504 21.262-21.262 0-11.758-9.504-21.262-21.262-21.262z" />
            <Path d="M505.664 240.861 376.388 113.286c-8.335-8.25-21.815-8.143-30.065.213s-8.165 21.815.213 30.065l92.385 91.173H191.362c-11.758 0-21.262 9.504-21.262 21.262 0 11.758 9.504 21.263 21.262 21.263h247.559l-92.385 91.173c-8.377 8.25-8.441 21.709-.213 30.065a21.255 21.255 0 0 0 15.139 6.336c5.401 0 10.801-2.041 14.926-6.124l129.276-127.575A21.303 21.303 0 0 0 512 255.998c0-5.696-2.275-11.118-6.336-15.137z" />
          </Svg>
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <Svg width={22} height={24} fill={text} style={{marginLeft: 20}} viewBox="0 -53 384 384">
            <Path d="M368 154.668H16c-8.832 0-16-7.168-16-16s7.168-16 16-16h352c8.832 0 16 7.168 16 16s-7.168 16-16 16zM368 32H16C7.168 32 0 24.832 0 16S7.168 0 16 0h352c8.832 0 16 7.168 16 16s-7.168 16-16 16zM368 277.332H16c-8.832 0-16-7.168-16-16s7.168-16 16-16h352c8.832 0 16 7.168 16 16s-7.168 16-16 16zm0 0" />
          </Svg>
        </TouchableOpacity> */}
      </View>
    </View>
    :
    <Loading />
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 30,
    height: '100%',
    // backgroundColor: 'pink',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  iconsContainer: {
    flexDirection: 'row'
  }
})

export default ProfileCustomHeader