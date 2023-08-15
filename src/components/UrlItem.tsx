import React, { useState, useCallback } from "react";
import { deviceStyles as styles } from "../screens/Settings/deviceStyles";
import { View, Image, Text, TouchableOpacity } from "react-native";

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

  const getIconSource = (clickDelete, clicked) => {
    if (clickDelete) {
      return require("../../assets/icons/trash.png");
    } else if (clicked) {
      return require("../../assets/icons/radio-focused.png");
    }
    return require("../../assets/icons/radio-default.png");
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
        <Image
          style={styles.iconImage}
          source={getIconSource(clickDelete, clicked)}
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.urlListed, styles.urlItemContainerElem]}
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
