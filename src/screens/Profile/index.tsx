import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import locale from "../../i18n/locale";
import { Appbar, Button, Dialog, FAB, List, Text } from "react-native-paper";
import { User } from "../../stores";
import { observer } from "mobx-react";
import withAuthentication from "../../withAuthentication";
import { OBRest, Restrictions } from "obrest";
import { IRecord } from "../../types/Record";
import { defaultTheme } from "../../themes";
import { ShowProfilePicture } from "../../components";
import { isTablet } from "../../../hook/isTablet";
import styles from "./styles";

const settings = require("../../img/settings-profile.png");

const Profile = observer((props) => {

  const [showChangePicture, setShowChangePicture] = useState<boolean>(false);
  const [role, setRole] = useState<string>('');
  const [org, setOrg] = useState<string>('');
  const [client, setClient] = useState<string>('');
  const [warehouse, setWarehouse] = useState<string>('');

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
          setRole(role)
          setOrg(org)
          setClient(client)
          setWarehouse(warehouse)
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }, []);
  const getStyleItemList = () => {
    return { width: isTablet() ? "50%" : "100%" };
  };

  const getStyleList = () => {
    return { width: isTablet() ? "50%" : "80%", alignItems: "center" };
  };

  const getStyleContainer = () => {
    return isTablet() ? styles.containerTablet : styles.containerMobile;
  };

  const getStyleImageBackground = () => {
    return isTablet() ? styles.backgroundTablet : styles.backgroundMobile;
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

  const ChangedImagProfile = () => {
    return (
      <Dialog
        visible={showChangePicture}
        style={{ height: "15%", justifyContent: "center" }}
      >
        <Dialog.Content>
          <Text allowFontScaling={false}>{locale.t("Coming_Soon")}</Text>
        </Dialog.Content>
        <View style={{ width: "100%", alignSelf: "center" }}>
          <TouchableOpacity
            onPress={() => setShowChangePicture(false)}
            style={{
              backgroundColor: defaultTheme.colors.accent,
              width: "20%",
              alignSelf: "flex-end",
              marginRight: 20
            }}
          >
            <Button style={{ width: "100%", alignItems: "center" }}>Ok</Button>
          </TouchableOpacity>
        </View>
      </Dialog>
    );
  };

  return (
    <View
      style={{
        backgroundColor: defaultTheme.colors.background,
        height: "100%"
      }}
    >
      <Appbar.Header dark={true}>
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
      <View style={getStyleContainer()}>
        <View style={{ alignItems: "center", marginTop: 20, width: "50%" }}>
          <View style={{ height: 140, alignItems: "center" }}>
            <ShowProfilePicture
              size={140}
              username={User.data.username}
            ></ShowProfilePicture>
            <FAB
              icon={"camera-plus-outline"}
              small={true}
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                backgroundColor: defaultTheme.colors.backgroundSecondary
              }}
              color={defaultTheme.colors.text}
              onPress={() => [setShowChangePicture(true)]}
              visible={showChangePicture === false}
            />
          </View>
          <View style={{ justifyContent: "center", height: 40 }}>
            <Text
              allowFontScaling={false}
              style={{ fontWeight: "bold", fontSize: 20 }}
            >
              {User.data.username}
            </Text>
          </View>
        </View>

        <List.Section style={getStyleList()}>
          <List.Item
            title={locale.t("Profile:Role")}
            description={
            role === null || org === " "
                ? "*"
                : role
            }
            style={getStyleItemList()}
            descriptionStyle={{ paddingTop: 5 }}
            descriptionNumberOfLines={3}
          />
          <List.Item
            title={locale.t("Profile:Org")}
            description={
              org === null || org === " "
                ? "*"
                : org
            }
            style={getStyleItemList()}
            descriptionStyle={{ paddingTop: 5 }}
            descriptionNumberOfLines={3}
          />
          <List.Item
            title={locale.t("Profile:Client")}
            description={
              client === null || client === " "
                ? "*"
                : org
            }
            style={getStyleItemList()}
            descriptionStyle={{ paddingTop: 5 }}
            descriptionNumberOfLines={3}
          />

          <List.Item
            title={locale.t("Profile:warehouse")}
            description={
              warehouse === null || org === " "
                ? "*"
                : warehouse
            }
            style={getStyleItemList()}
            descriptionStyle={{ paddingTop: 5 }}
            descriptionNumberOfLines={3}
          />
        </List.Section>
      </View>
      <Image style={getStyleImageBackground()} source={settings} />
      {ChangedImagProfile()}
    </View>
  );
});

export default withAuthentication(Profile);
