import * as React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../components/Container';
import Text from '../../components/Text';
import Button from '../../components/Button';
import {selectTheme, setTheme} from '../../redux/slices/app.slice';
import {colors} from '../../theme';
import {useTranslation} from 'react-i18next';

export default function SettingScreen() {
  const {i18n, t} = useTranslation();
  const currentTheme = useSelector(selectTheme);
  const dispatch = useDispatch();
  const ChangeTheme = () => {
    if (currentTheme === 'light') {
      dispatch(setTheme('dark'));
    } else {
      dispatch(setTheme('light'));
    }
  };

  const changeLanguage = () => {
    const current = i18n.language;
    if (current === 'es') {
      i18n.changeLanguage('en');
    } else {
      i18n.changeLanguage('es');
    }
  };

  const sendMail = () => {
    Linking.openURL('mailto:rodrigomendezdev@gmail.com');
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: 20,
    },
    buttonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
    },
  });
  return (
    <Container>
      <View style={styles.container}>
        <Button transparent testID="themeButton" onPress={ChangeTheme}>
          <View style={styles.buttonContainer}>
            <Icon
              name="dark-mode"
              size={20}
              color={colors[currentTheme].transparent}
            />
            <Text
              color={colors[currentTheme].transparent}
              testID="darkText"
              buttonText>
              {currentTheme === 'light'
                ? t('settingScreen.darkMode')
                : t('settingScreen.lightMode')}
            </Text>
          </View>
        </Button>
        <Button transparent testID="themeButton" onPress={changeLanguage}>
          <View style={styles.buttonContainer}>
            <Icon
              name="language"
              size={20}
              color={colors[currentTheme].transparent}
            />
            <Text
              color={colors[currentTheme].transparent}
              testID="darkText"
              buttonText>
              {t('settingScreen.switchSpanish')}
            </Text>
          </View>
        </Button>
        <Button testID="themeButton" onPress={sendMail}>
          <View style={styles.buttonContainer}>
            <Icon
              name="bug-report"
              size={20}
              color={colors[currentTheme].buttonText}
            />
            <Text
              color={colors[currentTheme].buttonText}
              testID="darkText"
              buttonText>
              {t('settingScreen.bugReport')}
            </Text>
          </View>
        </Button>
      </View>
    </Container>
  );
}
