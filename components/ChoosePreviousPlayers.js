
//Add players screen
import "react-native-gesture-handler"; //this should be the first import in your code
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from "@react-navigation/native";
import { CheckBox, Icon } from '@rneui/themed';

import { 
  StyleSheet, 
  Text, 
  TextInput,
  View, 
  ScrollView,
  Button, 
  Image, 
  Dimensions, 
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
//import { ScrollView } from "react-native-gesture-handler";

const storeJsonData = async (key,value) => {
  let jsonValue = JSON.stringify(value)
  try {
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e,'error saving '+key)
  }
};

export default function ChoosePreviousPlayers({ navigation }) {
    const [state, setState] = useState({
      previousPlayers:[]
    })

    const getPreviousPlayers = async() => {
        const tempPreviousPlayers = await AsyncStorage.getItem('previousPlayers');
        const previousPlayers = JSON.parse(tempPreviousPlayers)
        previousPlayers.map((el) => {
            el.checked = false
        })
        setState({
            ...state,
            previousPlayers:previousPlayers
        })
    }
    if (!state.previousPlayers.length) {
        getPreviousPlayers()
    }
    
    const removePlayer = (id) => {
        const position = id - 1
        state.previousPlayers.splice(position,1)
        let player_count = 1
        state.previousPlayers.map(player => {
            player.id = player_count
            player_count++
        })
        setState({
            ...state,
            previousPlayers:state.previousPlayers
        })
        storeJsonData('previousPlayers',state.previousPlayers)
    };

    const addToPlayerList = (player) => {
        let val = !player.checked
        state.previousPlayers[player.id - 1].checked = !state.previousPlayers[player.id - 1].checked
        setState({
            ...state,
            previousPlayers:state.previousPlayers
        })
    }

    const addToGame = async () => {
        let list = []
        for (let i = 0; i < state.previousPlayers.length; i++){
            if(state.previousPlayers[i].checked) {
                list.push(state.previousPlayers[i].name)
            }
            state.previousPlayers[i].checked = false
        }
        setState({
            ...state,
            previousPlayers:state.previousPlayers
        })
        storeJsonData('playersToAdd',list)
        navigation.navigate('AddPlayersScreen')
        
    }
    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.addPlayers}>
        <View style={{height: 650}}>
          <ScrollView>
          {state.previousPlayers.map(player => {
              return (
              <View style={styles.addPlayerContainer} key={player.id}>
                  <TextInput 
                  editable={false}
                  style={styles.addPlayerInput} 
                  >
                      {player.name}
                  </TextInput>
                  <CheckBox
                      containerStyle={{backgroundColor:'#f1f1f1', margin:0}}
                      checked={player.checked}
                      onPress={() => addToPlayerList(player)}>
                  </CheckBox>
                  <TouchableOpacity
                  style={styles.removePlayerButton}
                  onPress={() => removePlayer(player.id)}>
                  <Text style={styles.addPlayerText}>x</Text>
                  </TouchableOpacity>
              </View>
              )
          })}
          </ScrollView>
        </View>
        <View style={styles.choosePreviousContainer}>
            <TouchableOpacity
            style={styles.defaultButton}
            onPress={() => addToGame()}
            underlayColor='#fff'>
            <Text style={styles.defaultText}>Add To Game</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   backgroundColor: '#00a494',
  },
  buttonContainer: {
    margin: 20
  }, 
  defaultButton:{
    marginRight:0,
    marginLeft:0,
    marginTop:0,
    padding:10,
    backgroundColor:'#00a494',
    borderRadius:10,
  },
  defaultText:{
    color:'#fff',
    textAlign:'center',
    paddingLeft : 5,
    paddingRight : 5,
    fontSize:20,
    fontWeight:'bold',
    fontFamily:'Arial'
  },
  addPlayerContainer: {
    flexDirection:'row', 
    alignItems:'center', 
    width:'100%', 
    justifyContent:'space-between',
    marginTop:0,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  choosePreviousContainer: {
    flexDirection:'row', 
    alignItems:'center', 
    width:'100%', 
    justifyContent:'center',
    marginTop:0,
  },
  addPlayers: {
    flex: 1, 
    alignContent: 'center',
    justifyContent: 'center', 
    alignItems: 'center',
    width: '90%',
    marginLeft:'5%'
  },
  addPlayerInput: {
    fontSize:20,
    fontFamily:'Arial',
    marginBottom:0,
    height: 30,
    borderWidth: 1,
    padding: 5,
    width:'70%'
  }, 
  AddPlayerButton: {
    height: 30,
    width: 30,
    textAlign:'center',
    backgroundColor:'#00a494',
    borderRadius:10,
    marginBottom:5,
    marginLeft:5
  },
  addPlayerText:{
    color:'white',
    textAlign:'center',
    paddingLeft : 5,
    paddingRight : 5,
    paddingTop: 0,
    fontSize:22,
  },
  removePlayerButton: {
    height: 30,
    width: 30,
    textAlign:'center',
    backgroundColor:'red',
    borderRadius:10,
    marginBottom:5,
    marginLeft:0
  }
});