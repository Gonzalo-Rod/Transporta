import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  textPrimary: '#333333',
  textSecondary: 'gray',
  white: '#FFFFFF',
  border: '#E5E5E5',
  shadow: '#000000',
  accent: '#6B9AC4',
  type: '#1A73E8',
};

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
          <Ionicons name="cash-outline" size={26} color={COLORS.accent} style={styles.icon} />
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
        color={COLORS.accent}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity testID="payment-back" onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.accent} />
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
          <Ionicons name="add" size={28} color={COLORS.accent} style={styles.add}/>
          <Text style={styles.addPaymentText}>Agregar Metodo de Pago</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  add: {
    marginLeft: 5,
  },
  addPaymentButton: {
    justifyContent: 'left',
  },
  addPaymentText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    marginLeft: 15,
  },
  efectivoText: {
    marginLeft: 10,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 150,
  },
  icon: {
    marginLeft: 6,
    marginRight: 7,
  },
  paymentDetails: {
    flexDirection: 'column',
  },
  paymentExpiry: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  paymentMethodContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    minHeight: 70,
    padding: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  paymentMethodInfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  paymentMethodsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  paymentText: {
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  paymentType: {
    color: COLORS.type,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  safeArea: {
    backgroundColor: COLORS.white,
    flex: 1,
  },

  selectedPaymentMethod: {
    borderColor: COLORS.accent,
  },
});

export default PaymentInfo;

PaymentInfo.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
