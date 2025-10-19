import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Register from './screens/register';
import Login from './screens/login';
import BottomTab from './components/Navigation/BottomTab';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Route from './screens/route';
import DriversList from './screens/drivers';
import DriverProfile from './screens/driverProfile';
import Chat from './screens/driverChat';
import AdvReservation from './screens/advReservation';
import AdvConfirmation from './screens/advConfirmation';
import UserProfile from './screens/profile';
import PaymentInfo from './screens/payment';
import AddCreditCard from './screens/addCard';
import Activity from './screens/actividad';
import Reservations from './screens/reservation';
import ReservationRoute from './screens/rsvRoute';
import ChooseVehicle from './screens/chooseVehicle';
import DetailsCard from './components/ServiceDetails/DetailsCard';
import ServiceDetails from './screens/serviceDetails';
import SearchLocation from './components/Inputs/searchLocation';
import MapDetails from './components/HomeMap/MapDetails';
import RsvVehicleList from './components/ChooseVehicle/RsvVehicleCard';
import RsvChooseVehicle from './screens/RsvchooseVehicle';

const Stack = createNativeStackNavigator();

const MyStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="Main" component={BottomTab} />
    <Stack.Screen name="Route" component={Route} />
    <Stack.Screen name="Drivers" component={DriversList} />
    <Stack.Screen name="DriverProfile" component={DriverProfile} />
    <Stack.Screen name="AdvReservation" component={AdvReservation} />
    <Stack.Screen name="AdvConfirmation" component={AdvConfirmation} />
    <Stack.Screen name="UserProfile" component={UserProfile} />
    <Stack.Screen name="PaymentInfo" component={PaymentInfo} />
    <Stack.Screen name="AddCreditCard" component={AddCreditCard} />
    <Stack.Screen name="Activity" component={Activity} />
    <Stack.Screen name="Chat" component={Chat} />
    <Stack.Screen name="Reservations" component={Reservations} />
    <Stack.Screen name="ReservationRoute" component={ReservationRoute} />
    <Stack.Screen name="ChooseVehicle" component={ChooseVehicle} />
    <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
    <Stack.Screen name="DetailsCard" component={DetailsCard} />
    <Stack.Screen name="SearchLocation" component={SearchLocation} />
    <Stack.Screen name="MapDetails" component={MapDetails} />
    <Stack.Screen name="RsvVehicleList" component={RsvVehicleList} />
    <Stack.Screen name="RsvChooseVehicle" component={RsvChooseVehicle} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
