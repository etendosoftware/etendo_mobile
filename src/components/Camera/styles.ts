import { StyleSheet } from 'react-native';
import { isTablet } from '../../helpers/IsTablet';

export const styles = StyleSheet.create({
  buttonContainer: {
    width: isTablet ? '30%' : '100%',
  },
  icon: {
    height: 15,
  },
  full: {
    width: '100%',
    height: '100%',
  },
  centerColumn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
