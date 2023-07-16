import { View } from "react-native";
import React from "react";
import CardDropdown from "etendo-ui-library/dist-native/components/cards/cardDropdown/CardDropdown";
import { styles } from "./styles";

const LoadingHome = () => {
  return (
    <View style={styles.container}>
      <View>
        <CardDropdown title={""} />
      </View>
      <View style={styles.cardContainer}>
        <CardDropdown title={""} />
      </View>
      <View style={styles.cardContainer}>
        <CardDropdown title={""} />
      </View>
      <View style={styles.cardContainer}>
        <CardDropdown title={""} />
      </View>
      <View style={styles.cardContainer}>
        <CardDropdown title={""} />
      </View>
      <View style={styles.cardContainer}>
        <CardDropdown title={""} />
      </View>
      <View style={styles.cardContainer}>
        <CardDropdown title={""} />
      </View>
    </View>
  );
};

export default LoadingHome;
