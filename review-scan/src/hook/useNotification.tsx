import {
  getMessaging,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {Alert, Linking, Platform} from 'react-native';

const messages = getMessaging();

const APP_URL_ANDROID =
  'https://play.google.com/store/apps/details?id=com.indexceed.lizt';
const APP_URL_IOS = '';

export function useNotification() {
  const showUpdateModal = () => {
    Alert.alert('Atención', 'Nueva hay una nueva actualización de la app', [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Actualizar',
        onPress: async () => {
          const supported = await Linking.canOpenURL(
            Platform.OS === 'android' ? APP_URL_ANDROID : APP_URL_IOS,
          );
          if (supported) {
            await Linking.openURL(
              Platform.OS === 'android' ? APP_URL_ANDROID : APP_URL_IOS,
            );
          }
        },
      },
    ]);
  };

  const handlenotification = (
    notification: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    if (notification.data?.type === 'update') {
      showUpdateModal();
    }
  };

  useEffect(() => {
    async function getToken() {
      await messages.registerDeviceForRemoteMessages();
      const token = await messages.getToken();
      console.log({token});
    }
    getToken();
  });

  useEffect(() => {
    const unsubscribe = messages.onMessage(async remoteMessage => {
      handlenotification(remoteMessage);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = messages.onNotificationOpenedApp(remoteMessage => {
      handlenotification(remoteMessage);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  messages.setBackgroundMessageHandler(async remoteMessage =>
    handlenotification(remoteMessage),
  );
}
