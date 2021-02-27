import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TextInput, StatusBar, Image, Dimensions,Animated,Button } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements'
import HeaderNavBar from './HeaderNavBar';

const {width, height} = Dimensions.get("screen")
const butColor = '#38373c';
const butsize=50;


export default function BookingDetailScreen({route, navigation}) {
    const item = navigation.getParam('booking');
    const token = navigation.getParam('token');
    
    return (
        <SafeAreaView >
            <View style={styles.circle}></View>
            <HeaderNavBar page={"Bookings"} navigation={navigation}  token={token}/>
            <View style={styles.topPanel}>
                    <Text style={styles.title}>{item.flat.name}</Text>
            </View>
            <View style={styles.bottomPanel}>
                <View style={styles.row}>
                    <Text style={styles.infoBold}> {`Person renting:  ${item.customer.firstName} ${item.customer.lastName}` } </Text>
                </View>
                <Text style={styles.info}> {`Date:  (${item.startDate}) - (${item.endDate})`} </Text>
                <Text style={styles.info}> {`Customer number:  ${item.customer.phoneNumber}`} </Text>
                <Text style={styles.info}> {`Booking Price:  ${item.price} PLN`} </Text>
                <Text style={styles.info}> {`Number of Guests:  ${item.noOfGuests}`} </Text>
                <Text style={styles.info}> {`Flat Type:  ${item.flat.flatType}`} </Text>
                <Text style={styles.info}> {`Location:  ${item.flat.address.city}, ${item.flat.address.country}`} </Text>

                <View style={styles.row}>
                    <View style={styles.button1}> 
                        <Button title="Go to Flat Details" color='black' onPress={() => navigation.navigate('FlatDetails', {flat: item.flat, token: token})}></Button>
                    </View>
                    <View  style={styles.button}>
                        <Button title="Back" color='black' onPress={() => navigation.navigate('Bookings', {token: token})}></Button>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const circlesize=550;
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    topPanel:{
        height: 0.2*height,
    },
    midPanel:{
        flexDirection:'row',
        height: 0.1*height,
    },
    bottomPanel:{
        padding: 10,
        height: 0.3*height,
        marginTop:'auto',
    },
    row:{
        flexDirection:'row',   
    },
    country: {
        padding: 20,
        height: height*0.5,
        marginHorizontal: 16,
        textAlign: 'left',
    },
    title: {
        fontSize: 50,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    flag: {
        height: 200,
        width: 200
    },
    info: {
        marginVertical: 10,
        fontSize: 20,
    },
    infoBold: {
        marginVertical: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoBoldLeft: {
        marginTop: 8,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 'auto',
    },
    button:{
        width: width/4,
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: 'red',
    },
    button1:{
        width: width/2,
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: 'red',
        marginRight: 20,
        marginLeft: ((0.25*width)-20)/2,
    },
    roundButton:{
        width: butsize,
        height: butsize,
        borderRadius: butsize/2,
        backgroundColor: butColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    roundButtonLeft:{
        width: butsize,
        height: butsize,
        borderRadius: butsize/2,
        backgroundColor: butColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: width-2*butsize-2*10,
    },
    circle:{
        width: circlesize,
        height: circlesize,
        backgroundColor: '#dc8033',
        borderWidth: 0,
        borderRadius: circlesize/2,
        position: 'absolute',
        marginTop: -circlesize*0.2,
        marginLeft: -circlesize*0.3,
        opacity: 0.9,
    }

  });