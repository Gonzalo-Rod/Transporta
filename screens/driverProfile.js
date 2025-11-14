import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  white: '#FFFFFF',
  border: '#E5E5E5',
  textPrimary: '#333333',
  textSecondary: '#555555',
  accent: '#6B9AC4',
  shadow: '#000000',
};

const DriverProfile = ({ navigation, route }) => {
  const { driver } = route.params;

  const [driverData, setDriverData] = useState(null);

  useEffect(() => {
    setDriverData(driver);
  }, [driver]);

  const formattedVehicle =
    driver.vehicle && driver.vehicle.length > 0
      ? `${driver.vehicle.charAt(0).toUpperCase()}${driver.vehicle.slice(1)}`
      : '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity testID="driver-profile-back" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conductor</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileDetails}>
          <Text style={styles.driverName}>{driver.name} {driver.lastname}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={COLORS.white} />
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
          <Ionicons name="chatbox" size={20} color={COLORS.accent} />
          <Text style={styles.buttonText}>Contacto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="driver-profile-reserve"
          style={styles.button}
          onPress={() => navigation.navigate('AdvReservation', { driverData: driverData ?? driver })}
        >
          <Ionicons name="calendar" size={20} color={COLORS.accent} />
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
          <Text style={styles.infoValue}>{formattedVehicle}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dimensiones</Text>
          <Text style={styles.infoValue}>
            {driver.ancho} x {driver.largo} x {driver.altura}
          </Text>
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
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
    padding: 16,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    marginLeft: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  driverImage: {
    borderRadius: 50,
    height: 90,
    marginRight: 10,
    width: 90,
  },
  driverName: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  generalInfo: {
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 115,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  infoRow: {
    borderBottomColor: COLORS.accent,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  infoTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  profileContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileDetails: {
    flexDirection: 'column',
  },
  ratingContainer: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    flexDirection: 'row',
    marginTop: 5,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 5,
  },
  safeArea: {
    backgroundColor: COLORS.white,
    flex: 1,
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
