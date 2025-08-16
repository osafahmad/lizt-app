import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, TouchableOpacity, Alert} from 'react-native';
import Container from '../../components/Container';
import TextField from '../../components/TextField';
import Text from '../../components/Text';
import Button from '../../components/Button';
import uuid from 'react-native-uuid';
import FastImage from 'react-native-fast-image';
import CategoryModal from '../../components/CategoryModal';
import {useDispatch, useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  MainList,
  selectCurrentList,
  setCurrentList,
  changeTitleCurrentList,
  addMainList,
  changeImageCurrentList,
  selectList,
  changeTitle,
  changeImage,
} from '../../redux/slices/list.slice';
import {useNavigation} from '@react-navigation/native';
import {
  AddListScreenNavigationProp,
  HomeStackParamList,
} from '../../navigation/App';
import DefaultImage from '../../assets/default.jpg';
import CatsImage from '../../assets/bg-cats.jpg';
import DogsImage from '../../assets/bg-dogs.jpg';
import ShoppingImage from '../../assets/bg-shopping.jpg';
import TravelImage from '../../assets/bg-travel.jpg';
import {getElementById} from '../../utils/items.utils';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

const defaultImageUri = Image.resolveAssetSource(DefaultImage)?.uri;

const styles = StyleSheet.create({
  iconsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  iconImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  iconImageSelected: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: '#9D59FB',
    borderWidth: 3,
  },
  iconBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    marginTop: 20,
    width: 300,
    height: 150,
    marginBottom: 10,
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImage: {
    marginTop: 20,
    width: 150,
    height: 150,
    backgroundColor: '#dcdcdc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const defaultImages = [
  {
    uri: defaultImageUri,
    title: 'General',
  },
  {
    uri: Image.resolveAssetSource(CatsImage)?.uri,
    title: 'Gatitos',
  },
  {
    uri: Image.resolveAssetSource(DogsImage)?.uri,
    title: 'Perritos',
  },
  {
    uri: Image.resolveAssetSource(ShoppingImage)?.uri,
    title: 'Viaje',
  },
  {
    uri: Image.resolveAssetSource(TravelImage)?.uri,
    title: 'Compras',
  },
];

type Props = NativeStackScreenProps<HomeStackParamList, 'AddList'>;

export default function AddList({route}: Props) {
  const {t} = useTranslation();
  const navigation = useNavigation<AddListScreenNavigationProp>();
  const {editing, id} = route.params as {editing: boolean; id: string};
  const dispatch = useDispatch();
  const currentList = useSelector(selectCurrentList);
  const [showCategories, setShowCategories] = useState(false);
  const editItem = getElementById(useSelector(selectList), id);

  useEffect(() => {
    if (!currentList && !editing) {
      const item: MainList = {
        id: uuid.v4().toString(),
        title: '',
        image: '',
        items: [],
      };
      dispatch(
        setCurrentList({
          item,
        }),
      );
    }
  }, [currentList, dispatch, editing]);

  const changeTitleAction = (newTitle: string) => {
    if (editing) {
      return dispatch(
        changeTitle({
          id,
          title: newTitle,
        }),
      );
    }
    if (currentList) {
      dispatch(
        changeTitleCurrentList({
          title: newTitle,
        }),
      );
    }
  };

  function ChangePhotoURL(uri: string) {
    if (editing) {
      return dispatch(
        changeImage({
          image: uri,
          id,
        }),
      );
    }
    dispatch(
      changeImageCurrentList({
        image: uri,
      }),
    );
  }

  useEffect(() => {
    dispatch(
      changeImageCurrentList({
        image: defaultImageUri,
      }),
    );
  }, [dispatch]);

  const changeImageAction = (newImage: string) => {
    if (editing) {
      dispatch(
        changeImage({
          image: newImage,
          id,
        }),
      );
    }
    if (currentList) {
      dispatch(
        changeImageCurrentList({
          image: newImage,
        }),
      );
    }
  };

  const saveAction = () => {
    if (currentList?.title.trim() === '' && !editing) {
      return Alert.alert(t('common.attention'), t('common.mustTitle'));
    }
    if (editing) {
      return navigation.navigate('Details', {
        itemId: editItem?.id || '',
      });
    }
    dispatch(addMainList());
    navigation.navigate('HomeStack', {isTab: true});
    if (currentList) {
      navigation.navigate('Details', {
        itemId: currentList.id,
      });
    }
  };

  const selectPhoto = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.assets) {
      if (result.assets?.length > 0) {
        changeImageAction(result.assets[0].uri || '');
      }
    }
  };
  return (
    <Container scroll noPadding>
      <CategoryModal
        id={currentList?.id || ''}
        visible={showCategories}
        showModal={setShowCategories}
      />
      <View style={styles.inputContainer}>
        <TextField
          onChange={changeTitleAction}
          label={t('addListScreen.title')}
          value={editing ? editItem?.title : currentList?.title}
          placeholder={t('addListScreen.newList')}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text size="body" bold>
          {t('addListScreen.selectImage')}
        </Text>
        <View style={styles.iconsContainer}>
          {defaultImages.map(image => (
            <TouchableOpacity
              key={image.title}
              style={styles.iconBadge}
              onPress={() => ChangePhotoURL(image.uri)}>
              <FastImage
                source={{uri: image.uri}}
                style={
                  editing
                    ? editItem?.image === image.uri
                      ? styles.iconImageSelected
                      : styles.iconImage
                    : currentList?.image === image.uri
                    ? styles.iconImageSelected
                    : styles.iconImage
                }
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: editItem?.image || currentList?.image || defaultImageUri,
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.addImageContainer}>
          <Button transparent onPress={selectPhoto}>
            {t('addListScreen.addFromGallery')}
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => saveAction()}>
            {editing ? t('common.save') : t('addListScreen.createList')}
          </Button>
        </View>
      </View>
    </Container>
  );
}
