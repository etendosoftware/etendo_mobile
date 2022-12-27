import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import locale from "../i18n/locale";
import { Appbar, Button, Dialog, FAB, List, Text } from "react-native-paper";
import { User } from "../stores";
import { observer } from "mobx-react";
import withAuthentication from "../withAuthentication";
import { OBRest, Restrictions } from "obrest";
import { IRecord } from "../types/Record";
import { INavigation } from "../components/Card";
import { defaultTheme } from "../themes";
import { ShowProfilePicture } from "../components";

interface Props {
  navigation: INavigation;
}

interface State {
  role: string;
  org: string;
  client: string;
  warehouse: string;
  image: string;
  showChangePicture: boolean;
}

@observer
class Profile extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      role: null,
      org: null,
      client: null,
      warehouse: null,
      image: null,
      showChangePicture: false
    };
  }

  componentDidMount = async () => {
    if (User.data) {
      Promise.all([
        this.getOrganizationName(),
        this.getRoleName(),
        this.getWarehouseName(),
        this.getClientName()
      ])
        .then(values => {
          const [org, role, warehouse, client] = values;
          this.setState({ org, role, warehouse, client });
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  };

  getOrganizationName = async () => {
    let criteria = OBRest.getInstance().createCriteria("Organization");
    criteria.add(Restrictions.equals("id", User.data.organization));
    var org: IRecord = await criteria.uniqueResult();
    return org.name;
  };

  getClientName = async () => {
    let criteria = OBRest.getInstance().createCriteria("ADClient");
    criteria.add(Restrictions.equals("id", User.data.client));
    let client: IRecord = await criteria.uniqueResult();
    return client.name;
  };
  getWarehouseName = async () => {
    let criteria = OBRest.getInstance().createCriteria("Warehouse");
    criteria.add(Restrictions.equals("id", User.data.warehouseId));
    let warehouse: IRecord = await criteria.uniqueResult();
    return warehouse?.name;
  };

  getRoleName = async () => {
    let criteria = OBRest.getInstance().createCriteria("ADRole");
    criteria.add(Restrictions.equals("id", User.data.roleId));
    let role: IRecord = await criteria.uniqueResult();
    return role.name;
  };

  ChangedImagProfile = () => {
    return (
      <Dialog
        visible={this.state.showChangePicture}
        style={{ height: "15%", justifyContent: "center" }}
      >
        <Dialog.Content>
          <Text allowFontScaling={false}>{locale.t("Coming_Soon")}</Text>
        </Dialog.Content>
        <View style={{ width: "100%", alignSelf: "center" }}>
          <TouchableOpacity
            onPress={() => this.setState({ showChangePicture: false })}
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

  render() {
    return (
      <View style={{ backgroundColor: defaultTheme.colors.background }}>
        <Appbar.Header dark={true}>
          {!User.token && (
            <Appbar.BackAction
              onPress={() => this.props.navigation.navigate("Login")}
            />
          )}
          {User.token && (
            <Appbar.Action
              icon="menu"
              onPress={() => this.props.navigation.toggleDrawer()}
            />
          )}
          <Appbar.Content title={locale.t("Profile:Title")} />
        </Appbar.Header>
        <View style={{ flexDirection: "column" }}>
          <View style={{ height: "25%", alignItems: "center", marginTop: 30 }}>
            <ShowProfilePicture
              size={140}
              username={User.data.username}
            ></ShowProfilePicture>
            <View style={{ justifyContent: "center", marginTop: "20%" }}>
              <Text
                allowFontScaling={false}
                style={{ fontWeight: "bold", fontSize: 20 }}
              >
                {" "}
                {User.data.username}{" "}
              </Text>
            </View>
          </View>

          <List.Section
            style={{ width: "80%", alignSelf: "center", marginTop: "10%" }}
          >
            <List.Item
              title={locale.t("Profile:Role")}
              description={
                this.state.role === null || this.state.org === " "
                  ? "*"
                  : this.state.role
              }
              descriptionStyle={{ paddingTop: 5 }}
              descriptionNumberOfLines={3}
            />
            <List.Item
              title={locale.t("Profile:Org")}
              description={
                this.state.org === null || this.state.org === " "
                  ? "*"
                  : this.state.org
              }
              descriptionStyle={{ paddingTop: 5 }}
              descriptionNumberOfLines={3}
            />
            <List.Item
              title={locale.t("Profile:Client")}
              description={
                this.state.client === null || this.state.client === " "
                  ? "*"
                  : this.state.org
              }
              descriptionStyle={{ paddingTop: 5 }}
              descriptionNumberOfLines={3}
            />

            <List.Item
              title={locale.t("Profile:warehouse")}
              description={
                this.state.warehouse === null || this.state.org === " "
                  ? "*"
                  : this.state.warehouse
              }
              descriptionStyle={{ paddingTop: 5 }}
              descriptionNumberOfLines={3}
            />
          </List.Section>
        </View>
        <Image
          style={{ width: "100%", height: 350, marginTop: -60 }}
          resizeMode={"cover"}
          source={require("../img/settings-profile.png")}
        />
        {this.ChangedImagProfile()}
        <FAB
          icon={"camera-plus-outline"}
          small={true}
          style={{
            position: "absolute",
            top: "20%",
            left: "55%",
            backgroundColor: defaultTheme.colors.backgroundSecondary
          }}
          color={defaultTheme.colors.text}
          onPress={() => [this.setState({ showChangePicture: true })]}
          visible={this.state.showChangePicture === false}
        />
      </View>
    );
  }
}

export default withAuthentication(Profile);
