import { useTailwind } from "tailwind-rn";
import { useState, React } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Add your login logic here
    console.log("Login attempt with:", email, password);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/background.png")}
        style={styles.header}
        resizeMode="cover"
      >
        <View style={styles.loginContainer}>
          <Image
            style={styles.logo}
            source={require("../../assets/profile.png")}
          />
          <Text style={styles.title}>Chào mừng trở lại</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    width: "100%",
  },
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    color: "white",
  },
  loginButton: {
    backgroundColor: "#3B525F",
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "white",
    marginTop: 15,
    textDecorationLine: "underline",
  }
});
