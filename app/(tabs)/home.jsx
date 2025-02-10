import { useTailwind } from "tailwind-rn";
import { useState, useEffect, React, Component } from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import image from "../../assets/background.png";

// Mock user data
const userData = {
  name: "Lê Minh Tài",
  email: "20149058@student.hcmute.edu.vn",
  numberPhone: "0123456789",
};

export default function HomeScreen() {
  const tailwind = useTailwind();
  const [user, setUser] = useState(userData);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [tempNumberPhone, setTempNumberPhone] = useState("");

  useEffect(() => {
    setUser(userData);
  }, []);

  const handleUpdate = () => {
    debugger;
    setUser({
      name: tempName,
      email: tempEmail,
      numberPhone: tempNumberPhone,
    });
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Enter new name"
              value={tempName}
              onChangeText={setTempName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter new email"
              value={tempEmail}
              onChangeText={setTempEmail}
            />{" "}
            <TextInput
              style={styles.input}
              placeholder="Enter new number phone"
              value={tempNumberPhone}
              onChangeText={setTempNumberPhone}
            />
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <ImageBackground
          source={require("../../assets/background.png")}
          style={styles.header}
          resizeMode="cover"
        >
          <View></View>
          <View>
            <Image
              style={styles.hamburger}
              source={require("../../assets/HamburgerIcon.png")}
            />
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.headerContent}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Welcome</Text>
              <Text style={styles.userInfo}>{user.name}</Text>
              <Text style={styles.userInfo}>{user.email}</Text>
              <Text style={styles.userInfo}>{user.numberPhone}</Text>
            </View>
            <View>
              <Image
                style={styles.avatar}
                source={require("../../assets/profile.png")}
              />
            </View>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 300,
    width: "100%",
  },

  headerContent: {
    color: "white",
    padding: 30,
    alignItems: "center",
    display: "flex",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 10,
    float: "right",
  },
  location: {
    borderColor: "white",
    width: 10,
    height: 10,
    float: "left",
  },
  hamburger: {
    borderColor: "white",
    width: 10,
    height: 10,
    float: "right",
  },
  name: {
    fontSize: 22,
    color: "white",
    fontWeight: "600",
    fontFamily: "Helvetica",
  },
  headtText: {
    fontFamily: "Helvetica",
    color: "grey",
    fontWeight: "600",
    float: "left",
    marginLeft: 20,
    marginTop: 10,
  },
  SubjectText: {
    color: "white",
    fontWeight: "550",
    fontSize: 16,
    fontFamily: "Helvetica",
    float: "left",
    marginLeft: 20,
    marginTop: 10,
  },
  userInfo: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#3B525F",
    borderRadius: 10,
    width: 200,
    height: 50,
    alignItems: "center",
    padding: "6px",
    elevation: 3,
  },
  body: {
    backgroundColor: "white",
    height: 500,
    alignItems: "center",
  },
  text: {
    color: "white",
    margin: 10,
  },
  RectangleShapeView: {
    marginTop: 20,
    width: "80%",
    height: 80,
    backgroundColor: "white",
    color: "white",
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
    elevation: 3,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: "auto",
    marginBottom: "auto",
  },
  input: {
    height: 40,
    width: "100%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: "#3B525F",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
