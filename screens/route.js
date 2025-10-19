import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SearchLocation from '../components/Inputs/searchLocation';

const Route = () => {
  const navigation = useNavigation();
  const [inicio, setInicio] = useState('');
  const [llegada, setLlegada] = useState('');
  const [focusedInput, setFocusedInput] = useState(null); 

  const routes = [
    { id: '1', address: 'Jr. Medrano Silva 165, Barranco', date: '4/9/2024' },
    { id: '2', address: 'Jr. Medrano Silva 165, Barranco', date: '4/9/2024' },
    { id: '3', address: 'Jr. Medrano Silva 165, Barranco', date: '4/9/2024' },
  ];

  const handleRoutePress = (address) => {
    if (focusedInput === 'partida') {
      setInicio(address);    
    } else if (focusedInput === 'destino') {
      setLlegada(address);    
    }
  };

  const renderRoute = ({ item }) => (
    <TouchableOpacity
      testID={`recent-route-${item.id}`}
      onPress={() => handleRoutePress(item.address)}
      style={styles.routeContainer}
    >
      <Image
        source={require('../assets/recent.png')}
        style={styles.icon}
      />
      <View style={styles.routeTextContainer}>
        <Text style={styles.routeText}>{item.address}</Text>
        <Text style={styles.routeDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>

        <TouchableOpacity testID="route-back" onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#6B9AC4" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Selecciona la Ruta</Text>

        <SearchLocation
          placeholder="Buscar partida"
          onFocus={() => setFocusedInput('partida')}
          onLocationSelect={(location) => {
            console.log('Ubicación seleccionada:', location);
            setInicio(location);
          }}
        />
        <SearchLocation
          placeholder="Buscar destino"
          onFocus={() => setFocusedInput('destino')}
          onLocationSelect={(location) => {
            console.log('Ubicación seleccionada:', location);
            setLlegada(location);
          }}
        />

        <FlatList
          data={routes}
          renderItem={renderRoute}
          keyExtractor={item => item.id}
          style={styles.routeList}
        />

        <TouchableOpacity
          testID="route-continue"
          style={styles.continueButton}
          onPress={() => navigation.navigate('ChooseVehicle', { inicio, llegada })}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 15,
    backgroundColor: '#F6F6F6',
  },
  routeList: {
    marginVertical: 10,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeText: {
    fontSize: 14,
    color: '#000',
  },
  routeDate: {
    fontSize: 12,
    color: '#777',
  },
  continueButton: {
    backgroundColor: '#6B9AC4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Route;
