import React, {ReactElement} from 'react';
import {View, StyleSheet, ScrollView, useWindowDimensions} from 'react-native';
import {colors} from '../theme';
import {useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';

export default function Container({
  children,
  scroll,
  noPadding,
}: {
  children: ReactElement | ReactElement[] | null;
  scroll?: boolean;
  os?: string;
  noPadding?: boolean;
}) {
  const {width, height} = useWindowDimensions();
  const currentTheme = useSelector(selectTheme);
  const styles = StyleSheet.create({
    main: {
      flex: 1,
      width,
      paddingLeft: width * 0.05,
      paddingRight: width * 0.05,
      backgroundColor: colors[currentTheme].background,
      height: height - 200,
    },
    scrollContainer: {
      height: height,
    },
    contentContainer: {
      minHeight: height,
      paddingBottom: noPadding ? 0 : height * 0.18,
    },
  });
  if (scroll) {
    return (
      <View style={styles.main}>
        <View style={styles.scrollContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never">
            <View style={styles.contentContainer}>{children}</View>
          </ScrollView>
        </View>
      </View>
    );
  }
  return <View style={styles.main}>{children}</View>;
}
