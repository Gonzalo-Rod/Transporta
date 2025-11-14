import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const VehicleSelectionList = ({
  vehicles,
  initialSelectedId,
  onContinue,
  continueTestID,
  cardTestIDPrefix,
}) => {
  const defaultSelected = useMemo(
      () => initialSelectedId ?? (vehicles[0] ? vehicles[0].id : null),
      [initialSelectedId, vehicles],
  );

  const [selectedId, setSelectedId] = useState(defaultSelected);

  const selectedVehicle = useMemo(
      () => vehicles.find((vehicle) => vehicle.id === selectedId) ?? null,
      [selectedId, vehicles],
  );

  const handleSelect = (vehicle) => {
    setSelectedId((prev) => (prev === vehicle.id ? null : vehicle.id));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      testID={`${cardTestIDPrefix}-${item.id}`}
      style={[styles.card, item.id === selectedId && styles.selectedCard]}
      onPress={() => handleSelect(item)}
    >
      <View style={styles.leftContainer}>
        <Image source={item.image} style={styles.vehicleImage} />
        <View>
          <Text style={styles.vehicleName}>{item.name}</Text>
          <Text style={styles.vehicleInfo}>{item.time}</Text>
          <Text style={styles.vehicleInfo}>Dimensión: {item.dimension}</Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.priceText}>S/. {item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={vehicles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {selectedVehicle && (
        <TouchableOpacity
          testID={continueTestID}
          style={styles.continueButton}
          onPress={() => onContinue(selectedVehicle)}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const COLORS = {
  white: '#FFFFFF',
  black: '#000',
  primary: '#6B9AC4',
  priceText: '#333',
  border: '#6B9AC4',
  vehicleInfo: '#666',
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 9,
    padding: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  continueButton: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 40,
    marginHorizontal: 20,
    paddingVertical: 15,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  leftContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  listContainer: {
    marginTop: 5,
    padding: 10,
  },
  priceText: {
    color: COLORS.priceText,
    fontSize: 20,
    fontWeight: '400',
  },
  rightContainer: {
    borderLeftColor: COLORS.border,
    borderLeftWidth: 1,
    paddingLeft: 15,
  },
  selectedCard: {
    borderColor: COLORS.border,
    borderWidth: 2,
  },
  vehicleImage: {
    height: 60,
    marginRight: 15,
    width: 60,
  },
  vehicleInfo: {
    color: COLORS.vehicleInfo,
    fontSize: 14,
  },
  vehicleName: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '500',
  },
});

export default VehicleSelectionList;

VehicleSelectionList.propTypes = {
  vehicles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        dimension: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,
      }),
  ).isRequired,
  initialSelectedId: PropTypes.string,
  onContinue: PropTypes.func.isRequired,
  continueTestID: PropTypes.string.isRequired,
  cardTestIDPrefix: PropTypes.string,
};

VehicleSelectionList.defaultProps = {
  initialSelectedId: undefined,
  cardTestIDPrefix: 'vehicle-card',
};
