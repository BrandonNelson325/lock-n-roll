//Add players screen
import "react-native-gesture-handler"; //this should be the first import in your code
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from "@react-navigation/native";

import { 
  StyleSheet, 
  Text, 
  TextInput,
  View, 
  Button, 
  Image, 
  Dimensions, 
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';

export default function ChooseRoundsScreen({ navigation }) {
    const setRounds = async(val) => {
        try {
            await AsyncStorage.setItem('numRounds', val);
            navigation.navigate('Play')
        } catch (e) {
            console.log(e,'error saving number of rounds')
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Number of Rounds</Text>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    style={styles.defaultButton}
                    onPress={() => setRounds('10')}>
                    <Text style={styles.defaultText}>10</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.defaultButton}
                    onPress={() => setRounds('15')}>
                    <Text style={styles.defaultText}>15</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    style={styles.defaultButton}
                    onPress={() => setRounds('20')}>
                    <Text style={styles.defaultText}>20</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.defaultButton}
                    onPress={() => setRounds('25')}>
                    <Text style={styles.defaultText}>25</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
  
  const styles = StyleSheet.create({
    buttonContainer: {
      margin: 20,
      flexDirection:'row', 
      alignItems:'center', 
      width:'100%', 
      marginTop:10,
    }, 
    defaultButton:{
      marginRight:30,
      marginLeft:30,
      marginTop:20,
      marginBottom:20,
      padding:20,
      backgroundColor:'#00a494',
      borderRadius:10
    },
    defaultText:{
      color:'#fff',
      textAlign:'center',
      paddingLeft : 5,
      paddingRight : 5,
      fontSize:25,
      fontWeight:'bold',
      fontFamily:'Arial'
    },
    container: {
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      alignContent: 'center',
      width: '80%',
      marginLeft:'12.5%'
    },
    header: {
        fontSize:40,
        fontWeight:'bold',
        textAlign:'center',
        marginBottom:30,
        width:'100%'
    }
  });