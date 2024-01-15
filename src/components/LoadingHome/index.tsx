import React from "react";
import CardDropdown from "etendo-ui-library/dist-native/components/cards/components/cardDropdown/CardDropdown";
import { View } from "react-native";
import { styles } from "./styles";

const LoadingHome = () => {
  const numberOfCards = 4;

  const cardComponents = [];

  for (let i = 0; i < numberOfCards; i++) {
    cardComponents.push(
      <View style={i !== 0 && styles.cardContainer} key={i}>
        <CardDropdown title={""} />
      </View>
    );
  }

  return <View style={styles.container}>{cardComponents}</View>;
};

export default LoadingHome;
