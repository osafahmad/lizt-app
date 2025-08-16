import React from 'react';
import {
  Modal,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';
import Text from './Text';
import {useState} from 'react';
import CreateGif from '../assets/create.gif';
import DeleteGif from '../assets/delete.gif';
import ListGif from '../assets/list.gif';
import ReordenarGif from '../assets/reordenar.gif';
import FastImage from 'react-native-fast-image';
import Icon from '@react-native-vector-icons/material-icons';
import {useTranslation} from 'react-i18next';

interface Props {
  onFinished: () => void;
}

export default function Stepper({onFinished}: Props) {
  const {t} = useTranslation();
  const {width, height} = useWindowDimensions();
  const [step, setStep] = useState(0);
  const styles = StyleSheet.create({
    container: {
      width: width * 0.8,
      height: width,
      alignItems: 'center',
    },
    backDrop: {
      backgroundColor: 'rgba(0,0,0,0.9)',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      alignItems: 'center',
      paddingTop: height * 0.15,
    },
    descriptionContainer: {
      marginTop: 20,
    },
    box: {
      width: width * 0.8,
      height: width * 0.8,
      marginTop: 20,
      borderRadius: 15,
    },
    buttonContainer: {
      marginTop: 40,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      width: width * 0.8,
    },
    button: {
      borderColor: '#FFF',
      borderWidth: 1,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      width: 120,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 40,
      zIndex: 99999,
    },
  });
  const steps = [
    {
      title: t('welcomeModal.welcome'),
      image: CreateGif,
      description: t('welcomeModal.welcomeDesc'),
    },
    {
      title: t('welcomeModal.select'),
      image: ListGif,
      description: t('welcomeModal.selectDesc'),
    },
    {
      title: t('welcomeModal.delete'),
      image: DeleteGif,
      description: t('welcomeModal.deleteDesc'),
    },
    {
      title: t('welcomeModal.reorder'),
      image: ReordenarGif,
      description: t('welcomeModal.reorderDesc'),
    },
  ];

  return (
    <>
      <StatusBar backgroundColor={'rgba(0,0,0,0.9)'} />
      <Modal transparent>
        <TouchableOpacity onPress={onFinished} style={styles.closeButton}>
          <Icon name="close" size={40} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.backDrop}>
          <Animated.View style={[styles.container]}>
            <Text bold color="#FFF" size="large">
              {steps[step].title}
            </Text>
            <FastImage source={steps[step].image} style={styles.box} />
            <View style={styles.descriptionContainer}>
              <Text color="#FFF" size="body" center>
                {steps[step].description}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              {step === 0 && <View />}

              {step !== 0 && step < steps.length && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setStep(prev => prev - 1)}>
                  <Text color="#FFF" size="body">
                    {t('welcomeModal.previous')}
                  </Text>
                </TouchableOpacity>
              )}

              {step < steps.length - 1 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setStep(prev => prev + 1)}>
                  <Text color="#FFF" size="body">
                    {t('welcomeModal.next')}
                  </Text>
                </TouchableOpacity>
              )}

              {step === steps.length - 1 && (
                <TouchableOpacity style={styles.button} onPress={onFinished}>
                  <Text color="#FFF" size="body">
                    {t('welcomeModal.finish')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
