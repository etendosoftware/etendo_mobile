import React, {useEffect} from 'react';
import {isTablet} from './IsTablet';
import Orientation from 'react-native-orientation-locker';

export const useNonRotationScreen = () => {
  useEffect(() => {
    if (isTablet()) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
  }, []);
};
