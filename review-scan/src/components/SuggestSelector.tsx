import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import Text from './Text';
import {
  MainSuggestedItem,
  mainSugegstList,
  mainSugegstListEn,
} from '../constants/suggest';
import RenderSuggestedItem from './RenderSuggestedItem';
import SuggestModal from './SuggestModal';
import Button from './Button';

import superList from '../constants/super';
import hogarList from '../constants/hogar';
import mascotasList from '../constants/mascotas';
import viajesList from '../constants/viajes';

import superListEn from '../constants/super_en';
import hogarListEn from '../constants/hogar_en';
import mascotasListEn from '../constants/mascotas_en';
import viajesListEn from '../constants/viajes_en';

import {useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';
import {colors} from '../theme';
import {useTranslation} from 'react-i18next';

interface Props {
  id: string;
  visible: boolean;
  showModal: (show: boolean) => void;
}

const listElements = {
  es: [viajesList, superList, mascotasList, hogarList],
  en: [viajesListEn, superListEn, mascotasListEn, hogarListEn],
};

export default function SuggestSelector({visible, showModal, id}: Props) {
  const {t, i18n} = useTranslation();
  const currentTheme = useSelector(selectTheme);
  const [visibleCard, showModalCard] = useState(false);
  const [selectedCategory, setSelectedCatgory] = useState(0);
  const {width, height} = useWindowDimensions();
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
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 10,
    },
    cancelContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
  });

  type langType = 'es' | 'en';

  const suggestion = {
    es: mainSugegstList,
    en: mainSugegstListEn,
  };

  const language = i18n.language as langType;

  return (
    <>
      {visible && <StatusBar backgroundColor={'rgba(0,0,0,0.4)'} />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => showModal(false)}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => showModal(false)}>
            <View style={styles.bg} />
          </TouchableWithoutFeedback>
          <View style={styles.modal}>
            <View style={styles.titleContainer}>
              <Text bold>{t('suggestModal.selectActivity')}</Text>
            </View>
            <View style={styles.scrollContainer}>
              {suggestion[language].map(
                (el: MainSuggestedItem, idx: number) => (
                  <RenderSuggestedItem
                    close={() => showModal(false)}
                    setSelectedCategory={setSelectedCatgory}
                    showModalCard={() => showModalCard(true)}
                    item={el}
                    index={idx}
                    key={el.id}
                  />
                ),
              )}
            </View>
            <View style={styles.cancelContainer}>
              <Button onPress={() => showModal(false)} transparent>
                {t('common.cancel')}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <SuggestModal
        id={id}
        visible={visibleCard}
        showModal={showModalCard}
        suggested={listElements[language][selectedCategory]}
        showParent={showModal}
      />
    </>
  );
}
