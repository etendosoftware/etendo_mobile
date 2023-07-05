/* Imports */
import { Dimensions, PixelRatio } from "react-native";

// getting screen width and height
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

// function that allows to know if the screen of the device is a cell phone or a tablet
export const isTablet = () => {
  let pixelDensity = PixelRatio.get();
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else {
    return (
      pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
    );
  }
};

// function that checks if the screen of the device is less or equal than specified width and height
export const isTabletSmall = () => {
  let pixelDensity = PixelRatio.get();
  const adjustedHeight = height * pixelDensity;

  return adjustedHeight <= 601;
};
