import React, { useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "tailwind-react-native-classnames";
import MapDetails from "../components/HomeMap/MapDetails";
import DetailsCard from "../components/ServiceDetails/DetailsCard";
import BottomSheet from "@gorhom/bottom-sheet";

const ServiceDetails = () => {
    const navigation = useNavigation();
    const snapPoints = useMemo(() => ["26%", "50%"], []);

    return (
        <View style={tw`flex-1`}>
            {/* Back Arrow */}
            <TouchableOpacity
                testID="service-details-back"
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
                <DetailsCard />
            </BottomSheet>
        </View>
    );
};

export default ServiceDetails;
