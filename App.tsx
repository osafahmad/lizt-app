import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {WalkthroughProvider} from 'react-native-interactive-walkthrough';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {enableExperimentalLayoutAnimation} from 'react-native-interactive-walkthrough';
import dayjs from 'dayjs';
import Navigation from './src/navigation';
import {persistStore} from 'redux-persist';
import store from './src/redux/store';
import notifee, {EventType} from '@notifee/react-native';
import './src/localization';
import useCheckPermission from './src/hook/useCheckPermission';
import {useNotification} from './src/hook/useNotification';
import {EmojiProvider} from '@rodrigo2392/react-native-emoji-modal';
import {createNavigationContainerRef} from '@react-navigation/native';
import {HomeStackParamList} from './src/navigation/App';

dayjs.locale('es-mx');

let persistor = persistStore(store);

enableExperimentalLayoutAnimation();

export const navigationRef = createNavigationContainerRef<HomeStackParamList>();

function App(): React.JSX.Element {
  useCheckPermission();
  useNotification();
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.DISMISSED) {
      // Update remote API
    }
    if (type === EventType.PRESS) {
      if (navigationRef.isReady()) {
        navigationRef.navigate('Reminders', {
          isTab: true,
        });
        setTimeout(() => {
          return navigationRef.navigate('Reminders', {
            isTab: true,
            itemId: detail?.notification?.data?.reminderId?.toString() ?? '',
          });
        }, 500);
      }
    }
    notifee.setBadgeCount(0);
  });
  notifee.onForegroundEvent(async ({type, detail}) => {
    if (type === EventType.DISMISSED) {
      // Update remote API
    }
    if (type === EventType.PRESS) {
      if (navigationRef.isReady()) {
        navigationRef.navigate('RemindersStack', {
          isTab: true,
        });
        setTimeout(() => {
          navigationRef.navigate('Reminders', {
            isTab: true,
            itemId: detail?.notification?.data?.reminderId?.toString() ?? '',
          });
        }, 500);
      }
    }
    notifee.setBadgeCount(0);
  });
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <EmojiProvider>
            <WalkthroughProvider>
              <Navigation />
            </WalkthroughProvider>
          </EmojiProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
