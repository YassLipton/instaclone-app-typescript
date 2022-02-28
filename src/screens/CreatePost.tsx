import { RouteProp, useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import React, { useContext, useState } from "react"
import { Dimensions, Image, StyleSheet, TextInput } from "react-native"
import Svg, { Path } from "react-native-svg"
import Icon from "react-native-vector-icons/Ionicons"
import AuthContext from "../context/auth-context"
import ThemeContext from "../context/theme-context"
import { Text, TouchableOpacity, View } from "../elements"
import { User } from "../models"
import { RootStackParamList } from "../stack/MainStack"
import AutoHeightImage from 'react-native-auto-height-image'
import API_URI from "../../API_URI"

type mainScreenProp = StackNavigationProp<RootStackParamList, 'EditProfile'>

const CreatePost = (props: {
  route: RouteProp<{ 
    params: { 
      image: {
        uri: string,
        name: string,
        type: string
      }
    } 
  }, 'params'>,
}) => {
  const [captionText, setCaptionText] = useState<string>('')
  const [locationText, setLocationText] = useState<string>('')

  const { userInfos, signIn } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const { text, card } = theme.colors

  const { navigate, goBack } = useNavigation<mainScreenProp>()

  const { image } = props.route.params

  const createFormData = (image: any, body: { [key: string]: string } = {}): FormData => {
    const data = new FormData();
  
    data.append('image', image);
  
    Object.keys(body).forEach((key: string) => {
      data.append(key, body[key]);
    });
  
    return data;
  }

  const Create_Post = (): void => {
    fetch(`${API_URI}/post/create`, {
      method: 'POST',
      body: createFormData(image, {
        userId: userInfos?._id || '',
        caption: captionText,
        location: locationText
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        navigate('ProfileStack')
      })
      .catch((error) => {
        console.log('error', error)
      })
  }

  return (
    <View style={styles.container} isCard>
      <View style={styles.headerBar}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity>
            <Svg width={26} height={26} fill={text} viewBox="0 0 24 24" onPress={goBack}>
              <Path d="M22 11H4.414l5.293-5.293a1 1 0 1 0-1.414-1.414l-7 7a1 1 0 0 0 0 1.414l7 7a1 1 0 0 0 1.414-1.414L4.414 13H22a1 1 0 0 0 0-2z" />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouvelle publication</Text>
        </View>
        <TouchableOpacity onPress={Create_Post}>
          <Icon name='checkmark' size={34} color='#0095f6'/>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.formRow}>
          <AutoHeightImage
            width={Dimensions.get('window').width * 0.2}
            source={{uri: image.uri}}
          />
          <TextInput 
            onChangeText={setCaptionText}
            placeholder="Ajouter une légende..."
            placeholderTextColor={'#bababa'}
            style={styles.captionInput}
            multiline
          />
        </View>
        <View style={styles.formRow}>
          <TextInput 
            defaultValue="Identifier des personnes"
            placeholder="Identifier des personnes"
            placeholderTextColor={'#bababa'}
            style={[styles.locationInput, {color: text}]}
            multiline
            editable={false}
          />
        </View>
        <View style={styles.formRow}>
          <TextInput 
            onChangeText={setLocationText}
            placeholder="Ajouter un lieu"
            placeholderTextColor={text}
            style={[styles.locationInput, {color: text}]}
            multiline
          />
        </View>
      </View>
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
    paddingLeft: 14,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    marginLeft: 28,
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
    marginTop: 12
  },
  formRow: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.9,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    alignItems: 'center'
  },
  captionInput: {
    marginLeft: 12,
    fontSize: 16
  },
  locationInput: {
    fontSize: 16
  }
})

export default CreatePost