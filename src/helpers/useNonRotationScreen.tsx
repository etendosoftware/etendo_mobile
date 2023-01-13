import { useEffect } from "react";
import Orientation from "react-native-orientation-locker";
import { isTablet } from "./IsTablet";

export const useNonRotationScreen = () => {
  useEffect(() => {
    if (isTablet()) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
  }, []);
};
