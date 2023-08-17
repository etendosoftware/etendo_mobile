import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";

const App = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    setHasPermission(newCameraPermission === "authorized");
  };

  const devices = useCameraDevices();
  const device = devices.back;

  if (hasPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No access to camera, has not permission this App</Text>
      </View>
    );
  }

  if (hasPermission === null || !device) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No access to camera, has not found device</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
    </View>
  );
};

export default App;
