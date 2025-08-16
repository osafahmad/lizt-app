import {useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {getMessaging} from '@react-native-firebase/messaging';

const messages = getMessaging();

export default function useCheckPermission() {
  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      if (
        !PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        )
      ) {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
    } else {
      await messages.requestPermission({
        criticalAlert: true,
      });
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);
}
