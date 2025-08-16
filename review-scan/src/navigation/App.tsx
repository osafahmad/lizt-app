import React from 'react';
import {
  DefaultTheme,
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import HomeScreen from '../views/app/Home';
import AddListScreen from '../views/app/AddList';
import Details from '../views/app/Details';
import AppBar from '../components/AppBar';
import {useTranslation} from 'react-i18next';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Reminders from '../views/app/Reminders';
import AddReminder from '../views/app/Reminders/AddReminder';
import BottomTab from '../components/BottomTab';
import Settings from '../views/app/Settings';
import {navigationRef} from '../../App';
import {colors} from '../theme';
import {useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';

export type HomeStackParamList = {
  HomeStack: {
    isTab?: boolean;
  };
  Home: {
    isTab?: boolean;
  };
  Settings: {
    isTab?: boolean;
  };
  AddList: {
    editing?: boolean;
    id?: string;
    windowTitle: string;
  };
  Details: {
    itemId: string;
  };
  Reminders: {
    isTab?: boolean;
    itemId?: string | undefined;
  };
  RemindersStack: {
    isTab?: boolean;
    itemId?: string | undefined;
  };
  AddReminder: {
    editing?: boolean;
    id?: string;
    windowTitle: string;
  };
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Home'
>;
export type AddListScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'AddList'
>;

export type AddReminderScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'AddReminder'
>;

const Stack = createNativeStackNavigator<HomeStackParamList>();
const options: NativeStackNavigationOptions = {
  headerShown: false,
};

const Tab = createBottomTabNavigator();

function HomeStackViews() {
  const {t} = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        header: AppBar,
      }}>
      <Stack.Screen
        name="Home"
        initialParams={{isTab: true}}
        component={HomeScreen}
        options={{
          title: t('homeScreen.homeTitle'),
          headerStyle: {
            backgroundColor: '#9D59FB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Montserrat-Bold',
          },
        }}
      />
      <Stack.Screen
        name="AddList"
        component={AddListScreen}
        options={({route}) => ({
          title: route.params.windowTitle || t('homeScreen.addNewListTitle'),
          headerStyle: {
            backgroundColor: '#9D59FB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Montserrat-Bold',
          },
        })}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={() => options}
      />
    </Stack.Navigator>
  );
}

function RemindersStackViews() {
  const {t} = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        header: AppBar,
      }}>
      <Stack.Screen
        name="Reminders"
        component={Reminders}
        initialParams={{isTab: true}}
        options={{
          title: t('remindersScreen.remindersTitle'),
          headerStyle: {
            backgroundColor: '#9D59FB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Montserrat-Bold',
          },
        }}
      />
      <Stack.Screen
        name="AddReminder"
        component={AddReminder}
        options={{
          title: t('remindersScreen.addNewReminderTitle'),
          headerStyle: {
            backgroundColor: '#9D59FB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Montserrat-Bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStackViews() {
  const {t} = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        header: AppBar,
      }}>
      <Stack.Screen
        name="Settings"
        component={Settings}
        initialParams={{isTab: true}}
        options={{
          title: t('settingScreen.title'),
          headerStyle: {
            backgroundColor: '#9D59FB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Montserrat-Bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function TabNav() {
  const currentTheme = useSelector(selectTheme);
  const MyTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors[currentTheme].background,
    },
  };

  const noShowTab = ['Details', 'AddList', 'AddReminder'];
  return (
    <NavigationContainer ref={navigationRef} theme={MyTheme}>
      <Tab.Navigator
        screenOptions={{headerShown: false}}
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBar={props => <BottomTab {...props} />}>
        <Tab.Screen
          options={({route}) => ({
            tabBarStyle: (item => {
              const routeName = getFocusedRouteNameFromRoute(item) ?? '';
              if (noShowTab.includes(routeName)) {
                return {display: 'none'};
              }
              return {display: 'flex'};
            })(route),
          })}
          name="HomeStack"
          component={HomeStackViews}
        />
        <Tab.Screen
          name="RemindersStack"
          options={({route}) => ({
            tabBarStyle: (item => {
              const routeName = getFocusedRouteNameFromRoute(item) ?? '';
              if (noShowTab.includes(routeName)) {
                return {display: 'none'};
              }
              return {display: 'flex'};
            })(route),
          })}
          component={RemindersStackViews}
        />
        <Tab.Screen name="SettingsStack" component={SettingsStackViews} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
