import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Item} from '../redux/slices/list.slice';
import Icon from '@react-native-vector-icons/feather';
import Text from './Text';
import {useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';
import {colors} from '../theme';

interface Props {
  item: Item;
  parentId: string;
  categoryId: string;
  position: number;
  selectedAll: boolean;
  addItem: (item: Item, add: boolean) => void;
  selectedElements: Item[];
}
const radiusSize = 30;
export default function RenderItemListSuggested({
  item,
  selectedAll,
  addItem,
  selectedElements,
}: Props) {
  const currentTheme = useSelector(selectTheme);
  const [selected, setSelected] = useState(false);

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

  useEffect(() => {
    setSelected(selectedAll);
  }, [selectedAll]);

  const addItemAction = () => {
    setSelected(prev => !prev);
    addItem(item, selected);
  };

  const isSelected = useMemo(() => {
    const found = selectedElements.filter(el => el.title === item.title);
    return found.length > 0;
  }, [item.title, selectedElements]);

  return (
    <View style={styles.container} key={item.title}>
      <TouchableOpacity
        style={styles.titlecontainer}
        onPress={() => addItemAction()}>
        <View
          style={selected || isSelected ? styles.selected : styles.notSelected}>
          <Text>
            {selected || isSelected ? (
              <Icon name="check" color="#FFF" size={15} />
            ) : (
              ''
            )}
          </Text>
        </View>
        <Text>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
}
