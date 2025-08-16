import React, {useState} from 'react';
import {StyleSheet, View, Alert, Platform} from 'react-native';
import Container from '../../../components/Container';
import TextField from '../../../components/TextField';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import DatePicker from '@react-native-community/datetimepicker';
import NDatePicker from 'react-native-date-picker';
import {
  AddReminderScreenNavigationProp,
  HomeStackParamList,
} from '../../../navigation/App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {
  selectReminders,
  addReminder,
  Reminder,
} from '../../../redux/slices/reminder.slice';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import {RepeatFrequency} from '@notifee/react-native';
import RadioGroup from '../../../components/RadioGroup';
import {selectTheme} from '../../../redux/slices/app.slice';

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
    gap: 20,
    justifyContent: 'center',
    marginTop: 30,
    alignItems: 'center',
  },
  datePicker: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
});

type Props = NativeStackScreenProps<HomeStackParamList, 'AddReminder'>;

export default function AddReminder({route}: Props) {
  const {i18n, t} = useTranslation();
  const currentTheme = useSelector(selectTheme);
  const [showTime, setShowTime] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [freq, setFreq] = useState(RepeatFrequency.NONE);
  const [date, setDate] = useState<Date>(new Date(Date.now()));
  const [time, setTime] = useState<Date>(
    new Date(
      new Date(Date.now()).setMinutes(new Date(Date.now()).getMinutes() + 5),
    ),
  );
  const [title, setTitle] = useState('');
  const navigation = useNavigation<AddReminderScreenNavigationProp>();
  const {editing, id} = route.params as {editing: boolean; id: string};
  const dispatch = useDispatch();
  const currentList = useSelector(selectReminders);
  const editItem = currentList.filter(el => el.id === id)[0];

  const saveAction = () => {
    const finalDate = new Date(date);
    finalDate?.setHours(time?.getHours() || 0);
    finalDate?.setMinutes(time?.getMinutes() || 0);
    finalDate?.setSeconds(0);

    if (title === '') {
      return Alert.alert(t('common.attention'), t('common.mustTitle'));
    }

    if (new Date(finalDate) <= new Date(Date.now())) {
      return Alert.alert(t('common.attention'), t('common.minorDate'));
    }

    const newReminder: Reminder = {
      title,
      date: finalDate?.toString() ?? '',
      freq,
    };
    dispatch(
      addReminder({
        notificationTitle: t('addReminderScreen.notificationTitle'),
        item: newReminder,
      }),
    );
    navigation.navigate('Reminders', {isTab: true});
  };

  return (
    <Container scroll>
      <View style={styles.inputContainer}>
        <TextField
          onChange={setTitle}
          label={t('addListScreen.title')}
          value={editing ? editItem?.title : title}
          placeholder={t('addReminderScreen.newReminder')}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text size="body" bold>
          {t('addReminderScreen.selectDate')}
        </Text>
        {Platform.OS !== 'ios' && (
          <Button full transparent onPress={() => setShowDate(true)}>
            <>
              {`${date?.toLocaleDateString()}`}
              {showDate ? (
                <DatePicker
                  onChange={(_, selected) => {
                    setDate(selected || new Date(Date.now()));
                    setShowDate(false);
                  }}
                  mode="date"
                  value={date}
                  minimumDate={new Date(Date.now())}
                  themeVariant={currentTheme}
                  locale={i18n.language === 'es' ? 'es-ES' : 'en-US'}
                />
              ) : (
                <></>
              )}
            </>
          </Button>
        )}
        {Platform.OS === 'ios' && (
          <View style={styles.datePicker}>
            <Button full transparent onPress={() => setShowDate(true)}>
              {`${date?.toLocaleDateString()}`}
            </Button>
            <NDatePicker
              modal
              open={showDate}
              date={date}
              mode="date"
              onConfirm={selectedDate => {
                setDate(selectedDate || new Date(Date.now()));
                setShowDate(false);
              }}
              onCancel={() => {
                setShowDate(false);
              }}
            />
          </View>
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text size="body" bold>
          {t('addReminderScreen.selectTime')}
        </Text>
        {Platform.OS !== 'ios' && (
          <Button full transparent onPress={() => setShowTime(true)}>
            <>
              {`${time?.getHours().toString().padStart(2, '0')}:${time
                ?.getMinutes()
                .toString()
                .padStart(2, '0')}`}
              {showTime && (
                <DatePicker
                  onChange={(_, selected) => {
                    setTime(selected || new Date(Date.now()));
                    setShowTime(false);
                  }}
                  mode="time"
                  value={time}
                  style={{flex: 1}}
                  themeVariant={currentTheme}
                  minimumDate={new Date(Date.now())}
                  locale={i18n.language === 'es' ? 'es-ES' : 'en-US'}
                />
              )}
            </>
          </Button>
        )}

        {Platform.OS === 'ios' && (
          <View style={styles.datePicker}>
            <Button full transparent onPress={() => setShowTime(true)}>
              {`${time?.getHours().toString().padStart(2, '0')}:${time
                ?.getMinutes()
                .toString()
                .padStart(2, '0')}`}
            </Button>
            <NDatePicker
              modal
              open={showTime}
              date={time}
              mode="time"
              onConfirm={selectedDate => {
                setTime(selectedDate || new Date(Date.now()));
                setShowTime(false);
              }}
              onCancel={() => {
                setShowTime(false);
              }}
            />
          </View>
        )}
      </View>
      {!showDate && !showTime ? (
        <View>
          <Text size="body" bold>
            {t('addReminderScreen.selectFreq')}
          </Text>
          <RadioGroup
            onPress={setFreq}
            selected={freq}
            items={[
              {
                label: t('addReminderScreen.never'),
                value: RepeatFrequency.NONE,
              },
              {
                label: t('addReminderScreen.hourly'),
                value: RepeatFrequency.HOURLY,
              },
              {
                label: t('addReminderScreen.daily'),
                value: RepeatFrequency.DAILY,
              },
              {
                label: t('addReminderScreen.weekly'),
                value: RepeatFrequency.WEEKLY,
              },
            ]}
          />
        </View>
      ) : (
        <></>
      )}
      <View style={styles.buttonContainer}>
        <Button onPress={() => saveAction()}>
          {editing ? t('common.save') : t('addReminderScreen.createReminder')}
        </Button>
      </View>
    </Container>
  );
}
