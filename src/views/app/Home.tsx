import * as React from 'react';
import dayjs from 'dayjs';
import {useDispatch, useSelector} from 'react-redux';
import relativeTime from 'dayjs/plugin/relativeTime';
import Text from '../../components/Text';
import Container from '../../components/Container';
import Button from '../../components/Button';
import 'dayjs/locale/es-mx';
import {
  MainList,
  changeMainList,
  removeMainList,
  selectList,
} from '../../redux/slices/list.slice';
import RenderList from '../../components/RenderList';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from '../../navigation/App';
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Appearance,
} from 'react-native';
import {useEffect, useState} from 'react';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import Stepper from '../../components/Stepper';
import {
  selectFirstTime,
  selectTheme,
  setFirstTime,
  setTheme,
} from '../../redux/slices/app.slice';
import {colors} from '../../theme';
import {useTranslation} from 'react-i18next';

dayjs.extend(relativeTime);

export default function HomeScreen() {
  const {t} = useTranslation();
  const currentTheme = useSelector(selectTheme);
  const {height} = useWindowDimensions();
  const dispatch = useDispatch();
  const firstTime = useSelector(selectFirstTime);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const currentList = useSelector(selectList) as MainList[];
  const [activeSelect, setActiveSelect] = useState(false);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const addList = () => {
    navigation.navigate('AddList', {
      windowTitle: t('homeScreen.addNewListTitle'),
    });
  };

  useEffect(() => {
    if (firstTime) {
      const colorScheme = Appearance.getColorScheme();
      if (colorScheme === 'dark') {
        dispatch(setTheme('dark'));
      } else {
        dispatch(setTheme('light'));
      }
    }
  }, [currentTheme, dispatch, firstTime]);

  const styles = StyleSheet.create({
    helpButton: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: 50,
      backgroundColor: colors[currentTheme].background,
      borderRadius: 35,
      position: 'absolute',
      right: 30,
      bottom: height * 0.24,
      elevation: 3,
      zIndex: 999,
    },
    darkButton: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: 50,
      backgroundColor: colors[currentTheme].background,
      borderRadius: 35,
      position: 'absolute',
      right: 30,
      bottom: height * 0.15,
      elevation: 3,
      zIndex: 999,
    },
    removeButton: {
      borderRadius: 20,
      padding: 10,
      borderColor: '#e30006',
      borderWidth: 1,
    },
    selectTitleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    container: {
      marginTop: 30,
    },
    spaceTop: {
      marginTop: 20,
    },
    stylesContainerButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginTop: -height * 0.01,
    },
    bottomContainer: {
      marginTop: 25,
      paddingBottom: 120,
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
    listContainer: {
      height: activeSelect ? height * 0.7 : height * 0.8,
    },
  });

  const adListToSelected = (id: string) => {
    const tmp = [...selectedLists];
    const found = tmp.indexOf(id);
    if (found !== -1) {
      tmp.splice(found, 1);
    } else {
      tmp.push(id);
    }
    setSelectedLists(tmp);
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
            dispatch(removeMainList({id: el}));
          });
          setSelectedLists([]);
          setActiveSelect(false);
        },
      },
    ]);
  }

  const onFinishStepper = () => {
    dispatch(setFirstTime({status: false}));
  };

  return (
    <Container>
      <View style={styles.container} />
      <>{firstTime && <Stepper onFinished={onFinishStepper} />}</>
      <View style={styles.stylesContainerButton}>
        <Button
          transparent
          disabled={currentList.length === 0}
          small
          iconName={!activeSelect ? 'check' : undefined}
          onPress={() =>
            setActiveSelect(prev => {
              setSelectedLists([]);
              return !prev;
            })
          }>
          <>
            {!activeSelect && <>{t('homeScreen.check')}</>}
            {activeSelect && t('common.cancel')}
          </>
        </Button>
        <Button small onPress={() => addList()} iconName="list-box">
          {t('homeScreen.addListTitle')}
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
      <>
        {currentList?.length === 0 && (
          <View style={styles.noElements}>
            <Text>{t('homeScreen.noItems')}</Text>
          </View>
        )}
      </>
      <View style={styles.listContainer}>
        <DraggableFlatList
          data={currentList || []}
          onDragEnd={({data}) =>
            dispatch(
              changeMainList({
                items: data,
              }),
            )
          }
          keyExtractor={(item: MainList) => item.id}
          showsVerticalScrollIndicator={false}
          extraData={[activeSelect, selectedLists]}
          renderItem={({item, drag, isActive}: RenderItemParams<MainList>) => (
            <RenderList
              adListToSelected={adListToSelected}
              activeSelect={activeSelect}
              selectedLists={selectedLists}
              drag={drag}
              isActive={isActive}
              list={item}
            />
          )}
        />
      </View>
    </Container>
  );
}
