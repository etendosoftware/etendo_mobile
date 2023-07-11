//Imports
import React, { useEffect, useState } from "react";
import { View, Image, Text, DeviceEventEmitter } from "react-native";
import locale from "../../i18n/locale";
import { User } from "../../stores";
import { observer } from "mobx-react";
import withAuthentication from "../../withAuthentication";
import {
  getOrganizationName,
  getClientName,
  getWarehouseName,
  getRoleName
} from "../../globals/getRoleInformation";
import { ShowProfilePicture } from "../../components";
import { isTablet } from "../../../hook/isTablet";
import ButtonUI from "etendo-ui-library/dist-native/components/button/Button";
import { BackIcon } from "etendo-ui-library/dist-native/assets/images/icons/BackIcon";
import { deviceStyles as styles } from "./deviceStyles";
import { useFocusEffect } from "@react-navigation/native";

const Profile = observer((props) => {
  //States
  const [role, setRole] = useState<string>("");
  const [org, setOrg] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [warehouse, setWarehouse] = useState<string>("");

  useFocusEffect(() => {
    if (!isTablet()) {
      DeviceEventEmitter.emit("showNavbar", { state: false });
    }
  });

  useEffect(() => {
    if (User.data) {
      Promise.all([
        getOrganizationName(),
        getRoleName(),
        getWarehouseName(),
        getClientName()
      ])
        .then((values) => {
          const [org, role, warehouse, client] = values;
          setRole(role);
          setOrg(org);
          setClient(client);
          setWarehouse(warehouse);
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }, []);

  const getBackgroundProfile = () => {
    return isTablet()
      ? require("../../img/tablet-profile.png")
      : require("../../img/profile-background.png");
  };

  return (
    <View style={styles.fullContainer}>
      <View style={styles.getProfilePictureStyle}>
        <View style={styles.pageTitleStyle}>
          <Text style={styles.profileTitleStyle}>{locale.t("Profile")}</Text>
          <ButtonUI
            image={<BackIcon style={styles.backIcon} />}
            height={32}
            width={84}
            typeStyle="terciary"
            text={locale.t("Back")}
            onPress={() => {
              props.navigation.goBack();
            }}
          />
        </View>
        <Image source={getBackgroundProfile()} style={styles.imageHeader} />
        <View style={styles.getUserDataStyle}>
          <View style={styles.getProfilePictureStyle}>
            <ShowProfilePicture size={130} username={User.data.username} />
          </View>
          <Text style={styles.userNameStyle}>{User.data.username}</Text>
        </View>
      </View>
      <View style={styles.accountDataContainer}>
        {!isTablet() && (
          <Text style={styles.accountTitleStyle}>
            {locale.t("Profile:Account")}
          </Text>
        )}
        <View style={styles.getinformationCardStyle}>
          <View style={styles.individualInfoContainerStyle}>
            <Text style={styles.titleStyle}>{locale.t("Profile:Role")}</Text>
            <Text style={styles.getDescriptionStyle} numberOfLines={3}>
              {role === null || org === " " ? "*" : role}
            </Text>
          </View>
          <View style={styles.individualInfoContainerStyle}>
            <Text style={styles.titleStyle}>{locale.t("Profile:Org")}</Text>
            <Text style={styles.getDescriptionStyle} numberOfLines={3}>
              {org === null || org === " " ? "*" : org}
            </Text>
          </View>
          <View style={styles.individualInfoContainerStyle}>
            <Text style={styles.titleStyle}>{locale.t("Profile:Client")}</Text>
            <Text style={styles.getDescriptionStyle} numberOfLines={3}>
              {client === null || client === " " ? "*" : org}
            </Text>
          </View>
          <View style={styles.lastInfoContainerStyle}>
            <Text style={styles.titleStyle}>
              {locale.t("Profile:warehouse")}
            </Text>
            <Text style={styles.descriptionStyleLast} numberOfLines={3}>
              {warehouse === null || org === " " ? "*" : warehouse}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default withAuthentication(Profile);
