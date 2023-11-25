//Add players screen
import "react-native-gesture-handler"; //this should be the first import in your code
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from "@react-navigation/native";
import { CheckBox } from '@rneui/themed';

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

export default function Play({navigation}) {
    const [state, setState] = useState({
        players:[],
        numRounds:0,
        currentRound:1,
        roundScore:0,
        numRoll:1,
        currentPlayerName:'',
        currentPlayerId:0,
        showPlayButtons:1,
        lockList:[]
    })
    const setData = async () => {
        try {
            let tempPlayers = await AsyncStorage.getItem('players');
            let tempPlayersJson = JSON.parse(tempPlayers)
            tempPlayersJson.map((el) => {
                el.locked = false,
                el.roundLocked = false
            })
            const num = await AsyncStorage.getItem('numRounds');
            setState({
                ...state,
                players:tempPlayersJson,
                numRounds:num,
                currentPlayerName:tempPlayersJson[0].name,
                currentPlayerId:tempPlayersJson[0].id
            })
        } catch (e) {
        // error reading value
        }
    };
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setData()
      });
      return unsubscribe;
    }, [navigation]);

    function EndRound() {
        if (state.currentRound === +state.numRounds) {
            return EndGame()
        }
        state.roundScore = 0
        state.currentRound += 1
        state.numRoll = 1
        state.players.map((el) => {
            el.locked = false,
            el.roundLocked = false
        })
        setState({
            ...state,
            roundScore:state.roundScore,
            currentRound:state.currentRound,
            numRoll:state.numRoll,
            players:state.players
        })
    }

    let currentPlayerName = state.currentPlayerName
    let currentPlayerId = state.currentPlayerId

    function LockAndRoll() {
        if (state.lockList.length) {
            for (let i = 0; i < state.lockList.length; i++) {
                for (let j = 0; j < state.players.length; j++) {
                    if (state.lockList[i].id == state.players[j].id) {
                        state.players[j].roundLocked = 1
                        if(state.players[j].id === state.currentPlayerId) {
                            if (state.players[j+1]) {
                                for (let k = j+1; k < state.players.length; k++) {
                                    if (!state.players[k].locked){
                                        currentPlayerName = state.players[k].name
                                        currentPlayerId = state.players[k].id
                                        break
                                    }
                                }
                            } else {
                                for (let k = 0; k < state.players.length; k++) {
                                    if (!state.players[k].locked){
                                        currentPlayerName = state.players[k].name
                                        currentPlayerId = state.players[k].id
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        let roundEnd = true
        for (let i = 0; i < state.players.length; i++) {
            if (!state.players[i].roundLocked) {
                roundEnd = false
            }
        }
        if (roundEnd) {
            return EndRound()
        }

        setState({
            ...state,
            showPlayButtons:!state.showPlayButtons,
            players:state.players,
            lockList:[],
            currentPlayerName:currentPlayerName,
            currentPlayerId:currentPlayerId
        })
    }

    const addToLockedList = (player) => {
        if (!player.roundLocked && state.roundScore > 0) {
            player.locked = !player.locked
            if(player.locked) {
                state.lockList.push(player)
                player.score += state.roundScore
            } else {
                state.players.map((el) => {
                    if (el.id === player.id) {
                        state.lockList.splice()
                    }
                })
            }
        }
        
        setState({
            ...state,
            lockList:state.lockList
        })
    }

    const addScore = (val) => {

        let total = state.roundScore
        if (state.numRoll <= 3) {
            if (val === 2 || val === 12) {
                total += 200
            } else if (val === 7) {
                total += 100
            }else {
                total += val
            }
        } else {
            if (val === 2 || val === 12) {
                total = total * 3
            } else if (val === 7) {
                return EndRound()
            } else if (val === 'Doubles') {
                total = total * 2
            } else {
                total += val
            }
        }

        // this is in a separate loop because we want to escape when it matches
        let currentPlayerName = ''
        let currentPlayerId = 0
        for (let i = state.currentPlayerId; i < state.players.length; i++) {
            if (!state.players[i].roundLocked && !state.players[i].locked) {
                currentPlayerName = state.players[i].name
                currentPlayerId = state.players[i].id
                break
            }
        }
        if (!currentPlayerId) {
            for (let i = 0; i < state.players.length; i++){
                if (!state.players[i].roundLocked && !state.players[i].locked) {
                    currentPlayerName = state.players[i].name
                    currentPlayerId = state.players[i].id
                    break
                }
            }
        }

        setState({
            ...state,
            numRoll:state.numRoll + 1,
            roundScore:total,
            currentPlayerName:currentPlayerName,
            currentPlayerId:currentPlayerId
        })
    }

    function EndGame() {
        let highscore = 0
        let winner = ''
        state.players.map((el) => {
           if (el.score > highscore) {
               highscore = el.score
               winner = el.name
           }
        })
        state.roundScore = 0
        state.currentRound = 1
        state.numRoll = 1
        state.players.map((el) => {
            el.locked = false,
            el.roundLocked = false
            el.score = 0
        })
        state.numRounds = 0
        setState({
            ...state,
            roundScore:state.roundScore,
            currentRound:state.currentRound,
            numRoll:state.numRoll,
            players:state.players,
            numRounds:state.numRounds
        })
        alert(winner + ' WINS!!!')
    }

    function ShowButtonsOrScores() {
        if(state.showPlayButtons) {
            return (
                <View>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity
                            style={styles.purpleButton}
                            onPress={() => addScore(2)}>
                            <Text style={styles.rollText}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.rollButton}
                            onPress={() => addScore(3)}>
                            <Text style={styles.rollText}>3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.rollButton}
                            onPress={() => addScore(4)}>
                            <Text style={styles.rollText}>4</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.rollButton}
                            onPress={() => addScore(5)}>
                            <Text style={styles.rollText}>5</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity
                            style={styles.rollButton}
                            onPress={() => addScore(6)}>
                            <Text style={styles.rollText}>6</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={state.numRoll > 3 ? styles.redButton : styles.purpleButton}
                            onPress={() => addScore(7)}>
                            <Text style={styles.rollText}>7</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.rollButton}
                            onPress={() => addScore(8)}>
                            <Text style={styles.rollText}>8</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.rollButton}
                            onPress={() => addScore(9)}>
                            <Text style={styles.rollText}>9</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity
                            style={styles.rollButton}
                            onPress={() => addScore(10)}>
                            <Text style={styles.rollText}>10</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.rollButton}
                            onPress={() => addScore(11)}>
                            <Text style={styles.rollText}>11</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.purpleButton}
                            onPress={() => addScore(12)}>
                            <Text style={styles.rollText}>12</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={state.numRoll <= 3}
                            style={state.numRoll <= 3 ? styles.disabledButton : styles.darkPurpleButton}
                            onPress={() => addScore('Doubles')}>
                            <Text style={styles.doublesText}>Doubles</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.lockScoresContainer}>
                        <TouchableOpacity
                            style={styles.defaultButton}
                            onPress={() => LockAndRoll()}
                            underlayColor='#fff'>
                        <Text style={styles.defaultText}>View/Lock Scores</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return (
                <View>
                    <View style={{height: 300, marginTop:30}}>
                        <ScrollView>
                            {state.players.map(player => {
                                return (
                                    <View style={styles.playersScoreContainer} key={player.id}>
                                        <Text style={styles.playersText}>
                                            {player.name}
                                        </Text>
                                        <Text style={styles.playersScoreText}>
                                            {player.score}
                                        </Text>
                                        <CheckBox
                                            containerStyle={{backgroundColor:'#f1f1f1', padding:5, marginBottom:5}}
                                            checked={player.locked}
                                            checkedIcon='lock'
                                            uncheckedIcon='unlock'
                                            uncheckedColor='#00a494'
                                            checkedColor='red'
                                            onPress={() => addToLockedList(player)}>
                                        </CheckBox>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>
                    <View style={styles.lockScoresContainer}>
                        <TouchableOpacity
                            style={styles.defaultButton}
                            onPress={() => LockAndRoll()}
                            underlayColor='#fff'>
                        <Text style={styles.defaultText}>Lock N Roll</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.stackedText}>
                    <Text style={{fontSize:15}}>Round</Text>
                    <Text style={{fontSize:30}}>{state.currentRound}/{state.numRounds}</Text>
                </View>
                <View style={styles.stackedText}>
                    <Text style={{fontSize:15}}>Roll</Text>
                    <Text style={{fontSize:30}}>{state.numRoll}</Text>
                </View>
            </View>
            <View style={styles.roundScoreContainer}>
                <View style={styles.stackedText}>
                    <Text style={{fontSize:75}}>{state.roundScore}</Text>
                    <Text style={{fontSize:15}}>Round Score</Text>
                </View>
            </View>
            <View style={{marginBottom:10}}>
                <View style={styles.stackedText}>
                    <Text style={{fontSize:25}}>{state.currentPlayerName}'s roll</Text>
                </View>
            </View>
            <View>
                <ShowButtonsOrScores/>
            </View>
        </View>
    );
};
  
  const styles = StyleSheet.create({
    container: {
        justifyContent: 'center', 
        alignItems: 'center',
        alignContent: 'start',
        width: '80%',
        marginLeft:'10%',
        marginTop:'20%'
    },
    buttonContainer: {
        margin: 10,
        flexDirection:'row', 
        alignItems:'center', 
        width:'100%', 
        marginTop:10,
    }, 
    defaultButton:{
        marginRight:20,
        marginLeft:20,
        marginTop:10,
        marginBottom:0,
        padding:5,
        backgroundColor:'#00a494',
        borderRadius:10
    },
    rollButton:{
        marginRight:10,
        marginLeft:10,
        marginTop:20,
        height:75,
        width:75,
        marginBottom:5,
        backgroundColor:'#00a494',
        borderRadius:10,
        alignContent:"center",
        textAlign:'center',
    },
    disabledButton:{
        marginRight:10,
        marginLeft:10,
        marginTop:20,
        height:75,
        width:75,
        marginBottom:5,
        backgroundColor:'gray',
        borderRadius:10,
        alignContent:"center",
        textAlign:'center',
    },
    redButton:{
        marginRight:10,
        marginLeft:10,
        marginTop:20,
        height:75,
        width:75,
        marginBottom:5,
        backgroundColor:'red',
        borderRadius:10,
        alignContent:"center",
        textAlign:'center',
    },
    purpleButton:{
        marginRight:10,
        marginLeft:10,
        marginTop:20,
        height:75,
        width:75,
        marginBottom:5,
        backgroundColor:'#8a66ff',
        borderRadius:10,
        alignContent:"center",
        textAlign:'center',
    },
    darkPurpleButton:{
        marginRight:10,
        marginLeft:10,
        marginTop:20,
        height:75,
        width:75,
        marginBottom:5,
        backgroundColor:'#8a66ff',
        borderRadius:10,
        alignContent:"center",
        textAlign:'center',
    },
    defaultText:{
        color:'#fff',
        textAlign:'center',
        paddingLeft : 5,
        paddingRight : 5,
        fontSize:25,
        fontWeight:'bold',
        fontFamily:'Arial',
        alignContent:"center",
    },
    rollText:{
        color:'#fff',
        textAlign:'center',
        paddingTop:25,
        paddingBottom:20,
        paddingRight:25,
        paddingLeft:25,
        fontSize:25,
        fontWeight:'bold',
        fontFamily:'Arial',
        alignContent:"center",
    },
    doublesText:{
        color:'#fff',
        textAlign:'center',
        alignContent:"center",
        fontSize:15,
        marginTop:25,
        fontWeight:'bold',
        fontFamily:'Arial'
    },
    header: {
        fontSize:40,
        fontWeight:'bold',
        textAlign:'center',
        marginBottom:30
    },
    text: {
        fontSize:30
    },
    topContainer: {
      flexDirection:'row', 
      alignItems:'flex-start', 
      width:'100%', 
      justifyContent:'space-between',
      marginTop:10,
    },
    stackedText:{
        alignItems:'center'
    },
    roundScoreContainer: {
        marginTop: 20,
        marginBottom:50
    },
    lockScoresContainer: {
        marginTop:25
    },
    playersScoreContainer: {
      flexDirection:'row', 
      alignItems:'center', 
      width:'100%', 
      justifyContent:'space-between',
      marginTop:5,
      borderBottomColor:'gray'
    },
    playersText: {
      fontSize:20,
      fontFamily:'Arial',
      marginBottom:5,
      height: 30,
      padding: 5,
      width:'70%'
    }, 
    playersScoreText: {
      fontSize:20,
      fontFamily:'Arial',
      marginBottom:5,
      height: 30,
      padding: 5,
      width:'15%'
    }, 
  });