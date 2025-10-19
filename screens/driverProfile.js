import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DriverProfile = ({ navigation, route }) => {
  const { driver } = route.params;

  const [driverData, setDriverData] = useState(null);

  useEffect(() => {
    setDriverData(driver);
  }, [driver]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity testID="driver-profile-back" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6B9AC4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conductor</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileDetails}>
          <Text style={styles.driverName}>{driver.name} {driver.lastname}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="white" />
            <Text style={styles.ratingText}>{driver.rating.toFixed(2)}</Text>
          </View>
        </View>
        <Image source={driver.image} style={styles.driverImage} />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          testID="driver-profile-contact"
          style={styles.button}
          onPress={() => navigation.navigate('Chat', { driverName: driver.name })}
        >
          <Ionicons name="chatbox" size={20} color="#6B9AC4" />
          <Text style={styles.buttonText}>Contacto</Text>
        </TouchableOpacity> 
        <TouchableOpacity
          testID="driver-profile-reserve"
          style={styles.button}
          onPress={() => navigation.navigate('AdvReservation', { driverData: driverData ?? driver })}
        >
          <Ionicons name="calendar" size={20} color="#6B9AC4" />
          <Text style={styles.buttonText}>Reservar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.generalInfo}>
        <Text style={styles.infoTitle}>Datos Generales</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Placa</Text>
          <Text style={styles.infoValue}>{driver.plate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Vehiculo</Text>
          <Text style={styles.infoValue}>{driver.vehicle.charAt(0).toUpperCase() + driver.vehicle.slice(1)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dimensiones</Text>
          <Text style={styles.infoValue}>{driver.ancho} x {driver.largo} x {driver.altura}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Disponibilidad</Text>
          <Text style={styles.infoValue}>{driver.availability}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 115,
    color: '#333',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileDetails: {
    flexDirection: 'column',
  },
  driverName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B9AC4',
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 14,
    marginTop: 5,
    alignSelf: 'flex-start', 
  },
  ratingText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 5,
  },
  driverImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 5,
  },
  generalInfo: {
    paddingHorizontal: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#6B9AC4',
  },
  infoLabel: {
    fontSize: 16,
    color: '#555',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
});

export default DriverProfile;

DriverProfile.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      driver: PropTypes.shape({
        name: PropTypes.string.isRequired,
        lastname: PropTypes.string,
        rating: PropTypes.number.isRequired,
        image: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,
        plate: PropTypes.string.isRequired,
        vehicle: PropTypes.string.isRequired,
        ancho: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        largo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        altura: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        availability: PropTypes.string.isRequired,
        mail: PropTypes.string,
        phone: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};
