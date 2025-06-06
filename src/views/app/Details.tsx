import React, {useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Container from '../../components/Container';
import Button from '../../components/Button';
import RenderCategory from '../../components/RenderCategory';
import {useDispatch, useSelector} from 'react-redux';
import {List, changePositions, selectList} from '../../redux/slices/list.slice';
import {getElementById} from '../../utils/items.utils';
import Text from '../../components/Text';
import Icon from '@react-native-vector-icons/material-icons';
import CategoryModal from '../../components/CategoryModal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AddListScreenNavigationProp,
  HomeStackParamList,
} from '../../navigation/App';
import FastImage from 'react-native-fast-image';
import {RouteProp, useNavigation} from '@react-navigation/native';
import DefaultImage from '../../assets/default.jpg';
import {FlashList} from '@shopify/flash-list';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import SuggestSelector from '../../components/SuggestSelector';
import {selectTheme} from '../../redux/slices/app.slice';
import {colors} from '../../theme';
import {useTranslation} from 'react-i18next';

const defaultImageUri = Image.resolveAssetSource(DefaultImage)?.uri;

type Props = NativeStackScreenProps<HomeStackParamList, 'Details'>;

export default function Details({route}: Props) {
  const {t} = useTranslation();
  const navigation = useNavigation<AddListScreenNavigationProp>();
  const currentTheme = useSelector(selectTheme);
  const listRef = useRef<FlashList<List> | null>(null);
  const dispatch = useDispatch();
  const {itemId} = route.params;
  const itemList = getElementById(useSelector(selectList), itemId);
  const [showCategories, setShowCategories] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);

  const {width, height} = useWindowDimensions();

  const styles = StyleSheet.create({
    titleTextContainer: {
      maxWidth: '80%',
    },
    noElements: {
      width: '100%',
      backgroundColor: colors[currentTheme].background,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      gap: 10,
    },
    headerContainer: {
      backgroundColor: colors[currentTheme].background,
      width: width,
      maxHeight: 120,
      alignItems: 'center',
      paddingTop: 10,
      paddingLeft: 30,
      flexDirection: 'row',
      gap: 10,
    },
    headerEditContainer: {
      backgroundColor: colors[currentTheme].background,
      width: width,
      height: 90,
      alignItems: 'center',
      paddingLeft: 20,
      flexDirection: 'row',
      gap: 10,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    inputContainer: {
      paddingBottom: 20,
      height: height * 0.6,
      marginTop: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 20,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
      position: 'absolute',
      right: 20,
      left: 20,
      top: height * 0.2,
    },
    image: {
      height: height * 0.3,
      width: width,
    },
    backContainer: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      position: 'absolute',
      left: 20,
      top: 61,
      width: 40,
      height: 40,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editIcon: {
      height: 24,
      width: 24,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    saveIcon: {
      height: 30,
      width: 30,
      zIndex: 3,
      position: 'absolute',
      right: 50,
      top: 45,
    },
  });

  const onPressItem = (index: number) => {
    listRef.current?.scrollToIndex({
      animated: true,
      index: index,
    });
  };

  return (
    <>
      <FastImage
        source={{
          uri: itemList?.image !== '' ? itemList?.image : defaultImageUri,
        }}
        style={styles.image}
      />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backContainer}>
        <Icon name="arrow-back" color="#FFF" size={30} />
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button
          small
          onPress={() => setShowSuggested(true)}
          iconName="help-circle">
          {t('detailsScreen.suggest')}
        </Button>
        <Button
          small
          onPress={() => setShowCategories(true)}
          iconName="plus-circle">
          {t('detailsScreen.create')}
        </Button>
      </View>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.titleTextContainer}
          onPress={() =>
            navigation.navigate('AddList', {
              editing: true,
              id: itemId,
              windowTitle: t('detailsScreen.editList'),
            })
          }>
          <Text bold size="extra">
            {itemList?.title || ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate('AddList', {
              editing: true,
              id: itemId,
              windowTitle: t('detailsScreen.editList'),
            })
          }>
          <View style={styles.editIcon}>
            <Icon name="edit" color={colors[currentTheme].text} size={24} />
          </View>
        </TouchableOpacity>
      </View>
      <Container>
        <CategoryModal
          id={itemList?.id || ''}
          visible={showCategories}
          showModal={setShowCategories}
        />
        <SuggestSelector
          id={itemList?.id || ''}
          showModal={setShowSuggested}
          visible={showSuggested}
        />
        <View style={styles.inputContainer}>
          <DraggableFlatList
            data={itemList?.items || []}
            onDragEnd={({data}) =>
              dispatch(
                changePositions({
                  id: itemId,
                  items: data,
                }),
              )
            }
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({
              item,
              drag,
              isActive,
              getIndex,
            }: RenderItemParams<List>) => (
              <RenderCategory
                parentId={itemList?.id || ''}
                drag={drag}
                isActive={isActive}
                key={item.id}
                item={item}
                index={getIndex() || 0}
                onPressItem={onPressItem}
              />
            )}
          />
        </View>
      </Container>
    </>
  );
}

Details.sharedElements = (route: RouteProp<HomeStackParamList, 'Details'>) => {
  const {itemId} = route.params;
  return [
    {
      id: `${itemId}`,
      animation: 'move',
      resize: 'clip',
    },
  ];
};
