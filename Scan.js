import {BleManager} from 'react-native-ble-plx';
import BLEPeripheral from 'react-native-ble-peripheral';
import {BluetoothStatus} from 'react-native-bluetooth-status';
import GetLocation from 'react-native-get-location';
import AsyncStorage from '@react-native-community/async-storage';
import {localNotification} from './LocalNotification';

module.exports = async (taskData) => {
  console.log('background service');

  const serviceId = 'afed8f98-f3ca-425f-85aa-7395937204be';
  const charId = '774c9bbe-ab21-481f-9bdf-c23cdbb82a7e';

  const btStatus = await BluetoothStatus.state();
  const bleIdentifier = await AsyncStorage.getItem('bleIdentifier');

  console.log('ble', bleIdentifier);

  if (btStatus) {
    scanService(bleIdentifier, serviceId);
    peripheralService(bleIdentifier, serviceId, charId);
  } else if (!btStatus) {
    BLEPeripheral.stop();
    console.log('Please enable bluetooth');
  }
};

const peripheralService = async (bleIdentifier, serviceId, charId) => {
  BLEPeripheral.setName(bleIdentifier);
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
};

const scanService = async (bleIdentifier, serviceId) => {
  const manager = new BleManager();
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

  manager.startDeviceScan(
    [serviceId],
    {allowDuplicates: false},
    (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      if (device) {
        sendData(device, location, bleIdentifier);
        localNotification();
      }
      manager.stopDeviceScan();
    },
  );
};

const sendData = async (device, location, bleIdentifier) => {
  console.log('==============================');
  console.log(`myIdentifier: ${bleIdentifier}`);
  console.log(`encounteredIdentifier: ${device.name}`);
  console.log(`rssi: ${device.rssi}`);
  console.log(`timestamp: ${Date.now()}`);
  console.log(`lat: ${location.latitude}`);
  console.log(`long: ${location.longitude}`);
};

const saveToLocalStorage = async () => {
  AsyncStorage.setItem('devices');
};

const getLocalStorage = async () => {
  return await AsyncStorage.getItem('devices');
};
