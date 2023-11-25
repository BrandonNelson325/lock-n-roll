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
  ScrollView,
  Button, 
  Image, 
  Dimensions, 
  TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';

const storeJsonData = async (key,value) => {
  let jsonValue = JSON.stringify(value)
  try {
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e,'error saving '+key)
  }
};

export default function AddPlayersScreen({ navigation }) {

  const [state, setState] = useState({
    name:'',
    players:[],
    emptyPlayer:''
  })

  const checkPlayersToAdd = async() => {
    const tempPlayersToAdd = await AsyncStorage.getItem('playersToAdd');
  
    if(tempPlayersToAdd && tempPlayersToAdd.length) {
      let players = JSON.parse(tempPlayersToAdd)
      for (let i = 0; i < players.length; i++) {
        addPlayer(players[i])
      }
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkPlayersToAdd()
    });
    return unsubscribe;
  }, [navigation]);
  
  const addPlayer = (name) => {
    state.players.push({
      id: state.players.length + 1,
      name: name,
      score: 0
    });
    setState({
      ...state,
      players:state.players,
      emptyPlayer:''
    })
  };  
  
  const removePlayer = (id) => {
    const position = id - 1
    state.players.splice(position,1)
    let player_count = 1
    state.players.map(player => {
      player.id = player_count
      player_count++
    })
    setState({
      ...state,
      players:state.players
    })
  };
    
  const removeAllPlayers = () => {
    setState({
      ...state,
      players:[]
    })
  };

  const navigateChoosePreviousPlayers = () => {
    navigation.navigate('ChoosePreviousPlayers')
  }

  const continueToChooseRounds = async () => {
    if (state.players.length >= 2) {
      //this little section of code is adding these players to historical players for future use
      const tempStoredPlayers = await AsyncStorage.getItem('previousPlayers');
      let storedPlayers = JSON.parse(tempStoredPlayers)
      if (storedPlayers == null) {
        await AsyncStorage.setItem('previousPlayers', JSON.stringify(state.players));
      } else {
        for(let i = 0; i < state.players.length;i++) {
          let found = false
          for(let j = 0; j < storedPlayers.length; j++) {
            if (state.players[i].name == storedPlayers[j].name) {
              found = true
            }
          }
          if (!found) {
            storedPlayers.push(state.players[i])
          }
        }
        for(let i = 0; i < storedPlayers.length;i++) {
          storedPlayers[i].id = i + 1
        }
        await AsyncStorage.setItem('previousPlayers', JSON.stringify(storedPlayers));
      }
      setState({
        ...state,
        checkPlayersToAdd:false
      })
      await AsyncStorage.setItem('playersToAdd','')
      const finalPlayers = JSON.stringify(state.players)
      await AsyncStorage.setItem('players',finalPlayers)
      navigation.navigate('ChooseRoundsScreen')
    } else {
      alert('Must have at least 2 players to continue')
    }
  }

  return (
    <View style={styles.addPlayers}>
    <View style={styles.addPlayerContainer}>
      <TextInput 
        style={styles.addPlayerInput} 
        placeholder='Add New Player'
        value={state.emptyPlayer}
        onChangeText={(text)=>setState({
          ...state,
          name:text,
          emptyPlayer:text
        })}>
      </TextInput>
      <TouchableOpacity
        style={styles.AddPlayerButton}
        onPress={() => addPlayer(state.name)}>
        <Text style={styles.addPlayerText}>+</Text>
      </TouchableOpacity>
    </View>
      <View style={{height: 500, marginTop:30}}>
        <ScrollView>
          {state.players.map(player => {
            return (
              <View style={styles.addPlayerContainer} key={player.id}>
                <TextInput 
                  editable={false}
                  style={styles.addPlayerInput} 
                  >
                    {player.name}
                </TextInput>
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
      <View style={styles.addPlayerContainer}>
        <TouchableOpacity
          style={styles.defaultButton}
          onPress={() => removeAllPlayers()}
          underlayColor='#fff'>
          <Text style={styles.defaultText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.defaultButton}
          onPress={() => navigateChoosePreviousPlayers()}
          underlayColor='#fff'>
          <Text style={styles.defaultText}>Choose Players</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.continue}>
        <TouchableOpacity
          style={styles.defaultButton}
          onPress={() => continueToChooseRounds()}
          underlayColor='#fff'>
          <Text style={styles.defaultText}>Continue</Text>
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
    marginTop:10,
  },
  continue: {
    flexDirection:'row', 
    alignItems:'center', 
    width:'100%', 
    justifyContent:'center',
    marginTop:10,
  },
  continueButton: {
    marginRight:0,
    marginLeft:0,
    marginTop:0,
    padding:10,
    backgroundColor:'#00a494',
    borderRadius:10,
  },
  addPlayers: {
    flex: 1, 
    alignContent: 'center',
    justifyContent: 'center', 
    alignItems: 'center',
    width: '85%',
    marginLeft:'7.5%'
  },
  addPlayerInput: {
    fontSize:20,
    fontFamily:'Arial',
    marginBottom:0,
    height: 30,
    borderWidth: 1,
    padding: 5,
    width:'80%'
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