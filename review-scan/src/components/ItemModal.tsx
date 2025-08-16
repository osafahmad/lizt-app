import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Text from './Text';
import TextField from './TextField';
import Button from './Button';
import {useDispatch, useSelector} from 'react-redux';
import {addItemtoCategory} from '../redux/slices/list.slice';
import Icon from '@react-native-vector-icons/ionicons';
import Modal from 'react-native-modal';
import {selectTheme} from '../redux/slices/app.slice';
import {colors} from '../theme';
import {useTranslation} from 'react-i18next';

const {width, height} = Dimensions.get('screen');

interface Props {
  parentId: string;
  id: string;
  visible: boolean;
  showModal: (show: boolean) => void;
  showList: (show: boolean) => void;
}

export default function ItemModal({
  visible,
  showModal,
  id,
  parentId,
  showList,
}: Props) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState(1);

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
      bottom: -20,
      left: -20,
      backgroundColor: colors[currentTheme].background,
      width: width,
      height: height * 0.55,
      padding: 20,
    },
    bg: {
      position: 'absolute',
      width: width,
      top: 0,
      height: height * 0.5,
    },
    titleContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
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
    inputContainer: {
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
    },
    quantityContainer: {
      marginTop: 30,
    },
  });

  const addQuantity = () => {
    if (quantity < 10) {
      setQuantity(prev => prev + 1);
    }
  };

  const lessQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const addTask = () => {
    if (title !== '') {
      dispatch(
        addItemtoCategory({
          id: parentId,
          idList: id,
          title,
          quantity,
        }),
      );
      showModal(false);
      showList(true);
      setTitle('');
      setQuantity(1);
    } else {
      Alert.alert(t('attention'), t('common.mustTitle'));
    }
  };
  return (
    <Modal style={styles.container} isVisible={visible}>
      <TouchableWithoutFeedback onPress={() => showModal(false)}>
        <View style={styles.bg} />
      </TouchableWithoutFeedback>
      <View style={styles.modal}>
        <View style={styles.titleContainer}>
          <Text bold>{t('addItemModal.title')}</Text>
        </View>
        <View>
          <TextField
            label={t('addItemModal.itemName')}
            placeholder={t('addItemModal.namePlaceholder')}
            onChange={setTitle}
          />
        </View>

        <View style={styles.quantityContainer}>
          <View style={styles.titleContainer}>
            <Text bold>{t('addItemModal.quantity')}</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity disabled={quantity === 1} onPress={lessQuantity}>
              <Icon
                name="remove-circle"
                size={40}
                color={colors[currentTheme].text}
              />
            </TouchableOpacity>
            <Text bold emoji>
              {quantity.toString()}
            </Text>
            <TouchableOpacity disabled={quantity === 10} onPress={addQuantity}>
              <Icon
                name="add-circle"
                size={40}
                color={colors[currentTheme].text}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => addTask()}>{t('common.add')}</Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button transparent onPress={() => showModal(false)}>
            {t('common.cancel')}
          </Button>
        </View>
      </View>
    </Modal>
  );
}
