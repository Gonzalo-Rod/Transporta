import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, FlatList, Image, TextInput, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const defaultRating = 5;

const DriversList = ({ navigation, route }) => {
  const vehiculos = route?.params?.vehiculos ?? [];
  console.log(vehiculos);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState([]);

  const mapDrivers = (driversSource) =>
    Array.isArray(driversSource)
      ? driversSource.map((driver, index) => ({
          id: driver?.placa?.S ?? `driver-${index}`,
          name: driver?.nombre_conductor?.S ?? 'Nombre no disponible',
          mail: driver?.correo_conductor?.S ?? 'Correo no disponible',
          lastname: driver?.apellido_conductor?.S ?? '',
          phone: driver?.telefono?.S ?? 'Teléfono no disponible',
          vehicle: driver?.tipo_transporte?.S ?? 'Vehículo no disponible',
          plate: driver?.placa?.S ?? '',
          ancho: driver?.dimensiones?.M?.ancho?.S ?? 'N/A',
          largo: driver?.dimensiones?.M?.largo?.S ?? 'N/A',
          altura: driver?.dimensiones?.M?.altura?.S ?? 'N/A',
          rating: defaultRating,
          image: require('../assets/ConductorTemp.png'),
        }))
      : [];

  useEffect(() => {
    setFilteredDrivers(mapDrivers(vehiculos));
  }, [vehiculos]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const drivers = mapDrivers(vehiculos);
    const filtered = drivers.filter(driver =>
      driver.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDrivers(filtered);
  };

  const navigateToProfile = (driver) => {
    navigation.navigate('DriverProfile', { driver });
  };

  const renderDriverItem = ({ item }) => (
    <TouchableOpacity
      testID={`driver-card-${item.id}`}
      onPress={() => navigateToProfile(item)}
    >
      <View style={styles.driverCard}>
        <Image source={item.image} style={styles.driverImage} />
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{item.name} {item.lastname}</Text>
          <Text style={styles.driverDetails}>Vehiculo: {item.vehicle}</Text>
          <Text style={styles.driverDetails}>Dimensiones: {item.ancho} x {item.largo} x {item.altura}</Text>
          <View style={styles.driverRating}>
            <Ionicons name="star" size={16} color="#6B9AC4" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity testID="drivers-back" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6B9AC4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conductores</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Busca"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredDrivers}
        keyExtractor={item => item.id}
        renderItem={renderDriverItem}
        contentContainerStyle={styles.listContent}
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    width: '91%',
    marginTop: 10,
    marginHorizontal: 19,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: 'gray',
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  driverCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    width: width - 40, 
    alignSelf: 'center',
  },
  driverImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  driverInfo: {
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  driverDetails: {
    fontSize: 14,
    color: '#555',
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
});

export default DriversList;

DriversList.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      vehiculos: PropTypes.array,
    }),
  }).isRequired,
};
