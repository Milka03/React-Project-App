import React, { useEffect, useState } from 'react';
import { useRef, forwardRef } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, TextInput, StatusBar, Image, RefreshControl, Button, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { debug } from 'react-native-reanimated';
import FilterPopUp from './FilterPopUp';
import flatData from './server/db.json';
import HeaderNavBar from './HeaderNavBar';
import LoadingAnim from './LoadingAnim';
import home from './assets/home.png'

const {width,height} = Dimensions.get("screen")
const flagSize=100
const infoBarSize=width*0.78
const buttonW = width*0.3
const centerMargin = (width - 3*buttonW)/4;
const bigButtonW = 3*buttonW + 2*centerMargin

function ListItem({ item, navigation, token }) {
  return (
        <SafeAreaView style={styles.item}>
                <View style={{flex: 1, flexDirection:'row'}}>
                <TouchableOpacity style={styles.itemBackground} onPress={() => navigation.navigate('FlatDetails',{flat: item, token: token})}>
                        <View>
                            <Text style={styles.itemtitle}>{item.name}</Text>
                        </View>
                        <View>
                            <Text style={styles.itemtext}>  {`Location: ${item.address.city}, ${item.address.country}`}</Text>
                            <Text style={styles.itemtext}> {`Price: ${item.price} per night`} </Text>
                        </View>
                    </TouchableOpacity>
                    <View>
                      {item.images!=null ?
                       <Image
                          style={styles.itemFlag}
                          source={{uri: `data:image/png;base64,${item.images[0].data}`}}/> :
                        <Image
                        style={styles.itemFlag}
                        source={home}/> }
                      <View/>
                    </View>
                </View>
        </SafeAreaView>
    );
}


export default function FlatsScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [flats, setFlats] = useState([]);
    const [searchString, setSearchString] = useState('');
    const FilterRef = useRef(null);
    const LoadingRef = useRef(null);

    const token=navigation.getParam('token')
    const flagSize=150
    const infoBarSize=width*0.78
    const buttonW = width*0.3
    const centerMargin = (width - 3*buttonW)/4;
    const bigButtonW = 3*buttonW + 2*centerMargin
    //const [searchLength, setSearchLength] = useState({last: 111, newest: 0})
  
    const ustawLoading =(mode) =>
    {
      setLoading(mode);
      if(mode==true)
      {
        LoadingRef.current.show()
      }
      else{
        LoadingRef.current.hide()
      }
    }
    const filterData = (data) => {
      let url =`http://flatly-env.eba-pftr9jj2.eu-central-1.elasticbeanstalk.com/flats?`;
      if(data.flatName!="")  url +=`&name=${data.flatName}`;
      if(data.Country!="")   url +=`&country=${data.Country}`;
      if(data.City!="")      url +=`&city=${data.City}`;
      if(data.priceFrom!="") url +=`&priceFrom=${data.priceFrom}`;
      if(data.priceTo!="")   url +=`&priceTo=${data.priceTo}`;
      if(data.guestsFrom!="")url +=`&guestsFrom=${data.guestsFrom}`;
      if(data.guestsTo!="")  url +=`&guestsTo=${data.guestsTo}`;
      ustawLoading(true);
      fetch(url, {
        method: "GET",
        headers: {
            'Accept': '*/*',
            'security-header': token       
          },
        })
        .then((response) => response.json())
        .then(response => response.content)
        .then((response) => setFlats(response))
        .catch((error) => console.error(error))
        .finally(() => setTimeout(()=>ustawLoading(false),1000));
    }
  
    const fetchData = () => {
      const url ="http://flatly-env.eba-pftr9jj2.eu-central-1.elasticbeanstalk.com/flats";
      ustawLoading(true);
      fetch(url, {
        method: "GET",
        headers: {
            'Accept': '*/*',
            'security-header': token
          },
        })
        .then((response) => response.json())
        .then(response => response.content)
        .then((response) => setFlats(response))
        .catch((error) => console.error(error))
        .finally(() => setTimeout(()=>ustawLoading(false),1000));
    }
  
    useEffect(() => {
      fetchData();
    }, []);

    const FilterManager =() =>{
      FilterRef.current.animateView();
      FilterRef.current.setToken(token);
    }
    
    return (
      <SafeAreaView style={styles.container}>
        <HeaderNavBar page={"Flats"} navigation={navigation} token={token}/>
        <View style={styles.naviFilter}>
                <Button color="#dc8033" title="Filter" onPress={() =>FilterManager()}></Button>
        </View>     

        <View>
        <LoadingAnim ref={LoadingRef}/>
        { isLoading ? <View/>:
          <View>
            <FlatList style={{marginBottom: 140}}
              data={flats.length > 0 ? flats.slice(0, flats.length) : []}
              renderItem={({ item }) => <ListItem item={item} navigation={navigation} token={token}/>}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => fetchData()}/>}
              />
          </View>}
          <View style={{position: 'absolute'}}>
            <FilterPopUp ref={FilterRef} DateActive="false" token={token} handleSearch={filterData}/>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  

  const styles = StyleSheet.create({
    item: {
      marginHorizontal: 15,
    },
    itemtitle: {
      fontSize: 20,
      color: 'black',
    },
    itemtext: {
      fontSize: 14,
      color: 'gray',
    },
    itemFlag: {
      marginTop: 'auto',
      marginBottom: flagSize/10,
      height: flagSize,
      width: flagSize,
      borderColor: '#dc8033',
      backgroundColor: 'white',
      borderWidth: 5,
      borderRadius: flagSize/2,
      marginLeft: -infoBarSize-flagSize/2,
    },
    itemBackground:{
      backgroundColor: 'white', 
      borderBottomColor: '#dc8033',
      borderBottomWidth: 5,
      width: infoBarSize,
      marginLeft: flagSize/2,
      marginVertical: flagSize*0.1,
      paddingLeft: flagSize*0.6,
      paddingVertical: flagSize*0.1,
    },
    naviFilter:{
      paddingHorizontal: 10,
      marginVertical: 5,
      justifyContent: 'center',
    },
    container: {
      flex: 1,
    },
    input: {
      borderRadius: 3,
      borderColor: '#000000',
      borderWidth: 2,
      marginTop: 16,
      marginHorizontal: 16,
      paddingLeft: 6
    },
    lenCount: {
      fontSize: 20,
      textAlign: 'center',
      marginTop: 3
    }
  });
  
