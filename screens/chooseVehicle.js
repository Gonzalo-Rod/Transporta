import React, { useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "tailwind-react-native-classnames";
import MapDetails from "../components/HomeMap/MapDetails";
import VehicleList from "../components/ChooseVehicle/VehicleCard";
import BottomSheet from "@gorhom/bottom-sheet";

const ChooseVehicle = () => {
    const navigation = useNavigation();
    const snapPoints = useMemo(() => ["30%", "50%"], []);

    return (
        <View style={tw`flex-1`}>
            {/* Back Arrow */}
            <TouchableOpacity
                testID="choose-vehicle-back"
                style={[tw`absolute left-5 z-10`, {top: 67, padding: 8 }]}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={28} color="#6B9AC4" />
            </TouchableOpacity>

            {/* Map Component */}
            <View style={tw`h-full`}>
                <MapDetails />
            </View>

            {/* Bottom Sheet */}
            <BottomSheet index={1} snapPoints={snapPoints}>
                <VehicleList />
            </BottomSheet>
        </View>
    );
};

export default ChooseVehicle;
