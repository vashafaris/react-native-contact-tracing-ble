import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  PermissionsAndroid,
  Button,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import BLE from './BLE';

const App = () => {
  const [id, setId] = useState('');
  const [macId, setMacId] = useState('');
  const [foundName, setFoundName] = useState('');

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can accsess location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    setItem();
  }, []);

  const setItem = async () => {
    console.log('set item');
    await AsyncStorage.setItem('bleIdentifier', '6728');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          <Text>found mac id: {id}</Text>
          <Text>this mac id: {macId}</Text>
          <Text>found name: {foundName}</Text>
          <Button title="Permission" onPress={requestLocationPermission} />
          <Button title="BLE service" onPress={() => BLE.startService()} />
          <Button title="Stop BLE service" onPress={() => BLE.stopService()} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;

// not used

// const manager = new BleManager();
// const serviceId = 'afed8f98-f3ca-425f-85aa-7395937204be';
// const charId = '774c9bbe-ab21-481f-9bdf-c23cdbb82a7e';

// const npk = '6728';

// const [btStatus, isPending, setBluetooth] = useBluetoothStatus();

// const getData = async (device, location, deviceInfo) => {
//   console.log('==============================');
//   console.log(`id: ${device.id}`);
//   console.log(`npk: ${device.name}`);
//   console.log(`rssi: ${device.rssi}`);
//   console.log(`timestamp: ${Date.now()}`);
//   console.log(`lat: ${location.latitude}`);
//   console.log(`long: ${location.longitude}`);

//   setId(device.id);
//   setMacId(deviceInfo);
//   setFoundName(device.name);
// };

// const scanAndConnect = async () => {
//   console.log('scan and connect');
//   let location = {latitude: null, longitude: null};
//   try {
//     location = await GetLocation.getCurrentPosition({
//       enableHighAccuracy: false,
//       timeout: 5000,
//       maximumAge: 10000,
//     });
//   } catch (e) {
//     console.log(e);
//   }

//   const deviceInfo = await DeviceInfo.getDevice();

//   manager.startDeviceScan(
//     [serviceId],
//     {allowDuplicates: false},
//     (error, device) => {
//       if (error) {
//         console.log(error);
//         return;
//       }

//       getData(device, location, deviceInfo);

//       setTimeout(() => {
//         manager.stopDeviceScan();
//       }, 10000);

//     },
//   );
// };
