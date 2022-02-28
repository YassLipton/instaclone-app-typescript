import React, { useEffect } from "react"
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native"
import Svg, { Path } from "react-native-svg"
import { Text, View } from "."
import ThemeContext from "../context/theme-context"

const BasicCustomHeader = (props: {
  name: string,
  children: string
}) => {
  const { theme } = React.useContext(ThemeContext)
  const { text } = theme.colors

  const { name, children } = props

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <TouchableOpacity>
        <Svg width={24} height={24} fill={text} style={{marginLeft: 16}} viewBox="0 0 512 512">
          <Path d="M448.279 66.692a10 10 0 0 0-10.343-2.378L70.241 191.593a9.999 9.999 0 0 0-1.517 18.228l152.981 83.444 83.444 152.98a10.003 10.003 0 0 0 9.608 5.178 10.003 10.003 0 0 0 8.621-6.694l127.28-367.695a10.003 10.003 0 0 0-2.379-10.342zm-44.885 30.743L227.295 273.533 98.156 203.094zm-91.517 319.378-70.439-129.138 176.099-176.1z" />
        </Svg>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 80,
    height: '100%',
    // backgroundColor: 'pink',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  iconsContainer: {
    flexDirection: 'row'
  }
})

export default BasicCustomHeader