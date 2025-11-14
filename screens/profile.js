import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { getUser, getToken } from '../utils/Auth';

const url = 'https://swgopvgvf5.execute-api.us-east-1.amazonaws.com/dev/get-user';
const headers = {
  'Content-Type': 'application/json',
};
const COLORS = {
  white: '#FFFFFF',
  border: '#E5E5E5',
  textPrimary: '#333333',
  textSecondary: '#555555',
  accent: '#6B9AC4',
  shadow: '#000000',
  logout: '#D9534F',
  role: 'gray',
};


const UserProfile = ({ navigation }) => {
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState('');

  const test = () => {
    (async () => {
      const useR = await getUser();
      const tokeN = await getToken();
      setUser(useR);
      setToken(tokeN);
    })();
  };
  useEffect(() => {
    test();
  }, []);
  const getUsersito = async () => {
    try {
      const info = {
        correo: user,
        token: token,
      };
      const response = await axios.post(url, info, { headers });
      let payload = response.data;
      if (payload?.body) {
        try {
          payload = JSON.parse(payload.body);
        } catch (parseError) {
          console.log('Error parsing user response body:', parseError);
        }
      }
      const userData = payload?.response;
      if (userData) {
        setUserData(userData);
        console.log(userData);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useFocusEffect(
      React.useCallback(() => {
        if (user && token) {
          getUsersito();
        }
      }, [user, token]),
  );


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity testID="profile-back" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tu Perfil</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileDetails}>
          <Text style={styles.userName}>{userData?.nombre?.S || 'Cargando...'} {userData?.apellido?.S}</Text>
          <Text style={styles.userRole}>{'User'}</Text>
        </View>
        <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.userImage} />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          testID="profile-activity"
          style={styles.button}
          onPress={() => navigation.navigate('Activity')}
        >
          <Ionicons name="notifications-outline" size={20} color={COLORS.accent} />
          <Text style={styles.buttonText}>Actividad</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="profile-payment"
          style={styles.button}
          onPress={() => navigation.navigate('PaymentInfo', { user_data: userData?.metodo_de_pago?.S })}
        >
          <Ionicons name="card-outline" size={20} color={COLORS.accent} />
          <Text style={styles.buttonText}>Pago</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.generalInfo}>
        <Text style={styles.infoTitle}>Datos personales</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nombre</Text>
          <Text style={styles.infoValue}>
            {`${userData?.nombre?.S ?? ''} ${userData?.apellido?.S ?? ''}`.trim() || 'Cargando...'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Celular</Text>
          <Text style={styles.infoValue}>{userData?.telefono?.S || 'Cargando...'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{userData?.correo?.S || 'Cargando...'}</Text>
        </View>
      </View>

      <TouchableOpacity
        testID="profile-logout"
        style={styles.logoutButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
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
    marginLeft: 136,
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
  logoutButton: {
    alignItems: 'center',
    backgroundColor: COLORS.logout,
    borderRadius: 10,
    marginHorizontal: 30,
    marginTop: 30,
    paddingVertical: 15,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
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
  safeArea: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  userImage: {
    borderRadius: 50,
    height: 90,
    marginRight: 10,
    width: 90,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  userRole: {
    color: COLORS.role,
    fontSize: 16,
    marginTop: 5,
  },
});

export default UserProfile;

UserProfile.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
