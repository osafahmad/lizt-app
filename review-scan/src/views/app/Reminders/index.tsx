import * as React from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  HomeScreenNavigationProp,
  HomeStackParamList,
} from '../../../navigation/App';
import Container from '../../../components/Container';
import Button from '../../../components/Button';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Reminder,
  removeAll,
  removeReminder,
  selectReminders,
} from '../../../redux/slices/reminder.slice';
import {useTranslation} from 'react-i18next';
import Text from '../../../components/Text';
import {colors} from '../../../theme';
import {selectTheme} from '../../../redux/slices/app.slice';
import {FlashList} from '@shopify/flash-list';
import RenderReminder from '../../../components/Reminders/RenderReminder';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ReminderModal from '../../../components/Reminders/ReminderModal';

type Props = NativeStackScreenProps<HomeStackParamList, 'Reminders'>;

export default function Reminders({route}: Props) {
  const [visible, setVisible] = useState(false);
  const {itemId} = route.params;
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  const currentList = useSelector(selectReminders) as Reminder[];
  const [activeSelect, setActiveSelect] = useState(false);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const addReminder = () => {
    navigation.navigate('AddReminder', {
      windowTitle: t('remindersScreen.addNewReminderTitle'),
    });
  };

  function removeAction() {
    Alert.alert(t('common.attention'), t('homeScreen.deleteQuestion'), [
      {
        text: t('common.cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        onPress: () => {
          selectedLists.forEach(el => {
            dispatch(removeReminder({id: el}));
          });
          setSelectedLists([]);
          setActiveSelect(false);
        },
      },
    ]);
  }

  function removeAllAction() {
    Alert.alert(t('common.attention'), t('homeScreen.deleteAllQuestion'), [
      {
        text: t('common.cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        onPress: () => {
          dispatch(removeAll());
          setSelectedLists([]);
          setActiveSelect(false);
        },
      },
    ]);
  }

  React.useEffect(() => {
    if (itemId) {
      setVisible(true);
    }
  }, [itemId]);

  const styles = StyleSheet.create({
    stylesContainerButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginTop: 20,
    },
    noElements: {
      width: '100%',
      backgroundColor: colors[currentTheme].background,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0,
      gap: 10,
    },
    selectTitleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    removeButton: {
      borderRadius: 20,
      padding: 10,
      borderColor: '#e30006',
      borderWidth: 1,
    },
  });
  return (
    <>
      <ReminderModal
        itemId={itemId || ''}
        visible={visible}
        setVisible={setVisible}
      />
      <Container>
        <View style={styles.stylesContainerButton}>
          <Button
            small
            onPress={() => removeAllAction()}
            iconName="notification-clear-all">
            <>{' ' + t('remindersScreen.deleteAll')}</>
          </Button>
          <Button small onPress={() => addReminder()} iconName="plus-circle">
            <>{' ' + t('remindersScreen.addReminder')}</>
          </Button>
        </View>
        <View>
          {activeSelect && (
            <View style={styles.selectTitleContainer}>
              {selectedLists.length > 0 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={removeAction}>
                  <Text color="#e30006" size="body">
                    {t('common.delete')} {`${selectedLists.length} `}
                    {selectedLists.length === 1
                      ? t('homeScreen.element')
                      : t('homeScreen.elements')}
                  </Text>
                </TouchableOpacity>
              )}
              {selectedLists.length === 0 && (
                <Text size="body">{t('homeScreen.zeroSelected')}</Text>
              )}
            </View>
          )}
        </View>
        <FlashList
          data={currentList}
          estimatedItemSize={currentList.length === 0 ? 1 : currentList.length}
          ListEmptyComponent={
            <View style={styles.noElements}>
              <Text>{t('remindersScreen.noItems')}</Text>
            </View>
          }
          renderItem={({item}) => <RenderReminder reminder={item} />}
        />
      </Container>
    </>
  );
}
