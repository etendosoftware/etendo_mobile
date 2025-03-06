import React from "react";
import { View, Image, Text } from "react-native";
import { styles } from "./style";

interface Props {
  username?: string;
  bindaryData?: string;
}

const ShowProfilePicture = ({ username, bindaryData }: Props) => {
  const getInitials = (string?: string) => {
    if (!string) return;

    let names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <View style={styles.container}>
      {bindaryData ? (
        <Image
          style={styles.image}
          source={{
            uri: `data:image/jpeg;base64,${bindaryData}`
          }}
        />
      ) : (
        <Text style={styles.text}>{getInitials(username)}</Text>
      )}
    </View>
  );
};

export default ShowProfilePicture;
