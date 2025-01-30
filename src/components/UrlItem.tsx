import React, { useState } from 'react';
import { deviceStyles as styles } from '../screens/Settings/deviceStyles';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTablet } from '../helpers/IsTablet';
import { selectContextPathUrl, setContextPathUrl } from '../../redux/user';
import { useAppDispatch, useAppSelector } from '../../redux';
import { formatEnvironmentUrl } from '../ob-api/ob';
import {
  CheckIcon,
  Edit2Icon,
  Trash2Icon,
  XIcon,
} from 'etendo-ui-library';

export const UrlItem = ({
  item,
  setValueEnvUrl,
  deleteUrl,
  setIsUpdating,
  modalUrl,
  url,
  setUrl,
  resetLocalUrl,
  handleOptionSelected,
  setLocalContextPath,
}) => {
  const dispatch = useAppDispatch();
  const prevContext = useAppSelector(selectContextPathUrl);

  const [clicked, setClicked] = useState(false);
  const [clickDelete, setClickDelete] = useState(false);

  const getContextPath = (url: string): string => {
    let index = 0;
    let slashCount = 0;

    while (slashCount < 3 && index < url.length) {
      if (url.charAt(index) === '/') {
        slashCount++;
      }
      if (slashCount < 3) {
        index++;
      }
    }

    if (slashCount === 3) {
      return url.substring(index);
    }

    return '';
  };

  const handleEdit = async () => {
    const newContext = getContextPath(item);
    setLocalContextPath(newContext);
    setValueEnvUrl(formatEnvironmentUrl(item));

    if (newContext !== prevContext) {
      dispatch(setContextPathUrl(newContext));
      await AsyncStorage.setItem('contextPathUrl', newContext);
    }

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
        {clickDelete && <Trash2Icon style={styles.iconImage} />}
        <Text
          numberOfLines={1}
          ellipsizeMode='tail'
          style={[
            styles.urlListed,
            styles.urlItemContainerElem,
            {
              width: !clickDelete
                ? isTablet()
                  ? '90%'
                  : '80%'
                : isTablet()
                  ? '85%'
                  : '75%',
            },
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
        testID='edit-button'
      >
        {clickDelete ? (
          <CheckIcon style={styles.iconImage} />
        ) : (
          <Edit2Icon style={styles.iconImage} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          clickDelete ? handleDelete() : handleTrash();
        }}
        style={styles.actionIcon}
      >
        {clickDelete ? (
          <XIcon style={styles.iconImage} />
        ) : (
          <Trash2Icon style={styles.iconImage} />
        )}
      </TouchableOpacity>
    </View>
  );
};
