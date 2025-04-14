import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Camera,
  CameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { ICameraBarCodeProps } from './types';
import { CAMERA_STATUS, CODE_TYPES, SIDE_CAMERA } from './constants';

const CameraBarCode = ({ ableToRead, handleReadCode }: ICameraBarCodeProps) => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [deviceSelected, setDevicesSelected] = useState<CameraDevice | null>(
    null,
  );

  const handleCameraPermission = async () => {
    await Camera.requestCameraPermission();
    setCameraPermission(true);
  };

  useEffect(() => {
    (async () => {
      const cameraPermissions = await Camera.getCameraPermissionStatus();
      setCameraPermission(cameraPermissions === CAMERA_STATUS);
      const devicesAvailable = Camera.getAvailableCameraDevices();
      const backCamera = devicesAvailable.filter(
        item => item.position == SIDE_CAMERA,
      );
      const backCameraSelected = backCamera.length
        ? (backCamera.shift() as CameraDevice)
        : null;
      setDevicesSelected(backCameraSelected as CameraDevice);
    })();
    handleCameraPermission();
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: CODE_TYPES,
    onCodeScanned: codes => {
      const firstCode = codes[0]?.value;
      if (firstCode) {
        handleReadCode(firstCode);
      }
    },
  });

  return deviceSelected && cameraPermission ? (
    <Camera
      codeScanner={codeScanner}
      style={StyleSheet.absoluteFill}
      device={deviceSelected}
      isActive={ableToRead}
    />
  ) : null;
};

export default CameraBarCode;
