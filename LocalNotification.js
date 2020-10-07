import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: false,
  requestPermissions: false,
});

export const localNotification = () => {
  PushNotification.localNotification({
    id: 0,
    // ongoing: true,
    // ignoreInForeground: true,
    title: 'Jaga Jarak!', // (optional)
    message: 'Social Distancing', // (required)
    userInteraction: true,
  });
};
