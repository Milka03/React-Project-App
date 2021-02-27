import React, { useEffect, useState } from 'react';
import { useRef, forwardRef } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TextInput, StatusBar, Image, RefreshControl, Button, Dimensions, Alert ,Animated  } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackActions, NavigationActions } from 'react-navigation';
import { debug } from 'react-native-reanimated';

const {width,height} = Dimensions.get("screen")
const loginTextH=20;


export default function LoginScreen({navigation}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    //animation:
    
    const opacity = new Animated.Value(0);
    const anim=()=>{
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }

    
    function loginHandler(e) {
      console.log("usr: "+username + " , pass:" + password)
        //e.preventDefault();
        setError(false);
        let formdata = new FormData();
        formdata.append("username", username)
        formdata.append("password", password)
        fetch('http://flatly-env.eba-pftr9jj2.eu-central-1.elasticbeanstalk.com/login', {
            method: 'POST', 
            headers: {
                'Content-Type': 'multipart/form-data;',
                'Accept': '*/*',
            },
            body: formdata
        })
        .then(response => {
        if (response.status == 404 || response.status == 401) {
            Alert.alert(
              'Access denied',
              'Invalid username or password',
              [
                {text: 'OK'},
              ],
              {cancelable: true},
            )
            return null;
        }
        else if (response.status == 200) {
            anim();
            return response.text()
          }
        else{
          Alert.alert(
            'An error occured',
            'Error ' + response.status,
            [
              {text: 'OK'},
            ],
            {cancelable: true},
          )
          return null;
        }
        })
        .then(responseData => {
          if (responseData != null) {
            setTimeout(()=>
            navigation.dispatch(StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'Flats',
                  params: {token: responseData}
                }),
              ],
            })),1000);
          } 
        })
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.circle, {opacity: opacity}]}></Animated.View>
            <Text style={styles.title}>Flatly</Text>
            <View style={styles.inputcontainer}>
                <Text style={styles.inputlogintext}>Login</Text>
                <View style={styles.inputadjustcontainer}>
                  <TextInput style={styles.inputtext} placeholder="Username" onChangeText={(val) => setUsername(val)}/>
                  <TextInput style={styles.inputtext} placeholder="Password" onChangeText={(val) => setPassword(val)}/>
                </View>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={() => loginHandler()}>
              <Text style={styles.logintext}>Login</Text>
            </TouchableOpacity>
        </View>
    );
  }

  const circlesize=50;
  const styles = StyleSheet.create({
    circle:{
      width: circlesize,
      height: circlesize,
      backgroundColor: '#dc8033',
      borderWidth: 0,
      borderRadius: circlesize/2,
      opacity: 0.9,
  },
    container: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginHorizontal: 20,
        justifyContent: 'center',
        textAlign: 'center',
    },
    inputcontainer:{
        borderColor: 'black',
        borderWidth: 2,
        marginTop: height*0.08,
        marginBottom: height*0.04,
        height: height*0.2,
        width:  height*0.3,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    inputadjustcontainer:{
        marginBottom: 'auto',
        marginTop: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    inputlogintext:{
        fontSize: 16,
        backgroundColor: '#f2f2f2',
        marginTop: -loginTextH/2,
        height: loginTextH,
        textAlign: 'center',
        alignContent: 'center',
        marginRight: 'auto',
        marginLeft: 5,
    },
    inputtext: {
        fontSize: 16,
        height: 30,
        width: width*0.5,
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 5,
        marginVertical: 10,
    },
    title:{
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: 35,
        textAlign: 'center',
        borderBottomColor: 'orange',
        borderBottomWidth: 2,
        width: 120,
    },
    loginButton:{
        marginTop: 20,
        backgroundColor: 'black',
        width: width*0.3,
        height: height*0.07,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    logintext:{
        marginTop: 'auto',
        marginBottom: 'auto',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    }
})