import React, {ReactElement} from 'react';
import {Text as RText, StyleSheet} from 'react-native';
import {fontSize, colors} from '../theme';
import {useSelector} from 'react-redux';
import {selectTheme} from '../redux/slices/app.slice';

interface Props {
  children: string | string[] | ReactElement;
  size?: 'body' | 'small' | 'normal' | 'large' | 'extra';
  bold?: boolean;
  color?: string;
  buttonText?: boolean;
  testID?: string;
  emoji?: boolean;
  done?: boolean;
  center?: boolean;
}

export default function Text({
  children,
  size = 'normal',
  bold = false,
  color,
  buttonText,
  testID,
  emoji,
  done,
  center,
}: Props) {
  const currentTheme = useSelector(selectTheme);
  const styles = StyleSheet.create({
    main: {
      fontFamily: bold ? 'Montserrat-Bold' : 'Montserrat-Regular',
      fontSize: emoji ? 35 : fontSize[size],
      textDecorationLine: done ? 'line-through' : 'none',
      textAlign: center ? 'center' : 'left',
      justifyContent: 'center',
      alignItems: 'center',
      color: color
        ? color
        : buttonText
        ? colors[currentTheme].buttonText
        : colors[currentTheme].text,
    },
  });

  return (
    <RText testID={testID} style={styles.main}>
      {children}
    </RText>
  );
}
