import React, { useMemo } from 'react';
import { View } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import MapDetails from '../components/HomeMap/Map';
import Card from '../components/HomeMap/Card';
import BottomSheet from '@gorhom/bottom-sheet';

const HomeScreen = () => {
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  return (
    <View>
      <View style={tw`h-full`}>
        <MapDetails />
      </View>

      <BottomSheet index={1} snapPoints={snapPoints}>
        <Card />
      </BottomSheet>
    </View>
  );
};

export default HomeScreen;
