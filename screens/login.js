import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import auth from '../utils/Auth';
import axios from "axios"; 

const extractSessionData = (rawData) => {
  if (!rawData) {
    return null;
  }

  if (rawData.token) {
    return rawData;
  }

  if (rawData.body) {
    try {
      return JSON.parse(rawData.body);
    } catch (parseError) {
      console.log("Error parsing response body:", parseError);
      return null;
    }
  }

  return rawData;
};

const buildErrorMessage = (error) => {
  const defaultMessage = "Error al iniciar sesión. Inténtalo de nuevo.";
  const errorData = error?.response?.data;

  if (!errorData) {
    return defaultMessage;
  }

  if (errorData.message) {
    return errorData.message;
  }

  if (errorData.body) {
    try {
      const parsed = JSON.parse(errorData.body);
      return parsed.message || defaultMessage;
    } catch (parseError) {
      console.log("Error parsing error body:", parseError);
    }
  }

  return defaultMessage;
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const logIn = async () => {
    const url_register =
      "https://swgopvgvf5.execute-api.us-east-1.amazonaws.com/dev/login-user";
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const payload = { correo: email, password };

      const response = await axios.post(url_register, payload, { headers });
      const sessionData = extractSessionData(response.data);

      if (sessionData?.token && sessionData?.user?.correo) {
				console.log(sessionData);
				auth.setUserSession(sessionData.user.correo, sessionData.token);
        navigation.navigate("Main");
      } else {
        const message = sessionData?.message || "Correo o contraseña incorrectos";
        setErrorMessage(message);
      }
    } catch (error) {
      console.log("Error:", error);
      setErrorMessage(buildErrorMessage(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bienvenido a <Text style={{ color: "#6B9AC4" }}>Transporta</Text>{" "}
      </Text>
      <Text style={styles.subtitle}>Moviliza carga rápido y seguro</Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TextInput
        style={styles.input}
        placeholder="nombre@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="contraseña"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={styles.continueButton} onPress={logIn}>
        <Text style={styles.continueText}>Continuar</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>o</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="google" size={20} color="black" />
        <Text style={styles.socialText}>Ingresa con Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <FontAwesome name="apple" size={20} color="black" />
        <Text style={styles.socialText}>Ingresa con Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>
          ¿No tienes cuenta? <Text style={{ color: "#6B9AC4" }}>Regístrate</Text>
        </Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Al hacer clic en continuar, acepta nuestros Términos de servicio y
        Política de privacidad.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "gray",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  continueButton: {
    backgroundColor: "#6B9AC4",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: 20,
  },
  continueText: {
    color: "white",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 10,
    color: "gray",
  },
  socialButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    marginHorizontal: 20,
  },
  socialText: {
    marginLeft: 10,
    fontSize: 16,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    color: "gray",
    marginTop: 20,
    marginHorizontal: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  registerText: {
    fontSize: 14,
    textAlign: "center",
    color: "gray",
    marginTop: 10,
  },
});

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
