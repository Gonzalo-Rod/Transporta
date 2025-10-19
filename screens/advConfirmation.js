import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const AdvConfirmation = ({ navigation, route }) => {
  const { originAddress, destinationAddress, date, time } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity testID="adv-back-button" onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#6B9AC4" />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>El transporte ha sido solicitado</Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.dateText}>
            {`${date} ${time} GMT-5`}
          </Text>

          <View style={styles.addressRow}>
            <Ionicons name="ellipse-outline" size={18} color="#6B9AC4" />
            <View style={styles.addressDetails}>
              <Text style={styles.addressText}>{originAddress}</Text>
              <Text style={styles.addressType}>Origen</Text>
            </View>
          </View>

          <View style={styles.addressRow}>
            <Ionicons name="ellipse" size={18} color="#6B9AC4" />
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
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#E2ECF4',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressDetails: {
    marginLeft: 10,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
  },
  addressType: {
    fontSize: 14,
    color: '#6B9AC4',
  },
  detailsButton: {
    backgroundColor: '#6B9AC4',
    paddingVertical: 8, 
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start', 
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14, 
  },
  backButton: {
    backgroundColor: '#6B9AC4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute', 
    bottom: 75,
    left: 16,
    right: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
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
