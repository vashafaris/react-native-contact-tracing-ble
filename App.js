import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  PermissionsAndroid,
  Button,
} from 'react-native';
import BLEPeripheral from 'react-native-ble-peripheral';
import {BleManager} from 'react-native-ble-plx';
import {useBluetoothStatus} from 'react-native-bluetooth-status';
import GetLocation from 'react-native-get-location';
import DeviceInfo from 'react-native-device-info';

const App = () => {
  const manager = new BleManager();
  const serviceId = 'afed8f98-f3ca-425f-85aa-7395937204be';
  const charId = '774c9bbe-ab21-481f-9bdf-c23cdbb82a7e';

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

  const getData = async (device) => {
    // const location = await GetLocation.getCurrentPosition({
    //   enableHighAccuracy: true,
    //   timeout: 15000,
    // });

    // const deviceInfo = await DeviceInfo.getDevice();
    const deviceInfo = await DeviceInfo.getMacAddress();

    console.log('==============================');
    console.log(`id: ${device.id}`);
    console.log(`manufacturerData: ${device.manufacturerData}`);
    console.log(`name: ${device.name}`);
    console.log(`localName: ${device.localName}`);
    console.log(`txPowerLevel: ${device.txPowerLevel}`);
    console.log(`rssi: ${device.rssi}`);
    console.log(`serviceData: ${device.serviceData}`);
    console.log(`mtu: ${device.mtu}`);
    // console.log(`latitude: ${location.lat}`);
    // console.log(`longitude: ${location.long}`);
    console.log(`timestamp: ${Date.now()}`);
    // console.log(location);
    console.log(deviceInfo);
  };

  const scanAndConnect = async () => {
    console.log('scan and connect');
    manager.startDeviceScan([serviceId], null, (error, device) => {
      if (error) {
        console.log(error);
        // Handle error (scanning will be stopped automatically)
        return;
      }

      getData(device);

      // console.log('==============================');
      // console.log(`id: ${device.id}`);
      // console.log(`manufacturerData: ${device.manufacturerData}`);
      // console.log(`name: ${device.name}`);
      // console.log(`localName: ${device.localName}`);
      // console.log(`txPowerLevel: ${device.txPowerLevel}`);
      // console.log(`rssi: ${device.rssi}`);
      // console.log(`serviceData: ${device.serviceData}`);
      // console.log(`mtu: ${device.mtu}`);
      // console.log(`latitude: ${location.lat}`);
      // console.log(`longitude: ${location.long}`);
      // console.log(`timestamp: ${Date.now()}`);

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
        // Stop scanning as it's not necessary if you are scanning for one device.
        manager.stopDeviceScan();

        // Proceed with connection.
      }

      if (device) manager.stopDeviceScan();
    });
  };

  useEffect(() => {
    if (!isPending && btStatus) {
      BLEPeripheral.setName('USERNAME');
      BLEPeripheral.addService(serviceId, true);
      BLEPeripheral.addCharacteristicToService(
        serviceId,
        charId,
        1,
        1 | 2 | 16,
      );

      BLEPeripheral.start()
        .then((res) => {
          console.log(res);
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
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
