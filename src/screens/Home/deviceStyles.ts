import { isDeviceTablet } from "../../../hook/isTablet";
import styles from "./styles";

export const deviceStyles = {
  imageBackground: isDeviceTablet ? styles.image : styles.imageMobile
};
