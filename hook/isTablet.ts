import { Dimensions, PixelRatio } from "react-native";

// getting screen width and height
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

// function that allows to know if the screen of the device is a cell phone or a tablet
export const isTablet = () => {
  let pixelDensity = PixelRatio.get();
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;
  if (pixelDensity < 1.6 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else
    return (
      pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
    );
};

export const isDeviceTablet = isTablet();

export const isTabletSmall = () => {
  const { width, height } = Dimensions.get("window");
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;

  return pixelDensity < 1.6 && adjustedWidth < 1200 && adjustedHeight < 832;
};

export const isDeviceTabletSmall = isTabletSmall();
