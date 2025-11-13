import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { getUser, getToken } from '../utils/Auth';
import { useFocusEffect } from '@react-navigation/native';

const url = 'https://swgopvgvf5.execute-api.us-east-1.amazonaws.com/dev/get-mis-reservas';
const headers = {
  'Content-Type': 'application/json',
};

const parsePayload = (data) => {
  let payload = data;

  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (error) {
      console.log('Error parsing payload string:', error);
      return [];
    }
  }

  if (payload?.body) {
    try {
      payload = typeof payload.body === 'string' ? JSON.parse(payload.body) : payload.body;
    } catch (error) {
      console.log('Error parsing payload body:', error);
      return [];
    }
  }

  return payload?.response ?? [];
};

const formatReservation = (item, index) => ({
  id: item?.id?.S ?? `res-${index}`,
  placa: item?.placa?.S ?? 'N/A',
  inicio: item?.inicio?.S ?? 'N/A',
  llegada: item?.llegada?.S ?? 'N/A',
  fecha: item?.fecha?.S ?? 'N/A',
  hora: item?.hora?.S ?? 'N/A',
  estado: item?.estado?.S ?? 'N/A',
});

const buildRequestUrl = (baseUrl, params) => {
  const query = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

  return query ? `${baseUrl}?${query}` : baseUrl;
};

const Reservations = ({ navigation }) => {
  const [reservas, setReservas] = useState([]);
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    (async () => {
      const useR = await getUser();
      const tokeN = await getToken();
      setUser(useR);
      setToken(tokeN);
    })();
  }, []);

  const reservations = async () => {
    if (!user || !token) {
      return;
    }

    try {
      const states = ['solicitada', 'aceptada'];

      const responses = await Promise.all(states.map(async (state) => {
        const params = {
          correo: user,
          rol: 'user',
          parametro: 'estado',
          valor: state,
          token,
        };

        const requestUrl = buildRequestUrl(url, params);

        console.log('get-mis-reservas request url:', requestUrl);

        return axios.get(requestUrl, { headers });
      }));

      const uniqueMap = new Map();

      for (const response of responses) {
        const reservitas = parsePayload(response.data);

        for (const item of reservitas) {
          const id = item?.id?.S;
          if (id && !uniqueMap.has(id)) {
            uniqueMap.set(id, item);
          }
        }
      }

      const formattedReservations = Array.from(uniqueMap.values()).map(formatReservation);

      setReservas(formattedReservations);
    } catch (error) {
      console.error('get-mis-reservas error status:', error.response?.status);
      console.error('get-mis-reservas error data:', error.response?.data);
      console.error('get-mis-reservas full error:', error);
    }
  };

  useFocusEffect(
      React.useCallback(() => {
        if (user && token) {
          reservations();
        }
      }, [user, token]),
  );

  const handleNavigateToDetails = (reservation) => {
    navigation.navigate('ServiceDetails', {
      inicio: reservation.inicio,
      llegada: reservation.llegada,
      fecha: reservation.fecha,
      hora: reservation.hora,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tus Reservas</Text>

      <TouchableOpacity
        testID="reservation-create"
        style={styles.reservaButton}
        onPress={() => navigation.navigate('ReservationRoute')}
      >
        <Image source={require('../assets/Reserva.png')} style={styles.reservaIcon} />
        <View style={styles.reservaTextContainer}>
          <Text style={styles.reservaTitle}>Reserva</Text>
          <Text style={styles.reservaDescription}>
            Realiza una reserva, si necesitas un servicio a una hora específica
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.reservationsList}>
        {reservas.map((reservation) => (
          <TouchableOpacity
            key={reservation.id}
            testID={`reservation-item-${reservation.id}`}
            style={styles.reservationItem}
            onPress={() =>
              reservation.estado === 'aceptada' && handleNavigateToDetails(reservation)
            }
          >
            <Ionicons name="calendar-outline" size={24} color="#4A90E2" />
            <View style={styles.reservationTextContainer}>
              <Text style={styles.reservationText}>{reservation.inicio}</Text>
              <Text style={styles.reservationDate}>{reservation.fecha}</Text>
            </View>
            {reservation.estado === 'aceptada' ? (
              <Ionicons
                testID={`status-icon-${reservation.id}`}
                accessibilityLabel={`status-accepted-${reservation.id}`}
                name="checkmark"
                size={24}
                color="#4CAF50"
              />
            ) : (
              <Ionicons
                testID={`status-icon-${reservation.id}`}
                accessibilityLabel={`status-pending-${reservation.id}`}
                name="hourglass-outline"
                size={24}
                color="#D3A53A"
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  reservaButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#E0E0E0',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  reservaDescription: {
    color: '#666',
    fontSize: 16,
  },
  reservaIcon: {
    height: 100,
    marginRight: 16,
    width: 100,
  },
  reservaTextContainer: {
    flex: 1,
    marginVertical: 30,
  },
  reservaTitle: {
    color: '#6B9AC4',
    fontSize: 28,
    fontWeight: '500',
  },
  reservationDate: {
    color: '#888',
    fontSize: 14,
  },
  reservationItem: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  reservationText: {
    color: '#333',
    fontSize: 16,
  },
  reservationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  reservationsList: {
    marginBottom: 20,
  },
  title: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Reservations;

Reservations.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
