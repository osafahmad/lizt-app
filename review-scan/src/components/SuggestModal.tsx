import React, {useRef, useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  useWindowDimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Text from './Text';
import Button from './Button';
import {Item, List, addCategory} from '../redux/slices/list.slice';
import RenderCategorySuggested from './RenderCategorySuggested';
import {useDispatch, useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';
import {colors} from '../theme';
import {useTranslation} from 'react-i18next';
import Icon from '@react-native-vector-icons/material-icons';

interface Props {
  id: string;
  visible: boolean;
  showModal: (show: boolean) => void;
  suggested: List[];
  showParent: (show: boolean) => void;
}

export default function SuggestModal({
  visible,
  showModal,
  id,
  suggested,
  showParent,
}: Props) {
  const {t} = useTranslation();
  const currentTheme = useSelector(selectTheme);
  const {width, height} = useWindowDimensions();
  const dispatch = useDispatch();
  const [selectedElements, setSelectedElements] = useState<List[]>([]);
  const scrollRef = useRef<ScrollView | null>(null);
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      zIndex: 999,
    },
    modal: {
      position: 'absolute',
      bottom: 0,
      backgroundColor: colors[currentTheme].background,
      width: width,
      height: width > height ? height * 0.9 : height * 0.8,
      padding: 20,
    },
    bg: {
      position: 'absolute',
      width: width,
      top: 0,
      height: height * 0.35,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    titleContainer: {
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 20,
      flexDirection: 'row',
      gap: 10,
    },
    backButton: {
      position: 'absolute',
      left: 40,
      top: 20,
    },
    emojiContainer: {
      marginTop: 20,
      justifyContent: 'center',
    },
    emojiSelector: {
      marginTop: 20,
      flex: 1,
    },
    emoji: {
      alignItems: 'center',
    },
    buttonContainer: {
      marginTop: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContainer: {
      maxHeight: width > height ? height * 0.9 : height * 0.6,
      width: width - 40,
    },
  });

  const scrollToElement = (index: number) => {
    scrollRef?.current?.scrollTo({
      x: 0,
      y: 120 * index + 1,
      animated: true,
    });
  };

  const saveItems = () => {
    selectedElements.forEach(el => {
      dispatch(
        addCategory({
          id,
          title: el.title,
          emoji: el.emoji,
          items: el.items.map((itm: Item) => {
            itm.quantityDone = 0;
            return itm;
          }) as unknown as Item[],
        }),
      );
    });
    setSelectedElements([]);
  };

  const goBack = () => {
    showModal(false);
    showParent(true);
  };

  return (
    <>
      {visible && <StatusBar backgroundColor={'rgba(0,0,0,0.4)'} />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          showModal(false);
          setSelectedElements([]);
        }}>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              showModal(false);
              setSelectedElements([]);
            }}>
            <View style={styles.bg} />
          </TouchableWithoutFeedback>
          <View style={styles.modal}>
            <View style={styles.backButton}>
              <TouchableOpacity onPress={() => goBack()}>
                <Icon
                  name="arrow-back"
                  color={colors[currentTheme].text}
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.titleContainer}>
              <Text bold>{t('suggestModal.addRecommendTitle')}</Text>
            </View>
            <ScrollView
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              style={styles.scrollContainer}>
              {suggested.map((el: List, index: number) => (
                <RenderCategorySuggested
                  position={index}
                  scrollToElement={scrollToElement}
                  key={el.title}
                  parentId={id}
                  item={el}
                  selectedElements={selectedElements}
                  setSelectedElements={setSelectedElements}
                />
              ))}
            </ScrollView>
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => {
                  showModal(false);
                  saveItems();
                }}>
                {t('common.done')}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
