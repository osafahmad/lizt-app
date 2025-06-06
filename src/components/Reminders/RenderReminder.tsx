import React, {useState} from 'react';
import Text from '../Text';
import {Reminder, removeReminder} from '../../redux/slices/reminder.slice';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/duration';
import Icon from '@react-native-vector-icons/material-icons';
import {selectTheme} from '../../redux/slices/app.slice';
import {colors} from '../../theme';
import ReminderModal from './ReminderModal';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function RenderReminder({reminder}: {reminder: Reminder}) {
  const [visible, setVisible] = useState(false);
  const currentTheme = useSelector(selectTheme);
  const {t} = useTranslation();
  const {width} = useWindowDimensions();
  const dispatch = useDispatch();

  const styles = StyleSheet.create({
    container: {
      height: 'auto',
      minHeight: 60,
      alignItems: 'center',
      gap: 20,
      flexDirection: 'row',
      width: width * 0.7,
      paddingLeft: 20,
    },
    containerSwipe: {
      padding: 5,
      marginBottom: 15,
      flexDirection: 'row',
    },
    actionsContainer: {
      width: width * 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      backgroundColor: '#d70a26',
      marginTop: 20,
    },
  });
  const handleDelete = () => {
    dispatch(removeReminder({id: reminder.id || ''}));
    //dispatch(removeAll());
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
  return (
    <>
      <ReminderModal
        itemId={reminder.id || ''}
        setVisible={setVisible}
        visible={visible}
      />
      <Swipeable
        containerStyle={styles.containerSwipe}
        renderRightActions={renderRightActions}>
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
          }}>
          <View style={styles.container}>
            <Icon
              name="notifications-active"
              size={30}
              color={colors[currentTheme].text}
            />
            <View>
              <Text>{reminder.title} </Text>
              <Text size="small">
                {new Date(reminder.date).toLocaleDateString()} -
                {`${new Date(reminder.date)
                  .getHours()
                  .toString()
                  .padStart(2, '0')}:${new Date(reminder.date)
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </>
  );
}
