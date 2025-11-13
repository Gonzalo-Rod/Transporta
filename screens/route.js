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
          keyExtractor={(item) => item.id}
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
  backButton: {
    left: 16,
    position: 'absolute',
    top: 20,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 16,
  },
  continueButton: {
    alignItems: 'center',
    backgroundColor: '#6B9AC4',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  icon: {
    height: 30,
    marginRight: 12,
    width: 30,
  },
  input: {
    backgroundColor: '#F6F6F6',
    borderColor: '#ccc',
    borderRadius: 10,
    borderWidth: 1,
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  routeContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routeDate: {
    color: '#777',
    fontSize: 12,
  },
  routeList: {
    marginVertical: 10,
  },
  routeText: {
    color: '#000',
    fontSize: 14,
  },
  routeTextContainer: {
    flex: 1,
  },
  safeContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
});

export default Route;
