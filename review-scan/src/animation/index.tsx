import {SharedTransition} from 'react-native-reanimated';
import {withSpring} from 'react-native-reanimated';

const duration = 1000;
const transition = SharedTransition.custom(values => {
  'worklet';
  return {
    height: withSpring(values.targetHeight, {duration}),
    width: withSpring(values.targetWidth, {duration}),
    originX: withSpring(values.targetOriginX, {duration}),
    originY: withSpring(values.targetGlobalOriginY, {duration}),
  };
});

export default transition;
