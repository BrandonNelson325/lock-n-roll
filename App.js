import "react-native-gesture-handler"; //this should be the first import in your code
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
  StyleSheet, 
  Text, View, 
  Button, 
  Image, 
  Dimensions, 
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';

//Pages
import AddPlayersScreen from './components/AddPlayersScreen'
import ChoosePreviousPlayers from './components/ChoosePreviousPlayers'
import Rules from './components/Rules'
import ChooseRoundsScreen from './components/ChooseRoundsScreen'
import Play from './components/Play'

const screenWidth = Dimensions.get('window').width;

// let game = {
//   numPlayers:players.length,
//   score:0,
//   rolls:[],
//   doubleRollCount:0
// }

const Home = props => {
  const newGame = async() => {
    //clear any previous game data
    await AsyncStorage.setItem('players','')
    await AsyncStorage.setItem('numRounds','')
    props.navigation.navigate('AddPlayersScreen')
  }
  return (
    <View style={styles.container}>
      <Image source={require('./assets/LockNRoll.png')} style={styles.image}></Image>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.defaultButton}
          onPress={() => newGame()}
          underlayColor='#fff'>
          <Text style={styles.defaultText}>New Game</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.alternativeLayoutButtonContainer}>
        <Button
          onPress={() => props.navigation.navigate('Rules')}
          title="Rules"
          color="#000"
        />
      </View>
    </View>
  )
};

export default function App() {
  //const
  const Drawer = createDrawerNavigator();

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home" screenOptions={{headerShown: false, drawerActiveTintColor: "#00a494"}}>
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="AddPlayersScreen" component={AddPlayersScreen} />
          <Drawer.Screen name="ChoosePreviousPlayers" component={ChoosePreviousPlayers} />
          <Drawer.Screen name="Rules" component={Rules} />
          <Drawer.Screen name="ChooseRoundsScreen" component={ChooseRoundsScreen} />
          <Drawer.Screen name="Play" component={Play} />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   backgroundColor: '#00a494',
  },
  buttonContainer: {
    margin: 20
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  image: { 
    height: '70%',
    width: screenWidth, 
    top: 20,
  },  
  defaultButton:{
    marginRight:30,
    marginLeft:30,
    marginTop:0,
    padding:20,
    backgroundColor:'black',
    borderRadius:10,
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
});
