import React, {Key} from 'react';
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import {useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';
import {colors} from '../theme';

export default function BottomTab({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const focusedOptions = descriptors[state.routes[state.index].key]
    .options as BottomTabNavigationOptions & {
    tabBarStyle: {display: 'none' | 'flex' | 'contents' | undefined};
  };
  const {height, width} = useWindowDimensions();
  const currentTheme = useSelector(selectTheme);
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-evenly',
      height: height * 0.1,
      width,
      backgroundColor: colors[currentTheme].background,
      borderTopWidth: 0.3,
      borderColor: colors[currentTheme].card,
      display: focusedOptions?.tabBarStyle?.display ?? 'flex',
      paddingTop: width > height ? 0 : 10,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      width: width > height ? width * 0.2 : width * 0.2,
    },
    iconContainerActive: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 2,
      borderColor: colors[currentTheme].bottomTab,
      width: width > height ? width * 0.2 : width * 0.2,
    },
    iconLabelFocused: {
      color: '#673ab7',
    },
    iconLabel: {
      color: '#FFF',
    },
  });
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const options = descriptors[route.key]
          .options as BottomTabNavigationOptions & {tabBarTestID: string};
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        let iconName: React.ComponentProps<typeof Icon>['name'] = 'home';

        switch (label) {
          case 'Home':
            iconName = 'list';
            break;
          case 'RemindersStack':
            iconName = 'notifications';
            break;
          case 'SettingsStack':
            iconName = 'settings';
            break;
          default:
            iconName = 'home';
            break;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={label as Key}
            style={
              isFocused ? styles.iconContainerActive : styles.iconContainer
            }>
            <Icon
              name={iconName}
              color={
                isFocused
                  ? colors[currentTheme].bottomTab
                  : colors[currentTheme].inactive
              }
              size={width > height ? width * 0.06 : width * 0.06}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
