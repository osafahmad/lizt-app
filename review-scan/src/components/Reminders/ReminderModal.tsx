import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Text from '../Text';
import {colors} from '../../theme';
import {useDispatch, useSelector} from 'react-redux';
import {selectTheme} from '../../redux/slices/app.slice';
import {Portal} from '@gorhom/portal';
import {
  Reminder,
  removeReminder,
  selectReminders,
} from '../../redux/slices/reminder.slice';
import Icon from '@react-native-vector-icons/material-icons';
import {ScrollView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';

interface Props {
  visible: boolean;
  setVisible: (value: boolean) => void;
  itemId: string;
}

export default function ReminderModal({visible, setVisible, itemId}: Props) {
  const currentList = useSelector(selectReminders) as Reminder[];
  const {t} = useTranslation();
  const {width, height} = useWindowDimensions();
  const currentTheme = useSelector(selectTheme);
  const dispatch = useDispatch();

  const styles = StyleSheet.create({
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width,
      height,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    backDrop: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width,
      height: height + 100,
    },
    container: {
      backgroundColor: colors[currentTheme].background,
      height: 'auto',
      maxHeight: width * 0.8,
      width: width * 0.8,
      borderRadius: 20,
      alignItems: 'center',
    },
    reminderContainer: {
      marginTop: 20,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 20,
    },
    iconContainer: {
      backgroundColor: colors[currentTheme].button,
      width: width * 0.8,
      height: width * 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopEndRadius: 20,
      borderTopStartRadius: 20,
    },
    buttonsContainer: {
      borderColor: colors[currentTheme].button,
      borderTopWidth: 0.2,
      flexDirection: 'row',
      width: width * 0.8,
      height: width * 0.15,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
  });
  const handleDelete = () => {
    dispatch(removeReminder({id: reminder?.id || ''}));
    setVisible(false);
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
  const reminder = useMemo(() => {
    return currentList.find(el => el.id === itemId);
  }, [currentList, itemId]);

  if (!visible || !reminder) {
    return null;
  }

  return (
    <Portal>
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.backDrop} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icon
              name="notifications-on"
              size={40}
              color={colors[currentTheme].white}
            />
            <Text color={colors[currentTheme].white}>
              {t('addReminderScreen.notificationTitle')}
            </Text>
          </View>

          <ScrollView>
            <View style={styles.reminderContainer}>
              <Text size="large">{reminder?.title || ''}</Text>
            </View>
          </ScrollView>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text color={colors[currentTheme].text}>{t('common.close')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteListAction()}>
              <Text color={colors[currentTheme].text}>
                {t('common.delete')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Portal>
  );
}
