import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const VehicleSelectionList = ({
  vehicles,
  initialSelectedId,
  onContinue,
  continueTestID,
  cardTestIDPrefix,
}) => {
  const defaultSelected = useMemo(
    () => initialSelectedId ?? (vehicles[0] ? vehicles[0].id : null),
    [initialSelectedId, vehicles]
  );

  const [selectedId, setSelectedId] = useState(defaultSelected);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedId) ?? null,
    [selectedId, vehicles]
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

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    marginTop: 5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 9,
    marginHorizontal: 10,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#6B9AC4",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  vehicleImage: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#6B9AC4",
  },
  vehicleInfo: {
    fontSize: 14,
    color: "#666",
  },
  rightContainer: {
    borderLeftWidth: 1,
    borderLeftColor: "#6B9AC4",
    paddingLeft: 15,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "400",
    color: "#333",
  },
  continueButton: {
    backgroundColor: "#6B9AC4",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 40,
    marginHorizontal: 20,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
    })
  ).isRequired,
  initialSelectedId: PropTypes.string,
  onContinue: PropTypes.func.isRequired,
  continueTestID: PropTypes.string.isRequired,
  cardTestIDPrefix: PropTypes.string,
};

VehicleSelectionList.defaultProps = {
  initialSelectedId: undefined,
  cardTestIDPrefix: "vehicle-card",
};
