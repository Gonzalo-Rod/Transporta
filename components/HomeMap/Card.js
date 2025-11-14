import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Card = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>Hola Usuario!</Text>
      <Text style={styles.subtitle}>Qué quieres hacer?</Text>

      <TouchableOpacity
        testID="card-route"
        style={styles.cardButton}
        onPress={() => navigation.navigate('Route')}
      >
        <Image source={require('../../assets/Busca.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>Búsqueda Inmediata</Text>
          <Text style={styles.buttonSubtitle}>
            Busca de manera rápida un conductor que se encuentre disponible en tu
            área
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        testID="card-reservations"
        style={styles.cardButton}
        onPress={() => navigation.navigate('Reservations')}
      >
        <Image source={require('../../assets/Reserva.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>Reserva</Text>
          <Text style={styles.buttonSubtitle}>
            Realiza una reserva, si necesitas un servicio a una hora específica
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        testID="card-contact"
        style={styles.cardButton}
        onPress={() => navigation.navigate('Contact')}
      >
        <Image source={require('../../assets/Contacta.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>Contacta</Text>
          <Text style={styles.buttonSubtitle}>
            Contactando con un conductor, obtienes un servicio más personalizado
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  primary: '#6B9AC4',
};

const styles = StyleSheet.create({
  buttonSubtitle: {
    color: COLORS.black,
    fontSize: 12,
  },
  buttonTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardButton: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    marginVertical: 10,
    padding: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    elevation: 5,
    height: 450,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  icon: {
    height: 60,
    marginRight: 15,
    width: 60,
  },
  subtitle: {
    color: COLORS.black,
    fontSize: 14,
    marginVertical: 8,
    textAlign: 'Left',
  },
  textContainer: {
    flexDirection: 'column',
    flexShrink: 1,
  },
  title: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'Left',
  },
});

export default Card;
