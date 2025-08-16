import React from 'react';
import {Dimensions, View, Text as RText} from 'react-native';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Text from './Text';
import {colors} from '../theme';
import {useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';

interface Props {
  item: {
    id: string;
    title: string;
    emoji: string;
  };
  setSelectedCategory: (idx: number) => void;
  close: () => void;
  showModalCard: () => void;
  index: number;
}
const radiusSize = 30;
const {width} = Dimensions.get('screen');

export default function RenderSuggestedItem({
  close,
  item,
  setSelectedCategory,
  showModalCard,
  index,
}: Props) {
  const currentTheme = useSelector(selectTheme);

  const styles = StyleSheet.create({
    cardContainer: {
      width: width * 0.43,
      height: width * 0.43,
      backgroundColor: colors[currentTheme].background,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      zIndex: 2,
      elevation: 2,
      marginTop: 10,
      borderRadius: 15,
    },
    containerSwipe: {
      padding: 1,
      width: width * 0.4,
    },
    container: {
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
    },
    titleContainer: {
      alignItems: 'center',
      gap: 5,
    },
    itemsContainer: {
      paddingTop: 20,
      paddingBottom: 10,
      paddingHorizontal: 20,
      backgroundColor: colors[currentTheme].background,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButton: {
      height: 30,
      width: 30,
      borderRadius: 30,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors[currentTheme].button,
    },
    downIcon: {
      marginRight: 10,
    },
    actionsContainer: {
      width: width * 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      height: width * 0.2,
      backgroundColor: '#d70a26',
      marginTop: 20,
    },
    deleteButton: {
      padding: 10,
    },
    selected: {
      height: radiusSize,
      width: radiusSize,
      borderRadius: radiusSize,
      backgroundColor: colors[currentTheme].button,
      borderWidth: 1,
      borderColor: colors[currentTheme].button,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notSelected: {
      height: radiusSize,
      width: radiusSize,
      borderRadius: radiusSize,
      borderWidth: 1,
      borderColor: colors[currentTheme].button,
    },
  });

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedCategory(index);
        showModalCard();
        close();
      }}
      activeOpacity={1}
      style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={styles.titleContainer}>
          <RText style={{fontSize: 40}}>{item.emoji}</RText>
          <View>
            <Text bold>{item.title}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
