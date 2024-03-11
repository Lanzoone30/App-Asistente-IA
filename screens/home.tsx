import React from "react";
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, ImageBackground } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import LinearGradient from "react-native-linear-gradient";
import { fonts } from "../utils/theme";


type RootStackParamList = {
  MainScreen: undefined;
  // Agrega más rutas si es necesario
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainScreen'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};


const Home = ({ navigation }: Props) => {
  return (
    <LinearGradient
      colors={['#100DFF', '#4200E8', '#6500A5', '#940DFF']}
      style={styles.gradient}
    >
      
      <View style={styles.container}>
        <View style={{flex: 2, marginTop: 250}}>
          <Image
            source={require('../assets/LOGO-AICE.png')}
          />
          <Text
            style={{
              ...fonts.PalanquinDark_Bold,
              fontWeight: 'bold',
              color: "#FFFFFF",
              fontSize: 23,
            }}
          >
            ARTIFICIAL INTELLIGENCE VOICE
          </Text>
        </View>
        <View >
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainScreen')}>
            <Text style={styles.textButton}>Empecemos</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </LinearGradient>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  gradient: {
    flex: 1,
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 50,
    marginBottom: 100
  },
  textButton: {
    fontWeight: 'bold',
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
  },
  ImageBackground: {
    resizeMode: 'cover',
    flex: 1,
    width: '100%',
  }
});

export default Home;
