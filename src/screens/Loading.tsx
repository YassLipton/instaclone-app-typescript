import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Image, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { View } from '../elements';

const Loading = () => {
  return (
    <View style={styles.fullPage}>
      <ActivityIndicator size="large" />
    </View>
  )
}

const styles = StyleSheet.create({
  fullPage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default Loading