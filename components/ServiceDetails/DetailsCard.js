import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import moment from "moment";
import "moment-timezone";
import "moment/locale/es";

const driversData = [
  { id: '1', name: 'Pedro Lopez Alvarez', plate: 'AEZ037', vehicle: 'HYUNDAI Negro', rating: 4.5, image: require('../../assets/ConductorTemp.png') },
];

const DetailsCard = () => {
  const route = useRoute();
  const { inicio, llegada, fecha, hora } = route.params;
  const navigation = useNavigation();

  const formattedDateTime = moment
    .tz(`${fecha} ${hora}`, "YYYY-MM-DD HH:mm:ss", "America/Lima") 
    .locale("es") 
    .format("dddd, MMMM D HH:mm[h] [GMT-5]");

  const capitalizedDateTime =
    formattedDateTime.charAt(0).toUpperCase() +
    formattedDateTime.slice(1).replaceAll(/ ([a-z])/g, (match) => match.toUpperCase());

  const driver = driversData[0];

  const creditCard = "**** 1234";
  const price = "S/. 100";

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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  driverDetails: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    marginRight: 10,
    alignItems: 'center', 
  },
  ratingIcon: {
    marginBottom: 2, 
  },
  ratingText: {
    fontSize: 16,
    color: '#4A90E2',
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#6B9AC4',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  routePoint: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  routeAddress: {
    fontSize: 14,
    color: '#333',
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentDetailsContainer: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 30,
    height: 20,
    marginRight: 8,
  },
  paymentDetails: {
    fontSize: 16,
    color: '#333',
  },
  paymentAmount: {
    fontSize: 16,
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: '#D9534F',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default DetailsCard;
