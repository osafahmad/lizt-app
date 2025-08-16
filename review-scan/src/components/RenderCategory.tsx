import React, {useRef, useState} from 'react';
import {Alert, Dimensions, View, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import Text from './Text';
import {Item, List} from '../redux/slices/list.slice';
import {getPendingItems} from '../utils/items.utils';
import RenderItemList from './RenderItemList';
import {colors} from '../theme';
import {useDispatch, useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';
import {removeList} from '../redux/slices/list.slice';
import {Swipeable} from 'react-native-gesture-handler';
import ItemModal from './ItemModal';
import CategoryModal from './CategoryModal';
import {useTranslation} from 'react-i18next';

interface Props {
  parentId: string;
  item: List;
  index: number;
  onPressItem: (idx: number, show: boolean) => void;
  drag: () => void;
  isActive: boolean;
}

const {width, height} = Dimensions.get('screen');

export default function RenderCategory({
  item,
  parentId,
  onPressItem,
  index,
  drag,
  isActive,
}: Props) {
  const {t} = useTranslation();
  const [edit, showEdit] = useState(false);
  const dispatch = useDispatch();
  const [showList, setShowList] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const currentTheme = useSelector(selectTheme);
  const swipeRef = useRef<Swipeable | null>(null);
  const styles = StyleSheet.create({
    noItem: {
      paddingBottom: 10,
    },
    cardContainer: {
      width: '100%',
      backgroundColor: colors[currentTheme].background,
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 0,
      gap: 10,
      zIndex: 2,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: isActive ? 3 : 0,
      },
      shadowOpacity: isActive ? 0.27 : 0,
      shadowRadius: 4.65,
      elevation: isActive ? 4 : 0,
    },
    containerSwipe: {
      padding: 1,
    },
    container: {
      elevation: 0,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    itemsContainer: {
      paddingTop: 20,
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
      width: width * 0.25,
      justifyContent: 'center',
      alignItems: 'center',
      height: height * 0.06,
      maxHeight: 200,
      backgroundColor: '#d70a26',
      marginTop: 20,
    },
    actionsContainerEdit: {
      width: width * 0.25,
      justifyContent: 'center',
      alignItems: 'center',
      height: height * 0.06,
      maxHeight: 200,
      backgroundColor: '#2c9045',
      marginTop: 20,
    },
    deleteButton: {
      padding: 10,
    },
    editModalContainer: {
      backgroundColor: colors[currentTheme].background,
      width: width * 0.9,
      height: height * 0.4,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const scrollToElement = () => {
    setShowList(prev => !prev);
    if (showList) {
      onPressItem(index, showList);
    } else {
      onPressItem(index, showList);
    }
  };

  const removeListAction = () => {
    dispatch(removeList({id: parentId, idList: item.id || ''}));
  };

  const deleteListAction = () => {
    Alert.alert(t('common.attention'), t('common.removeList'), [
      {
        text: t('common.cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        onPress: () => removeListAction(),
      },
    ]);
  };

  const renderRightActions = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.actionsContainerEdit}
          onPress={() => {
            swipeRef.current?.close();
            showEdit(true);
          }}>
          <Text color="#FFF" size="small" bold>
            {t('common.edit')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionsContainer}
          onPress={() => {
            swipeRef.current?.close();
            deleteListAction();
          }}>
          <Text color="#FFF" size="small" bold>
            {t('common.delete')}
          </Text>
        </TouchableOpacity>
      </>
    );
  };
  return (
    <>
      <CategoryModal
        categoryToEdit={item}
        showModal={showEdit}
        visible={edit}
        editing
        id={parentId}
      />
      <Swipeable
        hitSlop={{left: -60}}
        containerStyle={styles.containerSwipe}
        ref={swipeRef}
        renderRightActions={renderRightActions}>
        <View style={styles.container} key={item.id}>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            disabled={isActive}
            style={styles.cardContainer}
            onPress={() => scrollToElement()}>
            <View style={styles.row}>
              <View style={styles.downIcon}>
                {!showList && (
                  <Icon name="chevron-down" size={25} color="#636363" />
                )}

                {showList && (
                  <Icon name="chevron-up" size={25} color="#636363" />
                )}
              </View>
              <View style={styles.titleContainer}>
                <Text size="large">{item.emoji}</Text>
                <View>
                  <Text bold>{item.title}</Text>
                  <Text size="small">
                    {`${getPendingItems(item.items)} ${t('common.pendings')}`}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowItems(true)}>
              <Icon name="plus" color={colors[currentTheme].button} size={25} />
            </TouchableOpacity>
          </TouchableOpacity>
          {showList && (
            <View style={styles.itemsContainer}>
              {item.items.map((el: Item, idx: number) => (
                <RenderItemList
                  parentId={parentId}
                  categoryId={item.id || ''}
                  position={idx}
                  key={el.title}
                  item={el}
                />
              ))}
              {item.items.length === 0 && (
                <View style={styles.noItem}>
                  <Text size="body">{t('common.noElements')}</Text>
                </View>
              )}
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
      </Swipeable>
    </>
  );
}
