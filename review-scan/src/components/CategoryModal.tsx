import React, {useEffect, useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Keyboard,
  Platform,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import Text from './Text';
import TextField from './TextField';
import {EmojiModal} from '@rodrigo2392/react-native-emoji-modal';
import Button from './Button';
import {useDispatch, useSelector} from 'react-redux';
import {List, addCategory, editCategory} from '../redux/slices/list.slice';
import {FlatList} from 'react-native-gesture-handler';
import {selectTheme} from '../redux/slices/app.slice';
import {colors} from '../theme';
import {useTranslation} from 'react-i18next';

interface Props {
  id: string;
  editing?: boolean;
  visible: boolean;
  showModal: (show: boolean) => void;
  categoryToEdit?: List;
}

export default function CategoryModal({
  visible,
  showModal,
  id,
  editing,
  categoryToEdit,
}: Props) {
  const {t} = useTranslation();
  const currentTheme = useSelector(selectTheme);
  const {width, height} = useWindowDimensions();
  const dispatch = useDispatch();
  const [title, setTitle] = useState(
    categoryToEdit ? categoryToEdit.title : '',
  );
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(
    categoryToEdit ? categoryToEdit.emoji : '📌',
  );
  const [keyboardStatus, setKeyboardStatus] = useState('');

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      zIndex: 999,
    },
    bottomSpace: {
      height: 30,
    },
    modal: {
      position: 'absolute',
      bottom: 0,
      backgroundColor: colors[currentTheme].background,
      width: width,
      height:
        showEmoji || width > height
          ? height * 0.8
          : Platform.OS === 'ios' && keyboardStatus === 'shown'
          ? height * 0.8
          : height * 0.5,
      padding: 20,
    },
    bg: {
      position: 'absolute',
      width: width,
      top: 0,
      height: showEmoji ? height * 0.3 : height * 0.5,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    titleContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    emojiContainer: {
      width: width,
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emojiModal: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    },
    emojiSelectorContainer: {
      width,
      backgroundColor: colors[currentTheme].background,
      marginTop: 20,
      height: width > height ? height * 0.8 : height * 0.4,
      position: 'absolute',
      bottom: 0,
    },
    emojiSelector: {
      backgroundColor: colors[currentTheme].background,
      marginTop: 20,
      width: width > height ? width * 0.5 : width,
      height: width > height ? height * 0.8 : height * 0.4,
      position: 'absolute',
      bottom: 0,
      marginLeft: width > height ? '30%' : 0,
    },
    emoji: {
      alignItems: 'center',
    },
    buttonContainer: {
      marginBottom: 20,
      flexDirection: 'row',
      gap: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const addCategoryAction = () => {
    if (!editing && id) {
      if (title !== '') {
        dispatch(
          addCategory({
            id,
            emoji: selectedEmoji,
            title,
          }),
        );
        showModal(false);
      } else {
        Alert.alert(t('common.attention'), t('common.mustTitle'));
      }
    } else {
      if (categoryToEdit && id) {
        if (title !== '') {
          dispatch(
            editCategory({
              id: categoryToEdit.id,
              parentId: id,
              emoji: selectedEmoji,
              title,
            }),
          );
          showModal(false);
        } else {
          Alert.alert(t('common.attention'), t('common.mustTitle'));
        }
      }
    }
  };

  return (
    <>
      <EmojiModal
        visible={showEmoji}
        setVisible={setShowEmoji}
        onSelect={emoji => {
          setShowEmoji(false);
          setSelectedEmoji(emoji);
        }}
        dark={currentTheme === 'dark'}
        opacity={0.4}
      />
      {visible && <StatusBar backgroundColor={'rgba(0,0,0,0.4)'} />}
      <Modal
        animationType="slide"
        style={styles.container}
        transparent={true}
        visible={visible && !showEmoji}
        onRequestClose={() => showModal(false)}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => showModal(false)}>
            <View style={styles.bg} />
          </TouchableWithoutFeedback>
          <View style={styles.modal}>
            <FlatList
              data={[]}
              keyExtractor={() => 'key'}
              renderItem={null}
              ListHeaderComponent={
                <>
                  <View style={styles.titleContainer}>
                    <Text bold>{t('addCategoryModal.addCategoryTitle')}</Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      small
                      transparent
                      onPress={() => {
                        showModal(false);
                      }}>
                      {t('common.cancel')}
                    </Button>
                    <Button
                      small
                      onPress={() => {
                        addCategoryAction();
                      }}>
                      {editing ? t('common.save') : t('common.add')}
                    </Button>
                  </View>
                  <View>
                    <TextField
                      label={t('addCategoryModal.categoryName')}
                      defaultValue={editing ? categoryToEdit?.title : ''}
                      placeholder={t('addCategoryModal.addCategoryPlaceholder')}
                      onChange={setTitle}
                    />
                  </View>
                  <View style={styles.emojiContainer}>
                    <Text bold size="body">
                      Emoji:
                    </Text>
                    <TouchableOpacity
                      style={styles.emoji}
                      onPress={() => setShowEmoji(!showEmoji)}>
                      <Text emoji>{selectedEmoji}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              }
              ListFooterComponent={<View style={styles.bottomSpace} />}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
