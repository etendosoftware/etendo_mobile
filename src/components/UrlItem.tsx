import React, { useState } from "react";
import { deviceStyles as styles } from "../screens/Settings/deviceStyles";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { isTablet } from "../helpers/IsTablet";

export const UrlItem = ({
  item,
  setValueEnvUrl,
  deleteUrl,
  setIsUpdating,
  modalUrl,
  url,
  setUrl,
  resetLocalUrl,
  handleOptionSelected
}) => {
  const [clicked, setClicked] = useState(false);
  const [clickDelete, setClickDelete] = useState(false);
  const handleEdit = () => {
    setValueEnvUrl(item);
    deleteUrl(item);
    setIsUpdating(true);
  };

  const handleTrash = () => {
    setClickDelete(!clickDelete);
    setClicked(!clicked);
  };

  const handleConfirm = async () => {
    deleteUrl(item);
    setClickDelete(false);
    setClicked(false);
    if (!url || !modalUrl) {
      setUrl(null);
      resetLocalUrl();
    }
  };

  const handleDelete = () => {
    setClickDelete(!clickDelete);
    setClicked(false);
  };

  return (
    <View style={[styles.urlItem, clicked && styles.urlItemBackgroundFilled]}>
      <TouchableOpacity
        style={styles.urlItemContainer}
        onPress={() => {
          !clickDelete && setClicked(!clicked);
          handleOptionSelected({ value: item });
        }}
      >
        {clickDelete && (
          <Image
            style={styles.iconImage}
            source={require("../../assets/icons/trash.png")}
          />
        )}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.urlListed,
            styles.urlItemContainerElem,
            {
              width: !clickDelete
                ? isTablet()
                  ? "90%"
                  : "80%"
                : isTablet()
                ? "85%"
                : "75%"
            }
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          clickDelete ? handleConfirm() : handleEdit();
        }}
        style={styles.actionIcon}
      >
        {clickDelete ? (
          <Image
            style={styles.iconImage}
            source={require("../../assets/icons/confirm.png")}
          />
        ) : (
          <Image
            style={styles.iconImage}
            source={require("../../assets/icons/edit.png")}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          clickDelete ? handleDelete() : handleTrash();
        }}
        style={styles.actionIcon}
      >
        {clickDelete ? (
          <Image
            style={styles.iconImage}
            source={require("../../assets/icons/delete.png")}
          />
        ) : (
          <Image
            style={styles.iconImage}
            source={require("../../assets/icons/trash.png")}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
