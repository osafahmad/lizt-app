import React from 'react';
import {
  DimensionValue,
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Text from './Text';
import {useSelector} from 'react-redux';
import {colors} from '../theme';
import {selectTheme} from '../redux/slices/app.slice';

interface Props {
  placeholder: string;
  label: string;
  onChange: (text: string) => void;
  width?: DimensionValue | undefined;
  value?: string;
  defaultValue?: string;
  type?: KeyboardTypeOptions;
}
export default function TextField({
  placeholder,
  label,
  width,
  onChange,
  value,
  defaultValue,
  type,
}: Props) {
  const currentTheme = useSelector(selectTheme);
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      gap: 10,
    },
    input: {
      borderColor: '#e7e8e9',
      borderWidth: 1,
      backgroundColor: colors[currentTheme].background,
      borderRadius: 10,
      paddingHorizontal: 20,
      width: width ? width : '100%',
      fontSize: 16,
      height: 50,
      fontFamily: 'Montserrat',
      color: colors[currentTheme].text,
    },
  });
  return (
    <View style={styles.container}>
      <Text size="body" bold>
        {label}
      </Text>
      <TextInput
        keyboardType={type ? type : 'default'}
        onChangeText={text => onChange(text)}
        style={styles.input}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        placeholderTextColor={colors[currentTheme].text}
      />
    </View>
  );
}
