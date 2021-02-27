import React, { useEffect, useState } from 'react';
import { useRef, forwardRef } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TextInput, StatusBar, Image, RefreshControl, Button, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { debug } from 'react-native-reanimated';

const {width,height} = Dimensions.get("screen")
const buttonW = width*0.3
const centerMargin = (width - 3*buttonW)/4;
const bigButtonW = 3*buttonW + 2*centerMargin


export default function HeaderNavBar({navigation,page,token}) {

  const getStyle =(buttonPage) =>{
    if(buttonPage==page)
    {
      return styles.naviSelectedButtons;
    }
    else{
      return styles.naviButtons;
    }
  }

  
    return (
      <View style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.naviPanel}>
            <View style={getStyle("Flats")}>
                <Button color = '#38373c' title="Flats"  onPress={() => navigation.navigate('Flats', {token: token})}></Button>
            </View>
            <View style={getStyle("Bookings")}>
                <Button color = '#38373c' title="Bookings" onPress={() =>navigation.navigate('Bookings', {token: token})}></Button>
            </View>
            <View style={getStyle("logout")}>
                <Button color = '#38373c' title="Log out" onPress={() =>navigation.navigate('Home', {token: token})}></Button>
            </View>
        </View>
      </View>
    );
  }
  
  
  const styles = StyleSheet.create({
    naviPanel:{
      backgroundColor: '#38373c',
      flexDirection:'row', 
      height:height*0.1, 
      width: width,
      justifyContent: 'center', 
      alignItems: 'center', 
    },
    naviButtons:{
      width: buttonW,
      marginTop: 'auto',
      marginVertical: 5,    
    },
    naviSelectedButtons:{
      width: buttonW,
      marginTop: 'auto',
      marginVertical: 5,
      borderBottomColor: 'white',
      borderBottomWidth: 1,    
    },
    container: {
      flex: 1,
      //marginTop: StatusBar.currentHeight || 0,
    },

  });
  
