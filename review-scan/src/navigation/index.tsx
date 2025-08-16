import React from 'react';
import {Platform, SafeAreaView, StyleSheet} from 'react-native';
import App from './App';
import {useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';
import {colors} from '../theme';

export default function Navigation() {
  const currentTheme = useSelector(selectTheme);
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors[currentTheme].background,
    },
  });

  if (Platform.OS === 'ios') {
    return (
      <>
        <App />
        <SafeAreaView style={styles.safeArea} />
      </>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <App />
      </SafeAreaView>
    </>
  );
}
