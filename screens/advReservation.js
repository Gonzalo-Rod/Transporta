import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchLocation from '../components/Inputs/searchLocation';
import { getUser, getToken } from '../utils/Auth';
import axios from 'axios';

const url = 'https://swgopvgvf5.execute-api.us-east-1.amazonaws.com/dev/reserva';
const headers = {
  'Content-Type': 'application/json',
};

const COLORS = {
  primary: '#6B9AC4',
  textPrimary: '#333333',
  textSecondary: '#555555',
  border: '#E5E5E5',
  inputBackground: '#F4F4F4',
  white: '#FFFFFF',
};

const AdvReservation = ({ navigation, route }) => {
  const { driverData } = route.params;

  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [inicio, setInicio] = useState();
  const [llegada, setLlegada] = useState();
  const [fecha, setFecha] = useState();
  const [hora, setHora] = useState();
  const [precio, setPrecio] = useState();
  const [comentarios, setComentarios] = useState();
  const [duracion, setDuracion] = useState();

  const test = () => {
    (async () => {
      const useR = await getUser();
      const tokeN = await getToken();
      setUser(useR);
      setToken(tokeN);
    })();
  };
  useEffect(() => {
    test();
  }, []);

  const obtenerDireccionesGoogleMaps = async () => {
    const baseURL = 'https://proyecto-is-google-api.vercel.app/google-maps/directions';
    try {
      const response = await axios.get(baseURL, {
        params: {
          origin: inicio,
          destination: llegada,
        },
      });
      const distancia = response.data.routes[0]?.legs[0]?.distance?.value || 0;
      const duracion = response.data.routes[0]?.legs[0]?.duration?.value || 0;

      const tipoTransporte = 10;
      const tipoCarga = 20;

      const dur = duracion / 60;
      const precioCalculado = (distancia / 1000) * 2 + tipoTransporte + tipoCarga;
      console.log(precioCalculado);
      setPrecio(precioCalculado.toFixed(1));
      setDuracion(dur.toFixed(1));
    } catch (error) {
      console.log('Error obteniendo direcciones:', error.message);
    }
  };


  useEffect(() => {
    if (inicio && llegada) {
      obtenerDireccionesGoogleMaps();
    }
  }, [inicio, llegada]);


  const createReservaHandler = async () => {
    try {
      const info = {
        correo_user: user,
        correo_driver: driverData.mail, // se debe pasar por route params
        telefono_driver: driverData.phone, // esto tambien
        inicio,
        llegada,
        metodo_de_pago: 'yape', // el json con las opciones disponibles se debe pasar por route params
        placa: driverData.plate, // route params
        fecha,
        hora,
        precio,
        comentarios: comentarios ?? '',
        token,
        duracion,
      };
      const response = await axios.post(url, info, { headers });
      console.log('reserva response', response.data ?? response.status);
      return true;
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity testID="adv-reservation-back" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Datos de reserva</Text>
      </View>

      <View style={styles.formContainer}>
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

        <View style={styles.row}>
          <View style={[styles.inputRow, styles.smallInput]}>
            <Ionicons name="calendar" size={18} color="#A5A5A5" />
            <TextInput
              placeholder="Fecha"
              style={styles.input}
              value={fecha}
              onChangeText={setFecha}
            />
          </View>
          <View style={[styles.inputRow, styles.smallInput]}>
            <Ionicons name="alarm" size={18} color="#A5A5A5" />
            <TextInput
              placeholder="Hora"
              style={styles.input}
              value={hora}
              onChangeText={setHora}
            />
          </View>
        </View>

        <View style={styles.notesContainer}>
          <Ionicons name="document-text" size={18} color="#A5A5A5" style={styles.notesIcon} />
          <TextInput
            onChangeText={setComentarios}
            value={comentarios}
            placeholder="Notas"
            style={[styles.input, styles.notesInput]}
            multiline
          />
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Precio Sugerido</Text>
        <Text style={styles.price}>S/. {precio}</Text>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={async () => {
          const reservaValida = await createReservaHandler();
          if (reservaValida) {
            navigation.navigate('AdvConfirmation', {
              originAddress: inicio,
              destinationAddress: llegada,
              date: fecha,
              time: hora,
            });
          }
        }}
      >
        <Text style={styles.submitButtonText}>Solicitar Reserva</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 120,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 97,
  },
  input: {
    color: COLORS.textPrimary,
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  inputRow: {
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  notesContainer: {
    alignItems: 'flex-start',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  notesIcon: {
    marginTop: 5,
  },
  notesInput: {
    flex: 1,
    height: 180,
    marginLeft: 10,
    textAlignVertical: 'top',
  },
  price: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceContainer: {
    borderTopColor: COLORS.primary,
    borderTopWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 23,
    paddingVertical: 20,
  },
  priceLabel: {
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  safeArea: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  smallInput: {
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 30,
    marginHorizontal: 20,
    paddingVertical: 15,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    textAlign: 'center',
  },
});


export default AdvReservation;

AdvReservation.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      driverData: PropTypes.shape({
        mail: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        plate: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
