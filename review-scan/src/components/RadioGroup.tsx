import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Text from './Text';
import {colors} from '../theme';
import {useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';
import Icon from '@react-native-vector-icons/material-icons';
import {RepeatFrequency} from '@notifee/react-native';

interface Item {
  label: string;
  value: string | number;
}

export default function RadioGroup({
  selected,
  items,
  onPress,
}: {
  selected: string | number;
  items: Item[];
  onPress: (val: RepeatFrequency) => void;
}) {
  const currentTheme = useSelector(selectTheme);
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 10,
      height: 30,
    },
    radio: {
      height: 25,
      width: 25,
      borderColor: colors[currentTheme].inactive,
      borderWidth: 1,
      borderRadius: 20,
    },
    selectedItem: {
      height: 25,
      width: 25,
      borderColor: '#FFF',
      borderWidth: 1,
      borderRadius: 20,
      backgroundColor: colors[currentTheme].button,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  return (
    <>
      {items.map((item: Item) => (
        <Pressable
          key={item.value}
          style={styles.container}
          onPress={() => onPress(item.value as RepeatFrequency)}>
          <View
            style={
              selected === item.value ? styles.selectedItem : styles.radio
            }>
            {selected === item.value && (
              <Icon name="check" color="#FFF" size={20} />
            )}
          </View>
          <Text>{item.label}</Text>
        </Pressable>
      ))}
    </>
  );
}
