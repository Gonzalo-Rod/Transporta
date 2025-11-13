import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const url = 'https://swgopvgvf5.execute-api.us-east-1.amazonaws.com/dev/get-vehiculos';
const headers = {
  'Content-Type': 'application/json',
};

const exampleDrivers = [
  { id: '1', name: 'Pedro Lopez', vehicle: 'Van', cargoType: 'Mudanzas', enterprise: 'Empresa A', image: require('../assets/ConductorTemp.png'), rating: 4.5, plate: 'ABC123', dimensions: '4x2', availability: '9am - 6pm' },
  { id: '2', name: 'Ramiro Tyson', vehicle: 'Camion', cargoType: 'Eventos', enterprise: 'Empresa B', image: require('../assets/ConductorTemp.png'), rating: 4.8, plate: 'XYZ789', dimensions: '6x3', availability: '10am - 5pm' },
  { id: '3', name: 'Carlos Perez', vehicle: 'Camion', cargoType: 'Fragil', enterprise: 'Empresa C', image: require('../assets/ConductorTemp.png'), rating: 4.7, plate: 'LMN456', dimensions: '5x3', availability: '8am - 4pm' },
  { id: '4', name: 'Diego Garcia', vehicle: 'Flete', cargoType: 'Instrumentos', enterprise: 'Empresa D', image: require('../assets/ConductorTemp.png'), rating: 4.6, plate: 'OPQ123', dimensions: '6x2', availability: '7am - 3pm' },
];

const ContactScreen = ({ navigation }) => {
  const get_vehiculos = async (parametro, valor, { shouldNavigate = true } = {}) => {
    try {
      const hasFilter = Boolean(parametro && valor);
      const info = hasFilter ? { parametro, valor } : {};
      console.log('get_vehiculos request payload:', info);
      const requestUrl = hasFilter
        ? `${url}?parametro=${encodeURIComponent(parametro)}&valor=${encodeURIComponent(valor)}`
        : url;
      console.log('get_vehiculos request url:', requestUrl);
      const response = await axios.get(requestUrl, { headers });
      console.log(response);
      const payload = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      let responseData = payload.response;
      if (!responseData && payload.body) {
        const bodyObj = typeof payload.body === 'string' ? JSON.parse(payload.body) : payload.body;
        responseData = bodyObj.response;
      }
      if (!responseData) {
        responseData = [];
      }
      if (shouldNavigate) {
        navigation.navigate('Drivers', { vehiculos: responseData });
      }
    } catch (error) {
      console.log('get_vehiculos error status:', error.response?.status);
      console.log('get_vehiculos error data:', error.response?.data);
      console.log('get_vehiculos error headers:', error.response?.headers);
      console.log('get_vehiculos full error:', error);
    }
  };

  const applyFilter = (type, value) => {
    const normalizedValue = value.toLowerCase();

    let parametro;
    if (type === 'vehicle') parametro = 'tipo_transporte';
    else if (type === 'cargoType') parametro = 'tipo_carga';
    else if (type === 'enterprise') parametro = 'empresa';
    get_vehiculos(parametro, normalizedValue);
  };

  const showAllDrivers = () => {
    get_vehiculos(undefined, undefined);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Vehiculos Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vehiculos</Text>
          <TouchableOpacity testID="vehicles-forward" onPress={() => console.log('Vehiculos button pressed')}>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={[
            { id: '1', name: 'Van', icon: require('../assets/Van.png') },
            { id: '2', name: 'Furgoneta', icon: require('../assets/Furgoneta.png') },
            { id: '3', name: 'Camion', icon: require('../assets/Camion.png') },
            { id: '4', name: 'Flete', icon: require('../assets/Flete.png') },
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => applyFilter('vehicle', item.name)}>
              <View style={styles.carouselItem}>
                <Image source={item.icon} style={styles.iconImage} />
                <Text style={styles.carouselText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />

        {/* Carga Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Carga</Text>
          <TouchableOpacity testID="cargo-forward" onPress={() => console.log('Carga button pressed')}>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={[
            { id: '1', name: 'Instrumentos', icon: require('../assets/Instrumentos.png') },
            { id: '2', name: 'Mudanzas', icon: require('../assets/Mudanzas.png') },
            { id: '3', name: 'Eventos', icon: require('../assets/Eventos.png') },
            { id: '4', name: 'Fragil', icon: require('../assets/Fragil.png') },
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => applyFilter('cargoType', item.name)}>
              <View style={styles.carouselItem}>
                <Image source={item.icon} style={styles.cargas} />
                <Text style={styles.carouselText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />

        {/* Empresas Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Empresas</Text>
          <TouchableOpacity testID="enterprise-forward" onPress={() => console.log('Empresas button pressed')}>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={[
            { id: '1', name: 'Empresa A' },
            { id: '2', name: 'Empresa B' },
            { id: '3', name: 'Empresa C' },
            { id: '4', name: 'Empresa D' },
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => applyFilter('enterprise', item.name)}>
              <View style={styles.carouselItem}>
                <Text style={styles.companyLetter}>{item.name.at(-1)}</Text>
                <Text style={styles.carouselText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />

        {/* Drivers Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Conductores</Text>
          <TouchableOpacity testID="drivers-forward" onPress={showAllDrivers}>
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={exampleDrivers}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('DriverProfile', { driver: item })}>
              <View style={styles.itemContainer}>
                <Image source={item.image} style={styles.driverImage} />
                <Text style={styles.vehicleType}>{item.vehicle}</Text>
                <Text style={styles.driverName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cargas: { height: 60, marginBottom: 5, marginTop: 20, width: 60 },
  carouselItem: { alignItems: 'center', marginHorizontal: 15 },
  carouselText: { color: '#000', fontSize: 14 },
  companyLetter: { color: '#AAC1C8', fontSize: 60, fontWeight: 'bold' },
  container: { flex: 1, padding: 16 },
  driverImage: { borderRadius: 40, height: 80, marginBottom: 5, width: 80 },
  driverName: { fontSize: 14, fontWeight: 'bold' },
  iconImage: { height: 80, marginBottom: 5, width: 80 },
  itemContainer: { alignItems: 'center', marginHorizontal: 15 },
  safeArea: { backgroundColor: 'white', flex: 1 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  vehicleType: { color: '#888', fontSize: 12 },
});

export default ContactScreen;

ContactScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
