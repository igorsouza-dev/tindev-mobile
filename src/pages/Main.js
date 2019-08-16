import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from "react-native";
import io from 'socket.io-client';

import logo from "../assets/logo.png";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
import itsamatch from '../assets/itsamatch.png';

import api from "../services/api";

export default ({ navigation }) => {
  const id = navigation.getParam("user");
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);
  useEffect(() => {
    const loadUsers = () => {
      api.get("/devs", {
        headers: { user: id }
      }).then(response => {
        setUsers(response.data);
      }).catch(error => {
        Alert.alert('An error ocurred while trying to fetch the devs.');
      });
    };
    loadUsers();
  }, [id]);
  
  useEffect(() => {
    const socket = io('http://10.5.1.200:8080', {
        query: { user: id }
    });
    socket.on('match', dev => {
        setMatchDev(dev);
    });
    
}, [id]);
  handleLike = () => {
    const [ user, ...otherUsers ] = users;
    api.post(`/devs/${user._id}/likes`, null, {
      headers: { user: id }
    }).then(response => {
      setUsers(otherUsers);
    }).catch(error => {
      Alert.alert('It was not possible to give the like to this person.');
    });
    
  };
  handleDislike = () => {
    const [ user, ...otherUsers ] = users;
    api.post(`/devs/${user._id}/dislikes`, null, {
      headers: { user: id }
    }).then(response => {
      setUsers(otherUsers);
    }).catch(error => {
      Alert.alert('It was not possible to give the dislike to this person.');
    });
  };

  handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image source={logo} style={styles.logo} />
      </TouchableOpacity>
      <View style={styles.cardsContainer}>
        {users.length ? (
          users.map((user, index) => (
            <View
              style={[styles.card, { zIndex: users.length - index }]}
              key={user._id}
            >
              <Image
                style={styles.avatar}
                source={{
                  uri: user.avatar
                }}
              />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text numberOfLines={3} style={styles.bio}>
                  {user.bio}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.empty}> Acabou :(</Text>
        )}
      </View>
      { users.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDislike}>
            <Image source={dislike} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Image source={like} />
          </TouchableOpacity>
        </View>
      )}
      { matchDev && (
        <View style={styles.matchContainer}>
          <Image style={styles.matchImage} source={itsamatch} />
          <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar}}/>
          <Text style={styles.matchName} >{ matchDev.name }</Text>
          <Text style={styles.matchBio} >{ matchDev.bio }</Text>

          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.closeMatch}>FECHAR</Text>
          </TouchableOpacity>

        </View>
      )}
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: 30
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-between"
  },
  cardsContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    maxHeight: 500
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 30,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  avatar: {
    flex: 1,
    height: 300
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  bio: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    lineHeight: 18
  },
  buttonsContainer: {
    flexDirection: "row",
    marginBottom: 30
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05, //iOS
    shadowRadius: 2, //iOS
    shadowOffset: {
      //iOS
      width: 0,
      height: 2
    }
  },
  empty: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 24,
    color: "#999"
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  matchImage: {
    height: 60,
    resizeMode: 'contain'
  },
  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: '#fff',
    marginVertical: 30,
  },
  matchName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  matchBio: {
    marginTop: 10,
    fontSize: 16,
    color: 'rgba(255,255,255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  closeMatch: {
    fontSize: 16,
    color: 'rgba(255,255,255, 0.8)',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  }
});
