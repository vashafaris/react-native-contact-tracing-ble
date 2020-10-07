import React, {useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  PermissionsAndroid,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import BLE from './BLE';
import {localNotification} from './LocalNotification';

const App = () => {
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

  const setItem = async () => {
    await AsyncStorage.setItem('bleIdentifier', '6728');
  };

  useEffect(() => {
    setItem();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          <Button title="Permission" onPress={requestLocationPermission} />
          <Button title="BLE service" onPress={() => BLE.startService()} />
          <Button title="Stop BLE service" onPress={() => BLE.stopService()} />
          <Button title="Notification" onPress={localNotification} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default App;
