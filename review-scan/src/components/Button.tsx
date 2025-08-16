import React, {ReactElement} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {colors, fontSize} from '../theme';
import Text from './Text';
import {useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';
import Icon from '@react-native-vector-icons/material-design-icons';

export default function ThemeButtom({
  children,
  onPress,
  testID,
  small,
  transparent,
  disabled,
  onLayout,
  iconName,
  full = false,
}: {
  children: string | string[] | ReactElement;
  onPress?: () => void;
  testID?: string;
  small?: boolean;
  transparent?: boolean;
  disabled?: boolean;
  onLayout?: any;
  iconName?: React.ComponentProps<typeof Icon>['name'];
  full?: boolean;
}) {
  const currentTheme = useSelector(selectTheme);
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 5,
      backgroundColor: disabled
        ? 'transparent'
        : transparent
        ? 'transparent'
        : colors[currentTheme].button,
      paddingVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 15,
      borderRadius: 30,
      width: small ? '40%' : full ? '100%' : '80%',
      borderColor: disabled
        ? colors[currentTheme].input
        : colors[currentTheme].button,
      borderWidth: transparent ? 1 : 0,
    },
  });
  return (
    <TouchableOpacity
      disabled={disabled}
      testID={testID}
      style={styles.container}
      onLayout={onLayout}
      onPress={onPress}>
      {iconName && (
        <Icon
          name={iconName}
          color={
            disabled
              ? colors[currentTheme].input
              : transparent
              ? colors[currentTheme].button
              : colors[currentTheme].buttonText
          }
          size={fontSize.normal}
        />
      )}
      <Text
        size={'body'}
        color={
          disabled
            ? colors[currentTheme].input
            : transparent
            ? colors[currentTheme].transparent
            : colors[currentTheme].buttonText
        }>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
