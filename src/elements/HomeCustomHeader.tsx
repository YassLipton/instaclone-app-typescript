import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useFonts } from "expo-font"
import * as ImagePicker from 'expo-image-picker'
import React, { useContext, useEffect, useState } from "react"
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native"
import Svg, { Path } from "react-native-svg"
import { Text, View } from "."
import AuthContext from "../context/auth-context"
import ThemeContext from "../context/theme-context"
import Loading from "../screens/Loading"
import { RootStackParamList } from "../stack/MainStack"

type mainScreenProp = StackNavigationProp<RootStackParamList, 'Home'>

const HomeCustomHeader = () => {
  const [imageToUpload, setImageToUpload] = useState<object>()
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('')

  const { userInfos, signIn } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const { text } = theme.colors
  const [fontLoaded] = useFonts({
    Fontspring: require('../../assets/fonts/Fontspring-DEMO-blue_vinyl_regular_ps_ot.otf')
  })

  const { navigate } = useNavigation<mainScreenProp>()

  const goToPostCreatingView: (screen: string, route: {image: { uri: string, name: string, type: string }}) => void = navigate

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    const ext = pickerResult.uri.substring(pickerResult.uri.length - 3, pickerResult.uri.length)
    
    const currentType = () => {
      if (ext == 'png') {
        return 'image/png'
      } else if (ext == 'jpg' || ext == 'jpeg') {
        return 'image/jpeg'
      } else {
        return 'image'
      }
    }
    const type = currentType()

    setImageToUpload({
      uri: pickerResult.uri,
      name: `${userInfos?.username}`,
      type: type
    })
    setPreviewImageUrl(pickerResult.uri);

    goToPostCreatingView('CreatePost', {
      image: 
        {
        uri: pickerResult.uri,
        name: `${userInfos?.username}`,
        type: type
      }
    })
  }

  return (
    fontLoaded
    ?
    <View style={styles.container}>
      <Text style={styles.title}>Instaclone</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity>
          <Svg width={24} height={24} fill={text} style={{marginLeft: 16}}  viewBox="0 0 512 512" onPress={() => openImagePickerAsync()}>
            <Path d="M367.36 247.61h-100v-100c0-5.523-4.478-10-10-10-5.523 0-10 4.477-10 10v100h-100c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10h100v100c0 5.522 4.477 10 10 10 5.522 0 10-4.478 10-10v-100h100c5.522 0 10-4.478 10-10 0-5.523-4.477-10-10-10z" />
            <Path d="M374.36 57.61h-234c-43.078 0-78 34.922-78 78v244c0 43.078 34.922 78 78 78h234c43.078 0 78-34.922 78-78v-244c0-43.078-34.922-78-78-78zm58 322c0 32.032-25.968 58-58 58h-234c-32.033 0-58-25.968-58-58v-244c0-32.033 25.967-58 58-58h234c32.032 0 58 25.967 58 58z" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity>
          <Svg width={24} height={24} fill={text} style={{marginLeft: 16}} viewBox="0 0 512 512">
            <Path d="M366.763 52.242c-55.361 0-84.61 26.631-109.467 70.722-24.856-44.091-54.105-70.722-109.466-70.722-65.874 0-119.466 53.593-119.466 119.467 0 40.249 13.648 76.775 42.952 114.948 25.864 33.693 62.063 66.07 100.388 100.348 25.502 22.809 51.872 46.395 78.522 73.045a9.972 9.972 0 0 0 7.071 2.929 9.97 9.97 0 0 0 7.071-2.929c26.688-26.689 53.104-50.305 78.65-73.143 38.32-34.258 74.515-66.616 100.381-100.295 29.308-38.16 42.958-74.672 42.958-114.903-.001-65.874-53.65-119.467-119.594-119.467zm-37.075 319.755c-23.507 21.015-47.744 42.683-72.393 66.901-24.606-24.18-48.797-45.816-72.26-66.801-76.358-68.296-136.672-122.241-136.672-200.388 0-54.847 44.62-99.467 99.466-99.467 46.532 0 71.897 19.322 100.522 76.572a10 10 0 0 0 17.888 0c28.626-57.25 53.991-76.572 100.522-76.572 54.916 0 99.594 44.62 99.594 99.467.001 78.106-60.31 132.024-136.667 200.288z" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity>
          <Svg width={24} height={24} fill={text} style={{marginLeft: 16}}  viewBox="0 0 512 512">
            <Path d="M448.279 66.692a10 10 0 0 0-10.343-2.378L70.241 191.593a9.999 9.999 0 0 0-1.517 18.228l152.981 83.444 83.444 152.98a10.003 10.003 0 0 0 9.608 5.178 10.003 10.003 0 0 0 8.621-6.694l127.28-367.695a10.003 10.003 0 0 0-2.379-10.342zm-44.885 30.743L227.295 273.533 98.156 203.094zm-91.517 319.378-70.439-129.138 176.099-176.1z" />
          </Svg>
        </TouchableOpacity>
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
    fontFamily: 'Fontspring',
    fontSize: 25
  },
  iconsContainer: {
    flexDirection: 'row'
  }
})

export default HomeCustomHeader