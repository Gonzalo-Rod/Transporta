import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { getUser, getToken } from '../utils/Auth';

const url = 'https://s1oxe0wq3c.execute-api.us-east-1.amazonaws.com/dev/get-mis-viajes';
const vehicles = {
  Camion: require('../assets/Camion.png'),
  Flete: require('../assets/Flete.png'),
  Van: require('../assets/Van.png'),
  Furgoneta: require('../assets/Furgoneta.png'),
};
const headers = {
  'Content-Type': 'application/json',
};

const COLORS = {
  primary: '#6B9AC4',
  textPrimary: '#333333',
  textSecondary: '#666666',
  border: '#E5E5E5',
  white: '#FFFFFF',
  black: '#000000',
};

const trips = [
  { id: '1', date: 'Martes, 17 de septiembre, 20:00', address: 'Jr. Medrano Silva 165, Barranco', price: 'S/. 100', vehicle: 'Camion' },
  { id: '2', date: 'Jueves, 19 de septiembre, 20:00', address: 'Jr. Medrano Silva 165, Barranco', price: 'S/. 100', vehicle: 'Flete' },
  { id: '3', date: 'Viernes, 20 de septiembre, 20:00', address: 'Jr. Medrano Silva 165, Barranco', price: 'S/. 100', vehicle: 'Van' },
];

const Activity = ({ navigation }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const test = () => {
    (async () => {
      const useR = await getUser();
      const tokeN = await getToken();
      console.log('User:', useR);
      console.log('Token:', tokeN);
      setUser(useR);
      setToken(tokeN);
      setLoading(false);
    })();
  };

  useEffect(() => {
    test();
  }, []);


  const getViajes = async () => {
    console.log('YO HAGO');
    try {
      const info = {
        correo: user,
        rol: 'user',
        parametro: '-',
        valor: '-',
        token: token,
      };
      const jsonData = {
        httpMethod: 'GET',
        path: '/get-mis-viajes',
        body: JSON.stringify(info),
      };
      const method = 'POST';

      console.log('REAL');
      const response = await axios({
        method,
        url: url,
        headers: headers,
        data: jsonData,
      });
      const viajecitos = JSON.parse(response.data.body).response;
      console.log(viajecitos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && token) {
      getViajes();
    }
  }, [user, token]);

  const renderTrip = ({ item }) => (
    <View style={styles.tripContainer}>
      <View style={styles.tripInfo}>
        <Text style={styles.tripDate}>{item.date}</Text>
        <Text style={styles.tripAddress}>{item.address}</Text>
        <Text style={styles.tripPrice}>{item.price}</Text>
      </View>
      <Image source={vehicles[item.vehicle]} style={styles.vehicleImage} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity testID="go-back-button" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tu Actividad</Text>
      </View>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
        contentContainerStyle={styles.tripList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 117,
  },
  safeArea: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  tripAddress: {
    color: COLORS.textPrimary,
    fontSize: 14,
    marginTop: 5,
  },
  tripContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tripDate: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  tripInfo: {
    flex: 1,
    paddingRight: 10,
  },
  tripList: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  tripPrice: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 35,
  },
  vehicleImage: {
    height: 60,
    marginBottom: 50,
    marginRight: 10,
    width: 60,
  },
});

export default Activity;

Activity.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
