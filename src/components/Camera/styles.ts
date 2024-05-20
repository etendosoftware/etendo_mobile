import { StyleSheet } from 'react-native';
import { isTablet } from '../../helpers/IsTablet';

export const styles = StyleSheet.create({
  buttonContainer: {
    width: isTablet() ? '30%' : '100%',
  },
  icon: {
    height: 15,
  },
  frameProsessor: {
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: -1,
    position: 'relative',
  },
  buttonPosition: {
    position: 'absolute',
    bottom: 30,
    height: '100%',
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
});
