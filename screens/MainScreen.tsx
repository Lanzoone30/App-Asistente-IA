import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Pressable, Image } from 'react-native';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av'
import { writeAudioToFile } from '../utils/writeAudioToFile';
import { playFromPath } from '../utils/playFromPath';
import { fetchAudio } from '../utils/fetchAudio';
import LinearGradient from "react-native-linear-gradient";

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: false,
  playsInSilentModeIOS: true,
  shouldDuckAndroid:true,
  playThroughEarpieceAndroid: false,
})

export default function MainScreen() {

  

  const [ borderColor, setBorderColor] = useState<"lightgray" | "lightgreen">("lightgray");
  const {state, startRecognizing, stopRecognizing, destroyRecognizer} = useVoiceRecognition();
  const [urlPath, setUrlPath] = useState("");

  useEffect(() => {
    listFiles();
  },[]);
  const listFiles = async () => {
    try {
      const result = await FileSystem.readAsStringAsync(FileSystem.documentDirectory!);
      if(result.length > 0) {
        const filename = result[0];
        const path = FileSystem.documentDirectory + filename;
        console.log("Full path to the file:", path);
        setUrlPath(path);
      }
    } catch (error) {
      console.error("An error occurred while listing the files:", error);
      
    }
  }
  const handleSubmit = async () => {
    if(!state.results[0]) return;

    try {
      //fetch the audio blobs from the server
      const audioBlob = await fetchAudio(state.results[0]);
      const reader = new FileReader()
      reader.onload = async (e) => {
        if (e.target && typeof e.target.result === "string") {
          const audioData = e.target.result.split(",")[1];
          //save data
          const path = await writeAudioToFile(audioData);

          //play audio
          setUrlPath(path);
          await playFromPath(path);
          destroyRecognizer();
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (e) {
      console.error("An error occurred:", e);
      
    }
  };

  const fetchAudio = async (text: string) => {
    const response = await fetch(
      "http://localhost:3000/text-to-speech/synthesize",
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text }),
      } 
    );
    return await response.blob();
  };

  const writeAudioToFile = async (audioData: string) => {
    const path = FileSystem.documentDirectory + "temp.mp3";
    await FileSystem.writeAsStringAsync(path, audioData, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return path;
  };

  async function playFromPath(path: string) {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({uri: path});
      await soundObject.playAsync();
    }
    catch(error){
      console.log("An error occurred while playing the audio:", error);
    }
  }

  return (
    <LinearGradient
      colors={['#100DFF', '#4200E8', '#6500A5', '#940DFF']}
      style={styles.gradient}
    >
      <View style={styles.container}>
          <View style={{marginBottom: 50}}>
            <Image
              source={require('../assets/LOGO-AICE.png')}
            />
            <Text 
            style={{
              textAlign: 'center',
              color: '#FFFFFF',
              marginBottom: 5,
              fontSize: 16,
              marginTop: 30
            }}
          >
            Manten presionado para hablar, suelta para enviar la grabacion y obtendras una respuesta
          </Text>
        </View>
        
        <Text
        style={{
          marginVertical: 10,
          fontSize: 20,
          color: '#FFFFFF',
          fontWeight: 'bold',
        }}
        >
        Tu mensaje
        </Text>
          <View
          style={{
            borderWidth: 2,
            borderColor: '#FFFFFF',
            width: "90%",
            height: "30%",
            borderRadius: 15,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            marginBottom: 10
          }}
          >
          <Text
          style={{
            marginVertical: 10,
            fontSize: 17,
            textAlign: 'center',
            fontWeight: '500'
          }}
          >
          {/* {JSON.stringify(state, null, 2)} */}
          {state.results[0]}
          </Text>
        </View>

        <Pressable
          style={{
            width: '20%',
            height: '10%',
            marginBottom: 15,
            borderWidth: 5,
            alignItems: 'center',
            borderRadius: 60,
            borderColor: borderColor,
            backgroundColor: '#FFFFFF',
            marginTop: 10
          }}

          onPressIn={() => {
            setBorderColor("lightgreen");
            startRecognizing();
          }}
          onPressOut={() => {
            setBorderColor("lightgray");
            stopRecognizing();
            handleSubmit();
          }}
        >
          
            <Image
              source={require('../images/forma-de-microfono-negro-1.png')}
              style={{
                width: '70%',
                height: '70%',
                margin: 10
              }}
            />
          
          
        </Pressable>
        <StatusBar style="auto" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50
  },
  gradient: {
    flex: 1,
  },
});
