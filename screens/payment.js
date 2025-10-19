import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const PaymentInfo = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState('visa1');

  const paymentMethods = [
    { id: 'visa1', type: 'VISA', lastDigits: '1234', expiry: '01/2029' },
    { id: 'visa2', type: 'VISA', lastDigits: '1234', expiry: '01/2029' },
    { id: 'visa3', type: 'VISA', lastDigits: '1234', expiry: '01/2029' },
    { id: 'cash', type: 'Efectivo' },
  ];

  const handleSelectMethod = (id) => {
    setSelectedMethod(id);
  };

  const renderPaymentMethod = ({ item }) => (
    <TouchableOpacity
      testID={`payment-method-${item.id}`}
      accessibilityState={{ selected: selectedMethod === item.id }}
      style={[
        styles.paymentMethodContainer,
        selectedMethod === item.id && styles.selectedPaymentMethod,
      ]}
      onPress={() => handleSelectMethod(item.id)}
    >
      <View style={styles.paymentMethodInfo}>
        {item.type === 'VISA' ? (
          <Text style={styles.paymentType}>{item.type}</Text>
        ) : (
          <Ionicons name="cash-outline" size={26} color="#6B9AC4" style={styles.icon} />
        )}
        <View style={styles.paymentDetails}>
          <Text style={[styles.paymentText, item.type === 'Efectivo' && styles.efectivoText]}>
            {item.type === 'VISA' ? `**** ${item.lastDigits}` : 'Efectivo'}
          </Text>
          {item.expiry && <Text style={styles.paymentExpiry}>{item.expiry}</Text>}
        </View>
      </View>
      <Ionicons
        name={selectedMethod === item.id ? 'radio-button-on' : 'radio-button-off'}
        size={20}
        color="#6B9AC4"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity testID="payment-back" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#6B9AC4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pago</Text>
      </View>

      <ScrollView contentContainerStyle={styles.paymentMethodsList}>
        {paymentMethods.map((method) => (
          <View key={method.id}>{renderPaymentMethod({ item: method })}</View>
        ))}

        <TouchableOpacity
          testID="payment-add-method"
          style={[styles.paymentMethodContainer, styles.addPaymentButton]}
          onPress={() => navigation.navigate('AddCreditCard')}
        >
          <Ionicons name="add" size={28} color="#6B9AC4" style={styles.add}/>
          <Text style={styles.addPaymentText}>Agregar Metodo de Pago</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginLeft: 150,
    color: '#333',
  },
  paymentMethodsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  paymentMethodContainer: {
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
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    minHeight: 70,
  },
  selectedPaymentMethod: {
    borderColor: '#6B9AC4',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginRight: 10,
  },
  paymentDetails: {
    flexDirection: 'column',
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
  },
  efectivoText: {
    marginLeft: 10,
  },
  paymentExpiry: {
    fontSize: 14,
    color: 'gray',
  },
  addPaymentButton: {
    justifyContent: 'left',
  },
  addPaymentText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  icon: {
    marginRight: 7,
    marginLeft: 6,
  },

  add: {
    marginLeft: 5,
  }
});

export default PaymentInfo;

PaymentInfo.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
