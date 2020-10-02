/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Scan from './Scan';

const MyHeadlessTask = async () => {
  console.log('Receiving HeartBeat!');
};

AppRegistry.registerHeadlessTask('BLE', () => Scan);

AppRegistry.registerComponent(appName, () => App);
