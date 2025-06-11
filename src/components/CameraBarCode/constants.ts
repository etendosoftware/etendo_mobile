import { CodeType } from 'react-native-vision-camera';

export const CAMERA_STATUS = 'granted';
export const SIDE_CAMERA = 'back';
export const CODE_TYPES: CodeType[] = [
  'code-128',
  'code-39',
  'code-93',
  'codabar',
  'ean-13',
  'ean-8',
  'itf',
  'upc-e',
  'upc-a',
  'qr',
  'pdf-417',
  'aztec',
  'data-matrix',
];
