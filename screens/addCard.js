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
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 53,
    color: '#333',
  },
  cardContainer: {
    width: width * 0.9,
    aspectRatio: 1.6,
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    alignSelf: 'center',
  },
  cardNumber: {
    marginTop: 135,
    fontSize: 18,
    color: '#FFF',
    letterSpacing: 2,
  },
  cardHolder: {
    fontSize: 16,
    color: '#FFF',
  },
  expiryDate: {
    fontSize: 16,
    color: '#FFF',
  },
  inputContainer: {
    paddingHorizontal: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#6B9AC4',
  },
  infoLabel: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    fontSize: 16,
    textAlign: 'right',
    color: '#333',
    paddingVertical: 5,
  },
  saveButton: {
    backgroundColor: '#6B9AC4',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 190,
    alignItems: 'center',
    marginHorizontal: 28,
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
