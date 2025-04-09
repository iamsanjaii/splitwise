import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginIllustration from "../../../assets/images/loginIllustration.png";
import { UserContext } from "../../services/usercontext"; // 🔥 import context

function Login() {
  const [name, setName] = useState("");
  const { setIsLoggedIn } = useContext(UserContext); // 🔥 access setIsLoggedIn

  const handleCreateAccount = async () => {
    if (!name.trim()) {
      Alert.alert("Name Required", "Please enter your name to continue.");
      return;
    }

    try {
      await AsyncStorage.setItem("userName", name);
      Alert.alert("Account Created", `Welcome, ${name}!`);
      setName("");
      setIsLoggedIn(true); // 🔥 triggers switch to Home via context
    } catch (error) {
      Alert.alert("Error", "Failed to save user data.");
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.mainContainer}>
          <View style={{ alignItems: "center", marginBottom: 10, gap: 10 }}>
            <Image
              source={LoginIllustration}
              style={{ width: 240, height: 240 }}
            />
            <Text style={styles.title}>SplitWise</Text>
            <Text style={styles.tagline}>
              Manage your expenses with ease
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="user"
              size={24}
              style={styles.icon}
              color="#7c808D"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor={"#7c808D"}
              placeholder="Enter your Name"
              selectionColor={"#3662AA"}
              autoCapitalize="none"
              keyboardType="default"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <TouchableOpacity style={styles.loginButton} onPress={handleCreateAccount}>
              <Text style={styles.loginButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Login;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151729",
  },
  mainContainer: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Poppins",
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    paddingBottom: 10,
    backgroundColor: "#1D2135",
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderRadius: 4,
  },
  input: {
    flex: 1,

    fontSize: 16,
    color: "#fff",
  },
  loginButton: {
    backgroundColor: "#4DE68C",
    padding: 10,
    borderRadius: 4,
    paddingHorizontal: 20,
   
    paddingVertical: 14,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#000D95F",
    fontFamily: "Poppins",
    fontSize: 18,
    fontWeight: "bold",
  },
  OrText: {
    color: "#7c808D",
    textAlign: "center",
    marginTop: 20,
  },
  icon: {
    marginRight: 10,
  },
  googleLoginButton: {
  backgroundColor: "#1D2135",
    width: "100%",
    marginTop: 10,
    padding: 10,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  googleLoginButtonText: {
    color: "#fff",
  },
  tagline
: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#7c808D",
  },
});
