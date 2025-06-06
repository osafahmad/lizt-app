import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import {MainList, removeMainList} from '../redux/slices/list.slice';
import Text from './Text';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from '../navigation/App';
import {Swipeable} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import DefaultImage from '../assets/default.jpg';
import {selectTheme} from '../redux/slices/app.slice';
import {colors} from '../theme';
import {getPendingItemsMainList} from '../utils/items.utils';
import {useTranslation} from 'react-i18next';

const defaultImageUri = Image.resolveAssetSource(DefaultImage)?.uri;

const radiusSize = 30;

export default function RenderList({
  list,
  activeSelect,
  adListToSelected,
  selectedLists,
  drag,
  isActive,
}: {
  list: MainList;
  activeSelect: boolean;
  adListToSelected: (value: string) => void;
  selectedLists: string[];
  drag: () => void;
  isActive: boolean;
}) {
  const {t} = useTranslation();
  const {width, height} = useWindowDimensions();
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const styles = StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    card: {
      flexDirection: 'row',
      width: activeSelect ? width * 0.75 : width * 0.85,
      marginLeft: activeSelect ? 20 : 5,
      height: 120,
      backgroundColor: colors[currentTheme].background,
      borderRadius: 0,
      overflow: 'hidden',
      elevation: isActive ? 4 : 0,
    },
    container: {
      padding: 20,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleContainer: {
      width:
        width > height
          ? activeSelect
            ? width * 0.55
            : width * 0.6
          : width * 0.4,
      gap: 5,
    },
    image: {
      width: 120,
      height: 120,
    },
    imageCointainer: {
      overflow: 'hidden',
      width: activeSelect ? 90 : 120,
      height: 120,
    },
    actionsContainer: {
      width: width * 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      height: 100,
      backgroundColor: '#d70a26',
      marginTop: 20,
    },
    containerSwipe: {
      padding: 5,
      marginBottom: 15,
      flexDirection: 'row',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: isActive ? 3 : 0,
      },
      shadowOpacity: isActive ? 0.27 : 0,
      shadowRadius: 4.65,
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

  const handleDelete = () => {
    dispatch(removeMainList({id: list.id}));
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
        onPress: () => handleDelete(),
      },
    ]);
  };
  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={styles.actionsContainer}
        onPress={deleteListAction}>
        <Text color="#FFF" size="small" bold>
          {t('common.delete')}
        </Text>
      </TouchableOpacity>
    );
  };
  const selected = useMemo(() => {
    return selectedLists.filter(el => el === list.id).length > 0;
  }, [list.id, selectedLists]);
  return (
    <>
      <Swipeable
        hitSlop={{left: -60}}
        containerStyle={styles.containerSwipe}
        renderRightActions={renderRightActions}>
        <View style={styles.mainContainer}>
          {activeSelect && (
            <TouchableOpacity
              onPress={() => adListToSelected(list.id)}
              style={selected ? styles.selected : styles.notSelected}>
              <Text>
                {selected ? <Icon name="check" color="#FFF" size={15} /> : ''}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.card}
            onLongPress={drag}
            activeOpacity={1}
            disabled={isActive}
            key={list.id}
            onPress={() =>
              navigation.navigate('Details', {
                itemId: list.id,
              })
            }>
            <View style={styles.imageCointainer}>
              <FastImage
                source={{
                  uri: list.image !== '' ? list.image : defaultImageUri,
                }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>

            <View style={styles.container}>
              <View style={styles.titleContainer}>
                <Text size="body" bold>
                  {list.title}
                </Text>
                <Text
                  size="small"
                  color={colors[currentTheme].text}>{`${getPendingItemsMainList(
                  list.items,
                )} ${
                  list.items.length !== 1
                    ? t('common.pendings')
                    : t('common.pending')
                }`}</Text>
              </View>
              <Icon
                name="chevron-right"
                color={colors[currentTheme].text}
                size={30}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    </>
  );
}
