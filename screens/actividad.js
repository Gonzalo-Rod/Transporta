import React,{useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { getUser,getToken } from "../utils/Auth";

const url = "https://s1oxe0wq3c.execute-api.us-east-1.amazonaws.com/dev/get-mis-viajes";
const vehicles = {
  Camion: require('../assets/Camion.png'),
  Flete: require('../assets/Flete.png'),
  Van: require('../assets/Van.png'),
  Furgoneta: require('../assets/Furgoneta.png'),
};
const headers = {
	"Content-Type":"application/json"
};

const trips = [
  { id: '1', date: 'Martes, 17 de septiembre, 20:00', address: 'Jr. Medrano Silva 165, Barranco', price: 'S/. 100', vehicle: 'Camion' },
  { id: '2', date: 'Jueves, 19 de septiembre, 20:00', address: 'Jr. Medrano Silva 165, Barranco', price: 'S/. 100', vehicle: 'Flete' },
  { id: '3', date: 'Viernes, 20 de septiembre, 20:00', address: 'Jr. Medrano Silva 165, Barranco', price: 'S/. 100', vehicle: 'Van' },
];

const Activity = ({ navigation }) => {
	const [user,setUser] = useState();
	const [token,setToken] = useState();
	const test = () => {
  	(async () => {
    	const useR = await getUser();
    	const tokeN = await getToken();
    	console.log("User:", useR);
    	console.log("Token:", tokeN);
    	setUser(useR);
    	setToken(tokeN);
    	setLoading(false);  
  	})();
	};

	useEffect(() => {
  	test();  
	}, []);


	const getViajes = async () => {
		console.log("YO HAGO");
		try {
			const info = {
				correo:user,
				rol:"user",
				parametro:"-",
				valor:"-",
				token:token
			}
			const json_data = {
				httpMethod:"GET",
				path:"/get-mis-viajes",
				body:JSON.stringify(info)
			}
			const method = "POST";

			console.log("REAL");
			const response = await axios({
				method,
				url:url,
				headers:headers,
				data:json_data
			})
			const viajecitos = JSON.parse(response.data.body).response;
			console.log(viajecitos);

		} catch(error){ console.log(error); }

	};

	useEffect(() => {
		if(user && token){getViajes();}
	},[user,token]);

  const renderTrip = ({ item }) => (
    <View style={styles.tripContainer}>
      <View style={styles.tripInfo}>
        <Text style={styles.tripDate}>{item.date}</Text>
        <Text style={styles.tripAddress}>{item.address}</Text>
        <Text style={styles.tripPrice}>{item.price}</Text>
      </View>
      <Image source={vehicles[item.vehicle]} style={styles.vehicleImage} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity testID="go-back-button" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6B9AC4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tu Actividad</Text>
      </View>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
        contentContainerStyle={styles.tripList}
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 117,
    color: '#333',
  },
  tripList: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  tripContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  tripInfo: {
    flex: 1,
    paddingRight: 10,
  },
  tripDate: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  tripAddress: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  tripPrice: {
    fontSize: 14,
    color: '#333',
    marginTop: 35,
    fontWeight: 'bold',
  },
  vehicleImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginBottom: 50,
  },
});

export default Activity;

Activity.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
