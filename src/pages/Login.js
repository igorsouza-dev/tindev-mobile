import React from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import logo from "../assets/logo.png";
// import { Container } from './styles';

export default () => {
  return (
    <View style={styles.container}>
      <Image source={logo} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite o seu usário do GitHub"
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
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
