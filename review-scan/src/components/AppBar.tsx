import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Text from './Text';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import Icon from '@react-native-vector-icons/ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {selectTheme, setFirstTime} from '../redux/slices/app.slice';
import {colors} from '../theme';

export default function AppBar({
  options,
  navigation,
  route,
}: NativeStackHeaderProps) {
  const currentTheme = useSelector(selectTheme);
  const {width, height} = useWindowDimensions();
  const dispatch = useDispatch();

  const styles = StyleSheet.create({
    backContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    container: {
      flexDirection: 'row',
      gap: 10,
      height: height > width ? height * 0.12 : height * 0.12,
      maxHeight: 100,
      width: width,
      backgroundColor: colors[currentTheme].button,
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingBottom: 10,
      paddingLeft: 20,
      zIndex: 2,
    },
    buttons: {
      flexDirection: 'row',
      gap: 20,
      marginRight: 20,
    },
  });

  const params = route?.params as {isTab?: boolean | undefined};
  const isTab = params?.isTab ?? false;

  return (
    <View style={styles.container}>
      <View style={styles.backContainer}>
        {navigation.canGoBack() && !isTab && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={25} color="#FFF" />
          </TouchableOpacity>
        )}

        <Text size="large" color="#FFF">
          {options.title || ''}
        </Text>
      </View>
      {(!navigation.canGoBack() || isTab) && (
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => dispatch(setFirstTime({status: true}))}>
            <Icon name="help-circle-outline" color="#FFF" size={30} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
