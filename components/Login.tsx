import React, { useContext, useState } from "react"
import { Button, Dimensions, StyleSheet, Text, TextInput, View } from "react-native"
import { ContainerContext } from "../contexts/ContainerContext"

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const Login = ({ }) => {
  const { state: { url }, dispatch } = useContext(ContainerContext);
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("admin")

  const onLogin = async () => {
    const callUrl = `${url}/sws/login`;
    const call = await fetch(callUrl, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    const { token } = await call.json()
    const callUrlApps = `${url}/sws/com.etendoerp.dynamic.app.userApp`;
    const callApps = await fetch(callUrlApps, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    const data = await callApps.json()
    dispatch({ appsData: data.data, logged: true })
  };

  return (

    <View style={styles.container}>
      <View>
        <Text>URL</Text>
        <TextInput value={url} onChangeText={(text) => { dispatch({ url: text }) }} style={{ borderWidth: 1 }} />
      </View>
      <View>
        <Text>Username</Text>
        <TextInput value={username} onChangeText={setUsername} style={{ borderWidth: 1 }} />
      </View>
      <View>
        <Text>Password</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry={true} style={{ borderWidth: 1 }} />
      </View>
      <View style={styles.container}>
        <Button title="Login" onPress={() => onLogin()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: (width * 4) / 100,
    paddingTop: (height * 2) / 100,
  },
});