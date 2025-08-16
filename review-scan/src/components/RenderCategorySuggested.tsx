import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, View} from 'react-native';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import Text from './Text';
import {Item, List} from '../redux/slices/list.slice';
import {colors} from '../theme';
import {useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';
import ItemModal from './ItemModal';
import RenderItemListSuggested from './RenderItemListSuggested';

interface Props {
  parentId: string;
  item: List;
  scrollToElement: (index: number) => void;
  position: number;
  selectedElements: List[];
  setSelectedElements: (list: List[]) => void;
}
const radiusSize = 30;
const {width} = Dimensions.get('screen');

export default function RenderCategorySuggested({
  item,
  parentId,
  scrollToElement,
  position,
  selectedElements,
  setSelectedElements,
}: Props) {
  const [selectedAll, setSelectedAll] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const currentTheme = useSelector(selectTheme);

  const getSelectedByCategory = useMemo(() => {
    let total = 0;
    const idx = selectedElements.map(el => el.title).indexOf(item.title);
    if (idx !== -1) {
      const originalItems = selectedElements[idx].items;
      item.items.map(or => {
        const found = originalItems.map(el => el.title).indexOf(or.title);
        if (found !== -1) {
          total = total + 1;
        }
      });
    }
    return total;
  }, [item, selectedElements]);

  useEffect(() => {
    const idx = selectedElements.map(el => el.title).indexOf(item.title);
    if (idx !== -1) {
      if (getSelectedByCategory === item.items.length) {
        setSelectedAll(true);
      }
      if (getSelectedByCategory === 0) {
        setSelectedAll(false);
      }
    }
  }, [getSelectedByCategory, item, selectedElements]);

  const styles = StyleSheet.create({
    cardContainer: {
      width: '100%',
      backgroundColor: colors[currentTheme].background,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      zIndex: 2,
    },
    containerSwipe: {
      padding: 1,
    },
    container: {
      elevation: 5,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    itemsContainer: {
      paddingTop: 20,
      paddingBottom: 10,
      paddingHorizontal: 20,
      backgroundColor: colors[currentTheme].background,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButton: {
      height: 30,
      width: 30,
      borderRadius: 30,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors[currentTheme].button,
    },
    downIcon: {
      marginRight: 10,
    },
    actionsContainer: {
      width: width * 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      height: width * 0.2,
      backgroundColor: '#d70a26',
      marginTop: 20,
    },
    deleteButton: {
      padding: 10,
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
  });

  const addAllItems = () => {
    const tmp = JSON.parse(JSON.stringify(selectedElements)) as List[];
    const idx = tmp.map(e => e.title).indexOf(item.title);

    if (selectedAll) {
      tmp[idx].items = [];
      return setSelectedElements(tmp);
    }

    if (idx === -1 && !selectedAll) {
      tmp.push({
        id: item.id,
        title: item.title,
        emoji: item.emoji,
        items: item.items,
      });
      return setSelectedElements(tmp);
    }

    if (idx !== -1 && !selectedAll) {
      tmp[idx].items = item.items;
      return setSelectedElements(tmp);
    }
  };

  const addOneItem = (selectedItem: Item, add: boolean) => {
    const tmp = JSON.parse(JSON.stringify(selectedElements)) as List[];
    const idx = tmp.map(e => e.id).indexOf(item.id);

    if (idx === -1) {
      tmp.push({
        id: item.id,
        emoji: item.emoji,
        title: item.title,
        items: [selectedItem],
      });
      return setSelectedElements(tmp);
    }

    if (add) {
      const elements = tmp[idx];
      const idx2 = elements.items.map(e => e.title).indexOf(selectedItem.title);
      elements.items.splice(idx2, 1);
      return setSelectedElements(tmp);
    }

    if (!add) {
      const elements = tmp[idx];
      elements.items.push({
        title: selectedItem.title,
        quantity: 1,
        quantityDone: 0,
      });
      return setSelectedElements(tmp);
    }
  };

  function scrollElement() {
    if (!showList) {
      scrollToElement(position);
    }
    setShowList(!showList);
  }

  const selectedItems = useMemo(() => {
    const idx = selectedElements.map(el => el.title).indexOf(item.title);
    if (idx !== -1) {
      return selectedElements[idx].items;
    }
    return [];
  }, [item.title, selectedElements]);

  return (
    <View style={styles.containerSwipe}>
      <View style={styles.container} key={item.id}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.cardContainer}
          onPress={() => scrollElement()}>
          <View style={styles.row}>
            <View style={styles.downIcon}>
              {showList && (
                <Icon
                  name="chevron-up"
                  size={25}
                  color={colors[currentTheme].text}
                />
              )}
              {!showList && (
                <Icon
                  name="chevron-down"
                  size={25}
                  color={colors[currentTheme].text}
                />
              )}
            </View>
            <View style={styles.titleContainer}>
              <Text size="large">{item.emoji}</Text>
              <View>
                <Text bold>{item.title}</Text>
                <Text size="small">
                  {`Seleccionados ${getSelectedByCategory.toString()}  de ${
                    item.items.length
                  }`}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={
              selectedAll || getSelectedByCategory > 0
                ? styles.selected
                : styles.notSelected
            }
            onPress={() => {
              setSelectedAll(prev => !prev);
              addAllItems();
            }}>
            {(selectedAll || getSelectedByCategory > 0) && (
              <Icon name="check" color={'#FFF'} size={25} />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
        {showList && (
          <View style={styles.itemsContainer}>
            {item.items.map((el: Item, index: number) => (
              <RenderItemListSuggested
                selectedAll={selectedAll}
                addItem={addOneItem}
                parentId={parentId}
                categoryId={item.id || ''}
                position={index}
                key={el.title}
                item={el}
                selectedElements={selectedItems}
              />
            ))}
          </View>
        )}
      </View>
      <ItemModal
        showList={setShowList}
        showModal={setShowItems}
        visible={showItems}
        parentId={parentId}
        id={item.id || ''}
      />
    </View>
  );
}
