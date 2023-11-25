//Rules screen
import "react-native-gesture-handler"; //this should be the first import in your code
import { createDrawerNavigator } from "@react-navigation/drawer";

import React, { Component } from "react";
import { Button, View, Text, TouchableOpacity } from "react-native";
export default function Rules() {

    //onPress To Navigate
    const onPress = () => {
      alert('go timex')
      //props.navigation.navigate('ScreenTwo');
    };
  
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={onPress}>
          <Text>This is where the rules will go.</Text>
        </TouchableOpacity>
      </View>
    );
};