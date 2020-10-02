import {BleManager} from 'react-native-ble-plx';
import {useBluetoothStatus} from 'react-native-bluetooth-status';
import GetLocation from 'react-native-get-location';
import DeviceInfo from 'react-native-device-info';

module.exports = async (taskData) => {
  console.log('background scan');
  const manager = new BleManager();
  scanAndConnect(manager);
};

const getData = async (device, location, deviceInfo) => {
  console.log('==============================');
  console.log(`id: ${device.id}`);
  console.log(`npk: ${device.name}`);
  console.log(`rssi: ${device.rssi}`);
  console.log(`timestamp: ${Date.now()}`);
  console.log(`lat: ${location.latitude}`);
  console.log(`long: ${location.longitude}`);

  // setId(device.id);
  // setMacId(deviceInfo);
  // setFoundName(device.name);
};

const scanAndConnect = async (manager) => {
  console.log('scan and connect');

  const serviceId = 'afed8f98-f3ca-425f-85aa-7395937204be';
  const charId = '774c9bbe-ab21-481f-9bdf-c23cdbb82a7e';
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

  manager.startDeviceScan(
    [serviceId],
    {allowDuplicates: false},
    (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      getData(device, location, deviceInfo);

      // setTimeout(() => {
      manager.stopDeviceScan();
      // }, 10000);
    },
  );
};
