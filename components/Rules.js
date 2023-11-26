//Rules screen
import "react-native-gesture-handler"; //this should be the first import in your code
import { createDrawerNavigator } from "@react-navigation/drawer";

import React, { Component } from "react";
import { Button, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from '@rneui/themed';
import { ScrollView } from "react-native-gesture-handler";
export default function Rules({ navigation }) {

    //onPress To Navigate
    const back = () => {
      navigation.navigate('Home');
    };
  
    return (
        <View style={styles.container}>
          <TouchableOpacity onPress={back} style={styles.backArrow}>
            <Icon name='arrow-back'></Icon>
          </TouchableOpacity>
          <ScrollView style={styles.main}>
            <Text style={styles.titleText}>Rules and Gameplay</Text>
            <Text style={styles.headerText}>Before you start</Text>
            <Text style={styles.baseText}>All that you need to play are 2 Dice, This app, and all of your friends!</Text>
            <Text style={styles.headerText}>Game Play</Text>
            <Text style={styles.baseText}>Each player will roll the dice when it is their turn. The scorekeeper will record the sum of both dice to the app after each roll. Its as simple as that... or is it? </Text>
            <Text style={styles.headerText}>Scoring</Text>
            <Text style={styles.boldText}>First 3 rounds</Text>
            <Text style={styles.baseText}>{'\u2022'} Double 1's (Snake eyes) are worth 200. {'\n'}{'\u2022'} Double 6's (12) are worth 200. {'\n'}{'\u2022'} 7's are worth 100. {'\n'}{'\u2022'} All other numbers are scored as face value. {'\n'}{'\u2022'} No doubles apply except 1's and 6's</Text>
            <Text style={styles.boldText}>After 3rd round</Text>
            <Text style={styles.baseText}>{'\u2022'} Double 1's and Double 6's TRIPLE the rounds current score. {'\n'}{'\u2022'} Any other Double will DOUBLE the rounds current score. {'\n'}{'\u2022'} If a 7 is rolled, the round ENDS. {'\n'}{'\u2022'} All other numbers are scored as face value.</Text>
            <Text style={styles.boldText}>Locking</Text>
            <Text style={styles.baseText}>Between any round, any player can LOCK their score. If the score is getting high, and you are afraid that someone will roll a 7 and end the round, you can lock your score in. This will add the rounds current score to your total, and you will be out for the round. If you do not lock before a 7 is rolled, you are rewarded 0 points for the round</Text>
            <Text style={styles.headerText}>Winner</Text>
            <Text style={styles.baseText}>To win, you must simply have the most points at the end of all the rounds. Easy, right?</Text>            
            <Text style={styles.headerText}>How to keep score (For the score keeper only)</Text>
            <Text style={styles.baseText}>{'\u2022'} Each time a player rolls, you simply click the number they roll. If it is a double, and not in the first 3 rounds, click the "doubles" button.{'\n'}{'\u2022'} When a player wants to lock their score, simply click the "Lock N Roll" button, and click the lock icon next to their name. This will lock them and remove them from the list of rollers.{'\n'}{'\u2022'} If a player wants to ask their scores, simply click the "Lock N Roll" button, and you will see each players current score.</Text>
            <Text style={styles.headerText}>FAQ</Text>
            <Text style={styles.baseText}>1. What is a double? A double means that both dice that are rolled display the exact same number. ie: when rolled, both dice land with a 4 displayed.</Text>               
            <Text style={styles.baseText}>2. Can I choose players that I have played with in the past? Yes, when you are adding all of your players, click "Previous Players". This will take you to a screen that stores all players that have played with you in the past.</Text>   
            <Text style={styles.baseText}>2. Can I submit suggestions and bugs? Yes, please do! Please email: BrandonNelson325@gmail.com</Text>  
          </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'top',
   marginTop:60,
   marginLeft:20, 
   marginBottom:35
  },
  backArrow: {
    position:'absolute',
    top:0,
  },
  main: {
    marginTop:30
  },
  baseText: {
    marginBottom:10
  },
  boldText: {
    marginBottom:10,
    fontWeight:'bold'
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom:10,
    textAlign:'center'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom:10,
  },
});