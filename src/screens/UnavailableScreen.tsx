import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Image, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { Text, View } from '../elements';

const UnavailableScreen = () => {
  return (
    <View style={styles.fullPage}>
      <Text style={styles.title}>Cette page n'est pas disponible pour le moment</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  fullPage: {
    flex: 1,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    position: 'relative',
    bottom: 16
  }
});

export default UnavailableScreen