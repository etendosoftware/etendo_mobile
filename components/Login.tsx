import React, { useState } from "react"
import { Button, Text, TextInput, View } from "react-native"

export const Login = ({ setAppsData, setLogged, setUrl, url }: any) => {

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
    console.log(data)
    setAppsData(data.data)
    setLogged(true)
  };

  return (
    <View>
      <View>
        <Text>URL</Text>
        <TextInput value={url} onChangeText={setUrl} style={{ borderWidth: 1 }} />
      </View>
      <View>
        <Text>Username</Text>
        <TextInput value={username} onChangeText={setUsername} style={{ borderWidth: 1 }} />
      </View>
      <View>
        <Text>Password</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry={true} style={{ borderWidth: 1 }} />
      </View>
      <View>
        <Button title="Login" onPress={() => onLogin()} />
      </View>
    </View>
  )
}