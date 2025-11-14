import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#6B9AC4',
  textPrimary: '#333333',
  white: '#FFFFFF',
  detailBackground: '#E2ECF4',
};

const AdvConfirmation = ({ navigation, route }) => {
  const { originAddress, destinationAddress, date, time } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity testID="adv-back-button" onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>El transporte ha sido solicitado</Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.dateText}>
            {`${date} ${time} GMT-5`}
          </Text>

          <View style={styles.addressRow}>
            <Ionicons name="ellipse-outline" size={18} color={COLORS.primary} />
            <View style={styles.addressDetails}>
              <Text style={styles.addressText}>{originAddress}</Text>
              <Text style={styles.addressType}>Origen</Text>
            </View>
          </View>

          <View style={styles.addressRow}>
            <Ionicons name="ellipse" size={18} color={COLORS.primary} />
            <View style={styles.addressDetails}>
              <Text style={styles.addressText}>{destinationAddress}</Text>
              <Text style={styles.addressType}>Destino</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.detailsButton} onPress={() => navigation.navigate('Main', { screen: 'Reservations' })}>
            <Text style={styles.detailsButtonText}>Detalles</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  addressDetails: {
    marginLeft: 10,
  },
  addressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  addressText: {
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  addressType: {
    color: COLORS.primary,
    fontSize: 14,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    bottom: 75,
    left: 16,
    paddingVertical: 15,
    position: 'absolute',
    right: 16,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    padding: 16,
  },
  dateText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 25,
    paddingVertical: 8,
  },
  detailsButtonText: {
    color: COLORS.white,
    fontSize: 14,
  },
  detailsContainer: {
    backgroundColor: COLORS.detailBackground,
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  safeArea: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
});

export default AdvConfirmation;

AdvConfirmation.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      originAddress: PropTypes.string.isRequired,
      destinationAddress: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
