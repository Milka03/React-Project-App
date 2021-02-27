import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TextInput, StatusBar, Image, Dimensions,Animated,Button } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import HeaderNavBar from './HeaderNavBar';
import home from './assets/home.png'

const {width, height} = Dimensions.get("screen")
const butColor = '#38373c';
const butsize=50;

export default function FlatsDetailScreen({route, navigation}) {
    const item = navigation.getParam('flat');
    const token = navigation.getParam('token');
    const ID = item.id;

    const [base ,setBase] = useState(`./assets/home.png`);
    const [ImagesList,setImagesList] = useState([])
    const [currentImage,setCurrentImage] = useState(0)

    useEffect(() => {loadDefault();fetchData();},[navigation]);

    const fetchData = () => {
        let TmpImagesList=[]
        const url =`http://flatly-env.eba-pftr9jj2.eu-central-1.elasticbeanstalk.com/flats/${ID}`;
        fetch(url, {
          method: "GET",
          headers: {
              'Accept': '*/*',
              'security-header': token
            },
          })
          .then((response) => response.json())
          .then(response => {TmpImagesList = response.images})
          .catch((error) => console.error(error))
          .finally(() => {setImagesList(TmpImagesList);setBase(`data:image/png;base64,${TmpImagesList[0].data}`);})
    }
    const loadDefault =()=>{
        if(item.images!=null)
        {
            setBase(`data:image/png;base64,${item.images[0].data}`);
        }
    }
    
    const moveRight = () =>{
        console.log("right")
        move(1)
    }
    const moveLeft = () =>{
        console.log("left")
        move(-1)
    }
    const move = (direction) =>{
        let tmp = currentImage + direction;
        console.log("ImagesListLength: "+ ImagesList.length + " currentImage: "+ currentImage)
        if (tmp<0)
        {
            tmp =ImagesList.length-1;
        }
        if(tmp > ImagesList.length-1)
        {
            tmp=0;
        }
        setCurrentImage(tmp);
        console.log("tmp: " + tmp)
        setBase(`data:image/png;base64,${ImagesList[tmp].data}`);
    }

    return (
        <SafeAreaView >
            <View style={styles.circle}></View>
            <HeaderNavBar page={"Flats"} navigation={navigation} token={token}/>
            <View style={styles.topPanel}>
                    <Text style={styles.title}>{item.name}</Text>
                    <View style={styles.container}>
                        {item.images!=null || ImagesList!=null ?
                        <Image
                            style={styles.flag}
                            source={{uri: base}}/>:
                        <Image
                            style={styles.flag}
                            source={home}/> }
                    </View>
            </View>
            <View style={styles.midPanel}>
                <TouchableOpacity onPress={() => moveLeft()} style={styles.roundButton}>
                    <Icon name="arrow-left" color='white' size={butsize}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => moveRight()} style={styles.roundButtonLeft}>
                    <Icon name="arrow-right" color='white' size={butsize}/>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomPanel}>
                <View style={styles.row}>
                    <Text style={styles.infoBold}> {`Max guests:  ${item.maxGuests}` } </Text>
                    <Text style={styles.infoBoldLeft}> {`${item.price} PLN/Night`} </Text>
                </View>
                <Text style={styles.info}> {`Location:  ${item.address.city}, ${item.address.country}`} </Text>
                <Text style={styles.info}> {`Address:  ${item.address.streetName} ${item.address.buildingNumber}${item.address.flatNumber!=null && item.address.flatNumber!='null' && item.address.flatNumber!="" ? "/"+item.address.flatNumber : ""}, ${item.address.postCode}`} </Text>
                <Text style={styles.info}> {`Flat type:  ${item.flatType}`} </Text>
                <View  style={styles.button}>
                    <Button title="Back" color='black' onPress={() => navigation.navigate('Flats',{token: token})}></Button>
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
        height: 0.4*height,
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
        marginTop: 8,
        fontSize: 20,
    },
    infoBold: {
        marginTop: 8,
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
        marginTop: 10,
        alignSelf: 'center',
        backgroundColor: 'red',
        marginTop: 'auto',
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
  