import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/es';

const driversData = [
  { id: '1', name: 'Pedro Lopez Alvarez', plate: 'AEZ037', vehicle: 'HYUNDAI Negro', rating: 4.5, image: require('../../assets/ConductorTemp.png') },
];

const DetailsCard = () => {
  const route = useRoute();
  const { inicio, llegada, fecha, hora } = route.params;
  const navigation = useNavigation();

  const formattedDateTime = moment
      .tz(`${fecha} ${hora}`, 'YYYY-MM-DD HH:mm:ss', 'America/Lima')
      .locale('es')
      .format('dddd, MMMM D HH:mm[h] [GMT-5]');

  const capitalizedDateTime =
    formattedDateTime.charAt(0).toUpperCase() +
    formattedDateTime.slice(1).replaceAll(/ ([a-z])/g, (match) => match.toUpperCase());

  const driver = driversData[0];

  const creditCard = '**** 1234';
  const price = 'S/. 100';

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        testID="details-driver-card"
        style={styles.driverCard}
        onPress={() => navigation.navigate('DriverProfile', { driver })}
      >
        <Image source={driver.image} style={styles.driverImage} />
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driver.name}</Text>
          <Text style={styles.driverDetails}>{driver.plate}</Text>
          <Text style={styles.driverDetails}>{driver.vehicle}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={32} color="#6B9AC4" style={styles.ratingIcon} />
          <Text style={styles.ratingText}>{driver.rating}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ruta</Text>
        <View style={styles.routeContainer}>
          <Text style={styles.routePoint}>Origen</Text>
          <Text style={styles.routeAddress}>{inicio}</Text>
        </View>
        <View style={styles.routeContainer}>
          <Text style={styles.routePoint}>Destino</Text>
          <Text style={styles.routeAddress}>{llegada}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pago</Text>
        <View style={styles.paymentContainer}>
          <View style={styles.paymentDetailsContainer}>
            <Image source={require('../../assets/Visa.png')} style={styles.paymentIcon} />
            <Text style={styles.paymentDetails}>{creditCard}</Text>
          </View>
          <Text style={styles.paymentAmount}>{price}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fecha</Text>
        <Text style={styles.dateText}>{capitalizedDateTime}</Text>
      </View>

      <TouchableOpacity
        testID="details-cancel"
        style={styles.cancelButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#D9534F',
    borderRadius: 10,
    marginTop: 15,
    paddingVertical: 15,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingHorizontal: 20,
  },
  dateText: {
    color: '#333',
    fontSize: 14,
    marginTop: 5,
  },
  driverCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  driverDetails: {
    color: '#666',
    fontSize: 14,
  },
  driverImage: {
    borderRadius: 30,
    height: 60,
    marginRight: 10,
    width: 60,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentAmount: {
    color: '#333',
    fontSize: 16,
  },
  paymentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentDetails: {
    color: '#333',
    fontSize: 16,
  },
  paymentDetailsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 6,
  },
  paymentIcon: {
    height: 20,
    marginRight: 8,
    width: 30,
  },
  ratingContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  ratingIcon: {
    marginBottom: 2,
  },
  ratingText: {
    color: '#4A90E2',
    fontSize: 16,
  },
  routeAddress: {
    color: '#333',
    fontSize: 14,
  },
  routeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
  },
  routePoint: {
    color: '#666',
    fontSize: 14,
    marginRight: 10,
  },
  section: {
    borderTopColor: '#6B9AC4',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  sectionTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default DetailsCard;
