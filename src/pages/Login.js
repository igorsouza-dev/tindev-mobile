import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  Image
} from "react-native";
import logo from "../assets/logo.png";
import { Platform } from "@unimodules/core";
import api from "../services/api";

export default ({ navigation }) => {
  const [user, setUser] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("user").then(user => {
      if (user) {
        navigation.navigate("Main", { user });
      }
    });
  }, []);

  handleLogin = async () => {
    const response = await api.post("/devs", { username: user });
    const { _id } = response.data;
    await AsyncStorage.setItem("user", _id);
    navigation.navigate("Main", { _id });
  };
  return (
    <KeyboardAvoidingView
      enabled={Platform.OS === "ios"}
      behavior={"padding"}
      style={styles.container}
    >
      <Image source={logo} />

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite o seu usário do GitHub"
        style={styles.input}
        placeholderTextColor="#999"
        value={user}
        onChangeText={setUser}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 30
  },
  input: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginTop: 20,
    paddingHorizontal: 15
  },
  button: {
    height: 46,
    alignSelf: "stretch",
    borderRadius: 4,
    marginTop: 10,
    backgroundColor: "#df4723",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
