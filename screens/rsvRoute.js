import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SearchLocation from '../components/Inputs/searchLocation';

const ReservationRoute = () => {
  const navigation = useNavigation();
  const [inicio, setInicio] = useState('');
  const [llegada, setLlegada] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
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

        <TouchableOpacity testID="reservation-route-back" onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#6B9AC4" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Selecciona la Ruta</Text>

        <SearchLocation
        placeholder="Buscar partida"
        onLocationSelect={(location) => {
          console.log('Ubicación seleccionada:', location);
          setInicio(location);
        }}
      />
        <SearchLocation
        placeholder="Buscar destino"
        onLocationSelect={(location) => {
          console.log('Ubicación seleccionada:', location);
          setLlegada(location);
          }}
        />

        <View style={styles.dateTimeContainer}>
          <View style={[styles.inputRow, styles.smallInput]}>
            <Ionicons name="calendar" size={18} color="#A5A5A5" />
            <TextInput
              placeholder="Día"
              testID="date-input"
              style={styles.input}
              value={fecha}
              onChangeText={setFecha}
              onFocus={() => setFocusedInput('dia')}
            />
          </View>
          <View style={[styles.inputRow, styles.smallInput]}>
            <Ionicons name="alarm" size={18} color="#A5A5A5" />
            <TextInput
              placeholder="Hora"
              testID="time-input"
              style={styles.input}
              value={hora}
              onChangeText={setHora}
              onFocus={() => setFocusedInput('hora')}
            />
          </View>
        </View>

        <FlatList
          data={routes}
          renderItem={renderRoute}
          keyExtractor={item => item.id}
          style={styles.routeList}
        />

        <TouchableOpacity
          testID="reservation-route-continue"
          style={styles.continueButton}
          onPress={() => navigation.navigate('RsvChooseVehicle', {inicio, llegada, fecha, hora}) }
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    flex: 1,
    marginRight: 10,
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

export default ReservationRoute;
