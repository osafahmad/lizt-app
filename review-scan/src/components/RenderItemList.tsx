import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Item} from '../redux/slices/list.slice';
import Icon from '@react-native-vector-icons/feather';
import {
  markElementAsDone,
  removeElementAsDone,
} from '../redux/slices/list.slice';
import Text from './Text';
import {useDispatch, useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';
import {colors} from '../theme';
import {useTranslation} from 'react-i18next';

interface Props {
  item: Item;
  parentId: string;
  categoryId: string;
  position: number;
}
const radiusSize = 30;
export default function RenderItemList({
  item,
  parentId,
  categoryId,
  position,
}: Props) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (item.quantity === item.quantityDone) {
      setSelected(true);
    }
  }, [item]);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    titlecontainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    selected: {
      height: radiusSize,
      width: radiusSize,
      borderRadius: radiusSize,
      backgroundColor: colors[currentTheme].button,
      borderWidth: 1,
      borderColor: colors[currentTheme].button,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notSelected: {
      height: radiusSize,
      width: radiusSize,
      borderRadius: radiusSize,
      borderWidth: 1,
      borderColor: colors[currentTheme].button,
    },
    removeButtom: {},
  });

  const markAsDone = () => {
    setSelected(!selected);
    dispatch(
      markElementAsDone({
        done: !selected,
        position,
        parentId,
        categoryId,
      }),
    );
  };

  const removeItem = () => {
    Alert.alert(t('common.attention'), t('common.removeList'), [
      {
        text: t('common.cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        onPress: () => {
          dispatch(
            removeElementAsDone({
              parentId,
              categoryId,
              position,
            }),
          );
        },
      },
    ]);
  };

  return (
    <View style={styles.container} key={item.title}>
      <TouchableOpacity
        style={styles.titlecontainer}
        onPress={() => markAsDone()}>
        <View style={selected ? styles.selected : styles.notSelected}>
          <Text>
            {selected ? (
              <Icon name="check" color={colors[currentTheme].text} size={15} />
            ) : (
              ''
            )}
          </Text>
        </View>
        <Text done={selected}>
          <Text bold>{item.quantity?.toString()}x </Text>
          {item.title}
        </Text>
      </TouchableOpacity>

      {selected && (
        <TouchableOpacity
          style={styles.removeButtom}
          onPress={() => removeItem()}>
          <Text size="body">{t('common.delete')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
