import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const AddCreditCard = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6B9AC4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar método de pago</Text>
      </View>

      <LinearGradient
        colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']}
        style={styles.cardContainer}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <Text style={styles.cardNumber}>{cardNumber || '**** **** **** ****'}</Text>
        <Text style={styles.cardHolder}>{cardHolder || 'Nombre del titular'}</Text>
        <Text style={styles.expiryDate}>{expiry || 'MM/YY'}</Text>
      </LinearGradient>

      <View style={styles.inputContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Titular</Text>
          <TextInput
            style={styles.input}
            value={cardHolder}
            onChangeText={setCardHolder}
            placeholder="Nombre del titular"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Número</Text>
          <TextInput
            style={styles.input}
            value={cardNumber}
            onChangeText={setCardNumber}
            placeholder="Número de la tarjeta"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Vencimiento</Text>
          <TextInput
            style={styles.input}
            value={expiry}
            onChangeText={setExpiry}
            placeholder="MM/YY"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>CVV</Text>
          <TextInput
            style={styles.input}
            value={cvv}
            onChangeText={setCvv}
            placeholder="CVV"
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate('PaymentInfo')}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignSelf: 'center',
    aspectRatio: 1.6,
    backgroundColor: '#000',
    borderRadius: 15,
    marginVertical: 20,
    padding: 20,
    width: width * 0.9,
  },
  cardHolder: {
    color: '#FFF',
    fontSize: 16,
  },
  cardNumber: {
    color: '#FFF',
    fontSize: 18,
    letterSpacing: 2,
    marginTop: 135,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 20,
  },
  expiryDate: {
    color: '#FFF',
    fontSize: 16,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 53,
  },
  infoLabel: {
    color: '#555',
    fontSize: 16,
  },
  infoRow: {
    borderBottomColor: '#6B9AC4',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  input: {
    color: '#333',
    fontSize: 16,
    paddingVertical: 5,
    textAlign: 'right',
  },
  inputContainer: {
    paddingHorizontal: 30,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#6B9AC4',
    borderRadius: 10,
    marginHorizontal: 28,
    marginTop: 190,
    paddingVertical: 15,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddCreditCard;

AddCreditCard.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
