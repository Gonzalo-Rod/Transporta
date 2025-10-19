import React from 'react'
import { StyleSheet, View } from 'react-native'
import MapView from 'react-native-maps'

const HomeMap = () => {
  return (
    <View>
      <MapView
        testID="home-map"
        style={styles.map}
        initialRegion={{
          latitude: -12.05677,
          longitude: -77.0269,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
};

export default HomeMap

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%'
    }
})
