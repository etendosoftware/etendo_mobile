import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import locale from "../../i18n/locale";
import { Appbar, List, Text } from "react-native-paper";
import { User } from "../../stores";
import { observer } from "mobx-react";
import withAuthentication from "../../withAuthentication";
import { OBRest, Restrictions } from "obrest";
import { IRecord } from "../../types/Record";
import { ShowProfilePicture } from "../../components";
import { isTablet } from "../../../hook/isTablet";
import styles from "./styles";
import ButtonUI from "../../../ui/components/button/Button";
import { Navbar } from "../../../ui/components";
import { BackIcon } from "../../../ui/assets/images/icons/BackIcon";

const Profile = observer((props) => {
  const [role, setRole] = useState<string>("");
  const [org, setOrg] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [warehouse, setWarehouse] = useState<string>("");

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
  const getStyleItemList = () => {
    return isTablet() ? styles.itemListStyleTablet : styles.itemListStyleMobile;
  };
  const getStyleItemListFirst = () => {
    return isTablet() ? styles.itemListStyleFirst : styles.itemListStyleMobile;
  };
  const getStyleItemListLastTablet = () => {
    return isTablet()
      ? styles.itemListStyleLastTablet
      : styles.itemListStyleMobile;
  };

  const getStyleContainer = () => {
    return isTablet() ? styles.containerTablet : styles.containerMobile;
  };

  const getOrganizationName = async () => {
    let criteria = OBRest.getInstance().createCriteria("Organization");
    criteria.add(Restrictions.equals("id", User.data.organization));
    let org: IRecord = await criteria.uniqueResult();
    return org.name;
  };

  const getClientName = async () => {
    let criteria = OBRest.getInstance().createCriteria("ADClient");
    criteria.add(Restrictions.equals("id", User.data.client));
    let client: IRecord = await criteria.uniqueResult();
    return client.name;
  };

  const getWarehouseName = async () => {
    let criteria = OBRest.getInstance().createCriteria("Warehouse");
    criteria.add(Restrictions.equals("id", User.data.warehouseId));
    let warehouse: IRecord = await criteria.uniqueResult();
    return warehouse?.name;
  };

  const getRoleName = async () => {
    let criteria = OBRest.getInstance().createCriteria("ADRole");
    criteria.add(Restrictions.equals("id", User.data.roleId));
    let role: IRecord = await criteria.uniqueResult();
    return role.name;
  };

  const geyBackgroundProfile = () => {
    return isTablet()
      ? require("../../img/tablet-profile.png")
      : require("../../img/profile-background.png");
  };

  const getProfilePictureStyle = () => {
    return isTablet() ? styles.profilePictureTablet : styles.profilePicture;
  };

  const getUserDataStyle = () => {
    return isTablet() ? styles.userDataTablet : styles.userData;
  };

  const userNameContainer = () => {
    return isTablet()
      ? styles.userNameContainerTablet
      : styles.userNameContainer;
  };
  const imageHeader = () => {
    return isTablet() ? styles.imageHeaderTablet : styles.imageHeader;
  };
  const accountDataContainer = () => {
    return isTablet() ? styles.accountDataContainer : null;
  };
  const accountTitleStyle = () => {
    return isTablet() ? styles.accountTitleTablet : styles.accountTitle;
  };

  const getDescriptionStyle = () => {
    return isTablet() ? styles.descriptionStyleTablet : styles.descriptionStyle;
  };

  const getinformationCardStyle = () => {
    return isTablet() ? styles.informationCardTablet : null;
  };

  const getListSectionStyle = () => {
    return isTablet() ? styles.informationCardTablet : styles.informationCard;
  };

  return (
    <View style={styles.fullContainer}>
      {isTablet() ? (
        <View>
          <View style={styles.navbarTablet}>
            <Navbar
              profileImage={
                <ShowProfilePicture size={75} username={User?.data?.username} />
              }
              name={User?.data?.username}
              onOptionSelectedProfile={async () => {
                await User?.logout();
                !User?.token
                  ? await props?.navigation?.navigate("Login")
                  : null;
              }}
            />
          </View>
          <View style={styles.breadCumsTablet}>
            <Text style={styles.profileTitle}>{locale.t("Profile")}</Text>
            <ButtonUI
              image={<BackIcon style={styles.backIcon} />}
              height={32}
              width={84}
              typeStyle="terciary"
              text={locale.t("Back")}
              onPress={
                !User.token
                  ? () => props.navigation.navigate("Login")
                  : () => props.navigation.navigate("Home")
              }
            />
          </View>
        </View>
      ) : (
        <Appbar.Header dark={true} style={styles.header}>
          {!User.token && (
            <Appbar.BackAction
              onPress={() => props.navigation.navigate("Login")}
            />
          )}
          {User.token && (
            <Appbar.Action
              icon="menu"
              onPress={() => props.navigation.toggleDrawer()}
            />
          )}
          <Appbar.Content title={locale.t("Profile:Title")} />
        </Appbar.Header>
      )}
      <Image source={geyBackgroundProfile()} style={imageHeader()} />
      <View style={styles.accountContainer}>
        <View style={getStyleContainer()}>
          <View style={getUserDataStyle()}>
            <View style={getProfilePictureStyle()}>
              <ShowProfilePicture
                size={140}
                username={User.data.username}
              ></ShowProfilePicture>
            </View>
            <View style={userNameContainer()}>
              <Text allowFontScaling={false} style={styles.usernameText}>
                {User.data.username}
              </Text>
            </View>
          </View>
        </View>
        <View style={accountDataContainer()}>
          <Text style={accountTitleStyle()}>{locale.t("Profile:Account")}</Text>
          <View style={getinformationCardStyle()}>
            <List.Section style={getListSectionStyle()}>
              <List.Item
                title={locale.t("Profile:Role")}
                description={role === null || org === " " ? "*" : role}
                style={getStyleItemListFirst()}
                titleStyle={styles.titleStyle}
                descriptionStyle={getDescriptionStyle()}
                descriptionNumberOfLines={3}
              />
              <List.Item
                title={locale.t("Profile:Org")}
                description={org === null || org === " " ? "*" : org}
                style={getStyleItemList()}
                titleStyle={styles.titleStyle}
                descriptionStyle={getDescriptionStyle()}
                descriptionNumberOfLines={3}
              />
              <List.Item
                title={locale.t("Profile:Client")}
                description={client === null || client === " " ? "*" : org}
                style={getStyleItemList()}
                titleStyle={styles.titleStyle}
                descriptionStyle={getDescriptionStyle()}
                descriptionNumberOfLines={3}
              />

              <List.Item
                title={locale.t("Profile:warehouse")}
                description={
                  warehouse === null || org === " " ? "*" : warehouse
                }
                style={getStyleItemListLastTablet()}
                titleStyle={styles.titleStyle}
                descriptionStyle={styles.descriptionStyleLast}
                descriptionNumberOfLines={3}
              />
            </List.Section>
          </View>
        </View>
      </View>
    </View>
  );
});

export default withAuthentication(Profile);
