import React, { useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "../elements";
import * as ImagePicker from 'expo-image-picker'
import { Dimensions, Image, KeyboardAvoidingView, ScrollView, StyleSheet, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import profile from '../../assets/images/profile.jpg'
import ThemeContext from "../context/theme-context";
import AuthContext from "../context/auth-context";
import { User } from "../models";
import API_URI from "../../API_URI";
import SignIn from "./SignIn";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../stack/MainStack";

type mainScreenProp = StackNavigationProp<RootStackParamList, 'EditProfile'>

const EditProfile = () => {
  const [selectedImage, setSelectedImage] = React.useState<{[localeUri: string]: string} | null>(null);
  const [imageToUpload, setImageToUpload] = useState<object>()
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('')

  const { userInfos, signIn } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const { text, card } = theme.colors

  const { navigate } = useNavigation<mainScreenProp>()

  const [fullName, setFullName] = useState(userInfos?.fullName)
  const [username, setUsername] = useState(userInfos?.username)
  const [link, setLink] = useState(userInfos?.link)
  const [bio, setBio] = useState(userInfos?.bio)

  const createFormData = (image: any, body: { [key: string]: string } = {}): FormData => {
    const data = new FormData();
  
    data.append('image', image);
  
    Object.keys(body).forEach((key: string) => {
      data.append(key, body[key]);
    });
  
    return data;
  }

  const Update_User = async () => {
    console.log(`${API_URI}/user/update/${userInfos?._id}`)
    console.log(createFormData(imageToUpload, { 
      fullName: fullName || '', 
      username: username || '', 
      link: link || '', 
      bio: bio || '' 
    }))
    const request = await fetch(`${API_URI}/user/update/${userInfos?._id}`, {
      method: "PUT",
      body: JSON.stringify({ 
        fullName: fullName || '', 
        username: username || '', 
        link: link || '', 
        bio: bio || '' 
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const status = await request.status
    const responseJson = await request.json()
    if (status == 200) {
      console.log(responseJson)
      signIn(responseJson.accessToken)
      navigate('Profile')
    }
  }

  const Update_User2 = () => {
    console.log(`${API_URI}/user/update/${userInfos?._id}`)
    fetch(`${API_URI}/user/update/${userInfos?._id}`, {
      method: 'PUT',
      body: createFormData(imageToUpload, { 
        fullName: fullName || '', 
        username: username || '', 
        link: link || '', 
        bio: bio || '' 
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        signIn(responseJson.accessToken)
        navigate('Profile')
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

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
  }

  const openCamera = async () => {
    
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    console.log(result);

    if (!result.cancelled) {
      setPreviewImageUrl(result.uri);
      console.log(result.uri);
    }
  }

  return (
    <View style={styles.container} isCard>
      <View style={styles.headerBar}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity>
            <Icon name='close-outline' size={38} onPress={() => navigate('Profile')}/>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifier profil</Text>
        </View>
        <TouchableOpacity>
          <Icon name='checkmark' size={34} color='#0095f6' onPress={() => Update_User2()}/>
        </TouchableOpacity>
      </View>
      <ScrollView style={{backgroundColor: card}}>
        <View>
          <View style={styles.avatarContainer}>
            <Image style={styles.avatarImage} source={{uri: previewImageUrl == '' ? userInfos?.profilePicUrl : previewImageUrl}} />
            <TouchableOpacity onPress={() => openImagePickerAsync()}>
              <Text style={styles.avatarButtonText}>Changer la photo de profil</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.formBox}>
              <Text style={styles.formLabel}>Nom</Text>
              <TextInput 
                value={fullName}
                onChangeText={setFullName}
                style={[styles.formInput, {color: text}]}
              />
            </View>
            <View style={styles.formBox}>
              <Text style={styles.formLabel}>Nom d'utilisateur</Text>
              <TextInput 
                value={username}
                onChangeText={setUsername}
                style={[styles.formInput, {color: text}]}
              />
            </View>
            <View style={styles.formBox}>
              <Text style={styles.formLabel}>Site web</Text>
              <TextInput 
                value={link}
                onChangeText={setLink}
                style={[styles.formInput, {color: text}]}
              />
            </View>
            <View style={styles.formBox}>
              <Text style={styles.formLabel}>Bio</Text>
              <TextInput 
                value={bio}
                onChangeText={setBio}
                style={[styles.formInput, {color: text}]}
                multiline
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  headerBar: {
    width: Dimensions.get('window').width,
    height: 50,
    paddingLeft: 6,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    marginLeft: 18,
    fontSize: 20,
    fontWeight: 'bold'
  },
  avatarContainer: {
    width: Dimensions.get('window').width,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dbdbdb'
  },
  avatarButtonText: {
    fontSize: 18,
    color: '#0095f6'
  },
  formContainer: {
    width: Dimensions.get('window').width,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'column',
    alignItems: 'center'
  },
  formBox: {
    flexDirection: 'column',
    marginBottom: 16
  },
  formLabel: {
    color: 'grey',
    fontSize: 12
  },
  formInput: {
    width: Dimensions.get('window').width * 0.9,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    fontSize: 16,
    marginTop: 4,
    paddingBottom: 6
  }
})

export default EditProfile