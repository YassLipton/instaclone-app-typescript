import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, SafeAreaView, Image, Button, StatusBar, ScrollView, Platform, ImageBackground, TouchableWithoutFeedback, TextInput, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import API_URI from '../../API_URI';
import AuthContext from '../context/auth-context';
import ThemeContext from '../context/theme-context';
import {Text, View, TouchableOpacity} from '../elements'
import { RootStackParamList } from '../stack/MainStack';
import Loading from './Loading';

type mainScreenProp = StackNavigationProp<RootStackParamList, 'SignUp'>

const SignUp = () => {
  const { signIn } = React.useContext(AuthContext)
  const { mode, setMode, theme } = React.useContext(ThemeContext)
  const { card } = theme.colors
  const [fontLoaded] = useFonts({
    Fontspring: require('../../assets/fonts/Fontspring-DEMO-blue_vinyl_regular_ps_ot.otf')
  })

  const { navigate } = useNavigation<mainScreenProp>()

  const [phoneOrEmail, setPhoneOrEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isKeyboardOpen, setKeyboardState] = useState(false)

  const Submit = async () => {
    const request = await fetch(`${API_URI}/user/register`, {
      method: "POST",
      body: JSON.stringify({
        phoneOrEmail: phoneOrEmail,
        fullName: fullName,
        username: username,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request
    if (response.status == 201) {
      const responseJson = await request.json()
      signIn(responseJson.accessToken)
    } else {
      Alert.alert("Une erreur c'est produite. \nVeuillez réessayer.")
    }
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardState(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardState(false));

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [fontLoaded])

  const SwitchTheme = () => {
    mode == 'light' ? setMode('dark') : setMode('light')
  }

  return (
    fontLoaded
    ?
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView style={{backgroundColor: card}}>
        <View isCard>
          <View style={styles.form}>
            <Text style={styles.title}>Instaclone</Text>
            <TextInput
              style={styles.input}
              placeholder='Numéro de mobile ou e-mail'
              placeholderTextColor={'grey'}
              onChangeText={setPhoneOrEmail}
            />
            <TextInput
              style={styles.input}
              placeholder='Nom complet'
              placeholderTextColor={'grey'}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              placeholderTextColor={'grey'}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder='Mot de passe'
              placeholderTextColor={'grey'}
              secureTextEntry={true}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={phoneOrEmail.length == 0 || fullName.length == 0 || username.length == 0 || password.length == 0 ? styles.buttonDisabled : styles.button} onPress={Submit} disabled={phoneOrEmail.length == 0 || fullName.length == 0 || username.length == 0 || password.length == 0}>
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
          {/* <Text>SignIn</Text>
          <Button
            title='SignIn'
            onPress={() => signIn('test')}
          />
          <Button
            title='set dark theme'
            onPress={() => setMode('dark')}
          />
          <Button
            title='set light theme'
            onPress={() => setMode('light')}
          />
          <Text>{mode}</Text> */}
        </View>
      </ScrollView>
      {!isKeyboardOpen && 
      <View style={styles.footer}>
        <Text style={styles.footerText}>Vous avez déjà un compte ? <Text style={styles.footerTextLink} onPress={() => navigate('SignIn')}>Connectez-vous</Text></Text>
      </View>}
    </KeyboardAvoidingView>
    :
    <Loading />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  form: {
    marginTop: 100,
    paddingBottom: 20,
    flexDirection: 'column',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Fontspring',
    fontSize: 42,
    marginBottom: 20
  },
  input: {
    width: Dimensions.get('window').width * 0.85,
    marginTop: 16,
    backgroundColor: '#00000005',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 12,
    paddingLeft: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dbdbdb'
  },
  button: {
    width: Dimensions.get('window').width * 0.85,
    marginTop: 16,
    backgroundColor: '#0095f6',
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 12,
    paddingLeft: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonDisabled: {
    width: Dimensions.get('window').width * 0.85,
    marginTop: 16,
    backgroundColor: '#0095f660',
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 12,
    paddingLeft: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  footer: {
    width: Dimensions.get('window').width,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerText: {
    color: 'grey',
    fontSize: 13
  },
  footerTextLink: {
    color: '#00376b',
    fontWeight: 'bold'
  }
})

export default SignUp