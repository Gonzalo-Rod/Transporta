import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import VehicleSelectionList from './VehicleSelectionList';

const vehicles = [
  {
    id: '1',
    name: 'Van',
    time: '30 min - 40 min',
    dimension: '2.5 × 1.7 × 1.5',
    price: 40,
    image: require('../../assets/Van.png'),
  },
  {
    id: '2',
    name: 'Furgoneta',
    time: '20 min - 40 min',
    dimension: '3.5 × 2.0 × 2.0',
    price: 70,
    image: require('../../assets/Furgoneta.png'),
  },
  {
    id: '3',
    name: 'Camion',
    time: '1h - 1:30h',
    dimension: '6.5 × 2.5 × 2.5',
    price: 100,
    image: require('../../assets/Camion.png'),
  },
  {
    id: '4',
    name: 'Flete',
    time: '1h - 1:30h',
    dimension: '6.5 × 2.5 × 2.5',
    price: 300,
    image: require('../../assets/Flete.png'),
  },
];

const getCurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const getCurrentTime = () => {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const VehicleList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { inicio, llegada } = route.params;

  const handleContinue = () => {
    navigation.navigate('ServiceDetails', {
      inicio,
      llegada,
      fecha: getCurrentDate(),
      hora: getCurrentTime(),
    });
  };

  return (
    <VehicleSelectionList
      vehicles={vehicles}
      initialSelectedId={vehicles[0]?.id}
      onContinue={handleContinue}
      continueTestID="vehicle-continue"
      cardTestIDPrefix="vehicle-card"
    />
  );
};

export default VehicleList;
