import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';

const isValidEmail = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const email = value.trim();
  if (!email) {
    return false;
  }

  const atIndex = email.indexOf('@');
  if (atIndex <= 0 || atIndex === email.length - 1) {
    return false;
  }

  const localPart = email.slice(0, atIndex);
  const domainPart = email.slice(atIndex + 1);

  if (!localPart || !domainPart || domainPart.includes(' ')) {
    return false;
  }

  const domainLabels = domainPart.split('.');
  if (domainLabels.length < 2 || domainLabels.some((label) => label.length === 0)) {
    return false;
  }

  const invalidCharacters = /[\s<>()[\]\\,;:"]/.test(email);
  return !invalidCharacters;
};

const COLORS = {
  primary: '#6B9AC4',
  white: '#FFFFFF',
  textSecondary: 'gray',
  border: '#CCCCCC',
  error: 'red',
};

const Register = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const urlRegister = 'https://swgopvgvf5.execute-api.us-east-1.amazonaws.com/dev/register-user';
  const headers = { 'Content-Type': 'application/json' };

  const validateInputs = () => {
    if (!nombre || !apellido || !correo || !password || !telefono) {
      Alert.alert('Error', 'Por favor, rellena todos los campos.');
      return false;
    }
    if (!isValidEmail(correo)) {
      Alert.alert('Error', 'Por favor, ingresa un correo válido.');
      return false;
    }
    const phoneNumber = Number(telefono);
    if (telefono.length !== 9 || Number.isNaN(phoneNumber)) {
      Alert.alert('Error', 'El número de teléfono debe tener 9 dígitos.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    const info = {
      nombre,
      apellido,
      correo,
      password,
      telefono,
    };

    try {
      const response = await axios.post(urlRegister, info, { headers });
      console.log('Registro exitoso:', response.data);
      Alert.alert('Registro exitoso', 'Te has registrado con éxito.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error en el registro:', error);
      setErrorMessage('Error al registrarse. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Registrate en <Text style={{ color: COLORS.primary }}>Transporta</Text>
      </Text>
      <Text style={styles.subtitle}>Moviliza carga rápido y seguro</Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleRegister}>
        <Text style={styles.continueText}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.registerText}>
          ¿Ya tienes cuenta? <Text style={{ color: COLORS.primary }}>Inicia sesión</Text>
        </Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Al hacer clic en registrar, acepta nuestros Términos de servicio y
        Política de privacidad.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  continueButton: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  continueText: {
    color: COLORS.white,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 10,
    textAlign: 'center',
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginHorizontal: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: COLORS.border,
    borderRadius: 10,
    borderWidth: 1,
    height: 50,
    marginBottom: 15,
    marginHorizontal: 20,
    paddingHorizontal: 15,
  },
  registerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default Register;

Register.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
