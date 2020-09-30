import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  PermissionsAndroid,
  Button,
  Text,
  AppRegistry,
} from 'react-native';
import BLEPeripheral from 'react-native-ble-peripheral';
import {BleManager} from 'react-native-ble-plx';
import {useBluetoothStatus} from 'react-native-bluetooth-status';
import GetLocation from 'react-native-get-location';
import DeviceInfo from 'react-native-device-info';

// const BLEBackground = async (data) => {
//   console.log('jalan background', data);
// };
// AppRegistry.registerHeadlessTask('BLEBackground', () => BLEBackground);

const App = () => {
  const manager = new BleManager();
  const serviceId = 'afed8f98-f3ca-425f-85aa-7395937204be';
  const charId = '774c9bbe-ab21-481f-9bdf-c23cdbb82a7e';

  const [id, setId] = useState('');
  const [macId, setMacId] = useState('');

  const [btStatus, isPending, setBluetooth] = useBluetoothStatus();

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

  const getData = async (device, location, deviceInfo) => {
    console.log('==============================');
    console.log(`id: ${device.id}`);
    console.log(`npk: ${device.name}`);
    console.log(`rssi: ${device.rssi}`);
    console.log(`timestamp: ${Date.now()}`);
    console.log(`lat: ${location.latitude}`);
    console.log(`long: ${location.longitude}`);

    setId(device.id);
    setMacId(deviceInfo);
  };

  const scanAndConnect = async () => {
    console.log('scan and connect');
    let location = {latitude: null, longitude: null};
    try {
      location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000,
      });
    } catch (e) {
      console.log(e);
    }

    const deviceInfo = await DeviceInfo.getDevice();

    manager.startDeviceScan([serviceId], null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      getData(device, location, deviceInfo);

      if (device) manager.stopDeviceScan();
    });
  };

  useEffect(() => {
    if (!isPending && btStatus) {
      BLEPeripheral.setName('9999');
      BLEPeripheral.addService(serviceId, true);
      BLEPeripheral.addCharacteristicToService(serviceId, charId, 16 | 1, 8);

      BLEPeripheral.start()
        .then((res) => {
          console.log('ble peripheral', res);
          BLEPeripheral.sendNotificationToDevices(serviceId, charId, [
            0x10,
            0x01,
            0xa1,
            0x80,
          ]);
        })
        .catch((e) => {
          console.log(e);
        });
      scanAndConnect();
    } else if (!isPending && !btStatus) {
      BLEPeripheral.stop();
      manager.stopDeviceScan();
      alert('Please enable bluetooth');
    }
  }, [isPending, btStatus]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          <Button title="press me" onPress={requestLocationPermission} />
          <Text>found mac id: {id}</Text>
          <Text>this mac id: {macId}</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
