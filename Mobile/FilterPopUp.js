import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Dimensions, Animated, Text,Button,Keyboard} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import { Icon } from 'react-native-elements'
import { ModalDatePicker } from "react-native-material-date-picker";
import { debug } from 'react-native-reanimated';
import { PixelRatio } from 'react-native';

const {width, height} = Dimensions.get("screen")

//For animation
//animateView:
const FPanelHeightOpen =0.45
const FPanelHeightClose=0.38

const initPos=-15
const endiPos =10
var currentPos=initPos
const initOpacity=0
const endiOpacity=1
var currentOpacity=initOpacity
const initBRadious=0
const endiBRadious=20
var currentBRadious=initBRadious

function GetFormatedDate({date,prefix}){
    return(
        <View style={styles.DateInput}>
            <Text>{prefix}: {date.getFullYear()}-{date.getMonth()+1}-{date.getDate()}</Text>
        </View>
    );
}
export default class FilterPopUp extends Component{

    /*
    Props options:
    DateActive = true/false 
    */
    state={
            //This obj is allways on top need to be programatically switch active or not
            Active: false,
            FPanelHeight: height*FPanelHeightOpen,
            //view animation
            posAnimation: new Animated.Value(initPos),
            opaAnimation: new Animated.Value(initOpacity),
            borAnimation: new Animated.Value(initBRadious),

            //keyboard show/hide animation:
            hei1Animation: new Animated.Value(10),
            hei2Animation: new Animated.Value(20),
            opa2Animation: new Animated.Value(1),


            //FilteringValues:
            FlatName: "",
            selectedCountry: "",
            selectedCity: "",
            PriceFrom: "",
            PriceTo: "",
            GuestsFrom: "",
            GuestsTo: "",
            DateFromFilter: "",
            DataToFilter: "",
            
            //FilteringValues helpers:
            DateFrom: new Date(),
            DateTo: new Date(),

            //Calendar
            CalendarMode: "From",

            //For Dropdowns
            countries: [],
            cities: [],
    }
    constructor(props)
    {
        super(props);
        this.CalendarRef = React.createRef();

    }


    setToken(token)
    {
        //console.log("popupem jestem :"+token);
        this.setState({FlatName: ""});
        this.setState({selectedCountry: ""});
        this.setState({selectedCity: ""});
        this.setState({PriceFrom: ""});
        this.setState({PriceTo: ""});
        this.setState({GuestsFrom: ""});
        this.setState({GuestsTo: ""});
        this.setState({DateFromFilter: ""});
        this.setState({DataToFilter: ""});
        this.setState({DateFrom: new Date()});
        this.setState({DateTo: new Date()});
        this.fetchData(token)
    }
    fetchData(token){
        const url ="http://flatly-env.eba-pftr9jj2.eu-central-1.elasticbeanstalk.com/metadata/countries"; 
        
        let tmpCountries=[]
        let tmpCities=[]
        fetch(url, {
          method: "GET",
          headers: {
              'Accept': '*/*',
              'security-header': token
            },
          })
          .then((response) => response.json())
          .then((response) => tmpCountries=response)
          .catch((error) => console.error(error))
          .finally(() => this.setState({countries: tmpCountries}));

          const url1 ="http://flatly-env.eba-pftr9jj2.eu-central-1.elasticbeanstalk.com/metadata/cities";  
          fetch(url1, {
            method: "GET",
            headers: {
                'Accept': '*/*',
                'security-header': token
              },
            })
            .then((response) => response.json())
            .then((response) => tmpCities=response)
            .catch((error) => console.error(error))
            .finally(() => this.setState({cities: tmpCities}));
      }

    sumbitHandler =() =>{
        this.animateView();
        const data = {
            'flatName':   this.state.FlatName,
            'Country':    this.state.selectedCountry,
            'City':       this.state.selectedCity,
            'priceFrom':  this.state.PriceFrom,
            'priceTo':    this.state.PriceTo,
            'guestsFrom': this.state.GuestsFrom,
            'guestsTo':   this.state.GuestsTo,
            'dateFrom' :  this.state.DateFromFilter,
            'dateTo':     this.state.DataToFilter,
        }
        this.props.handleSearch(data);
    }

    //Keyboard:
    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.onKeyboardShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.onKeyboardHide,);
      }
    
      componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      }
    
    //Animations:
    animateView = () =>{
        if (currentPos==initPos)
        {
            this.setState({ Active: true });
            currentPos=endiPos;
            currentOpacity=endiOpacity;
            currentBRadious=endiBRadious;
        }
        else 
        {
            currentPos=initPos;
            currentOpacity=initOpacity;
            currentBRadious=initBRadious;
        }
        this.setState({ FPanelHeight: height*FPanelHeightOpen })
        Animated.timing(this.state.posAnimation,{
            toValue:  currentPos,
            duration: 300,
            useNativeDriver: true
        }).start(()=>{
            if(currentPos==initPos)this.setState({ Active: false });
            Animated.timing(this.state.posAnimation,{
                toValue:  currentPos-2,
                duration: 150,
                useNativeDriver: true
            }).start(()=>{
            });
        }
        );
        Animated.timing(this.state.opaAnimation,{
            toValue:  currentOpacity,
            duration: 200,
            useNativeDriver: true
        }).start();
        Animated.timing(this.state.borAnimation,{
            toValue:  currentBRadious,
            duration: 1200,
            useNativeDriver: true
        }).start();
    };


    onKeyboardShow =() =>{
        Animated.timing(this.state.hei1Animation,{toValue:  5,duration: 200,useNativeDriver: true}).start();
        Animated.timing(this.state.hei2Animation,{toValue:  5,duration: 200,useNativeDriver: true}).start();
        Animated.timing(this.state.opa2Animation,{toValue:  0,duration: 20,useNativeDriver: true}).start(
            () =>{this.setState({ FPanelHeight: height*FPanelHeightClose })}
        );
    }

    onKeyboardHide =() =>{
        this.setState({ FPanelHeight: height*FPanelHeightOpen })
        Animated.timing(this.state.hei1Animation,{toValue:  10,duration: 200,useNativeDriver: true}).start();
        Animated.timing(this.state.hei2Animation,{toValue:  20,duration: 200,useNativeDriver: true}).start();
        Animated.timing(this.state.opa2Animation,{toValue:   1,duration: 200,useNativeDriver: true}).start();
    }

    showCalendar=(mode) =>{
        //console.log("ustawiam mode: " + mode)
        this.setState({ CalendarMode: mode })
        this.CalendarRef.current.showModal()
    }
    convto2dig=(data)=>{
        if (data<10)
        {
            return "0"+data;
        }
        else{
            return data;
        }
    }
    setCalendarDate = (date)=>{
        //console.log("The mode: " + this.state.CalendarMode)
        if(this.state.CalendarMode=="From")
        {
            this.setState({ DateFrom: date })
           // console.log("ustawiam DateFromFilter na : "+`${date.getFullYear()}-${this.convto2dig(date.getMonth()+1)}-${this.convto2dig(date.getDate())}`)
            this.setState({DateFromFilter : `${date.getFullYear()}-${this.convto2dig(date.getMonth()+1)}-${this.convto2dig(date.getDate())}`})
        }
        else{
            this.setState({ DateTo: date })
            this.setState({DataToFilter : `${date.getFullYear()}-${this.convto2dig(date.getMonth()+1)}-${this.convto2dig(date.getDate())}`})
        }
    }

    changeto2D = (data)=>{
        let newData=[];

        data.forEach(element => {
            newData.push({ label: element, value: element })
        });
        //console.log("newdata: " + newData)
        //console.log("changeto2D" + data)
        return (newData);
    }
    render(){
        const hei1Animation={transform: [{translateY: this.state.hei1Animation,}],};
        const hei2Animation={transform: [{translateY: this.state.hei2Animation,}],};
        const Opa2Animation={
            transform: [
                {
                    scale: this.state.opa2Animation
                }
            ],
            opacity: this.state.opa2Animation,
            };
        
        const BorderAnimation={
            borderRadius: this.state.borAnimation,
        };

        const ViewAnimation={
            transform: [
                {
                translateY: this.state.posAnimation,
                }
            ],
            opacity: this.state.opaAnimation,
        };
        return(
            
            <View style={styles.container} >
                {this.state.Active ? 
                <Animated.View style={[styles.PopUp, ViewAnimation]}>
                    <View style={[styles.shadow]} />
                    <View style={[styles.triangle, this.props.style]} />
                    <Animated.View style={[styles.filterPanel, {height: this.state.FPanelHeight}, BorderAnimation]}>
                        <Animated.View style={[styles.SearchBar]}>
                            <Icon name='search' color='orange'/>
                            <TextInput style={styles.textinput} placeholder="Search by flat name" onChangeText={(e)=>this.setState({FlatName: e})} onSubmitEditing={this.sumbitHandler}/>
                        </Animated.View>
                        <View>
                            <DropDownPicker items={this.changeto2D(this.state.countries)} placeholder="Country" searchable={true} labelStyle={{color: '#000000'}} containerStyle={{height: 40, width: 300,marginVertical: 3}} onChangeItem={item => this.setState({selectedCountry: item.value})}/>                        
                        </View>
                        <View>
                            <DropDownPicker items={this.changeto2D(this.state.cities)}   placeholder="City"    searchable={true} labelStyle={{color: '#000000'}} containerStyle={{height: 40, width: 300,marginVertical: 3}} onChangeItem={item => this.setState({selectedCity: item.value})}/>                        
                        </View>
                        {this.props.DateActive=="true" ?
                        <View style={{height: 80}}>
                                <Animated.View style={[styles.priceBar,hei1Animation]}>
                                    <Text style={{fontSize: 20, marginRight:'auto'}} >Date: </Text>
                                    <TouchableOpacity onPress={() => this.showCalendar("From")}><GetFormatedDate date={this.state.DateFrom} prefix="From"/></TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.showCalendar("To")}><GetFormatedDate date={this.state.DateTo}   prefix="To"  /></TouchableOpacity>
                                    <ModalDatePicker ref={this.CalendarRef} button={<View/>} locale="en" onSelect={(date) => this.setCalendarDate(date)} initialDate={new Date()}/>   
                                </Animated.View>
                        </View>:
                            <View>
                                <Animated.View style={[styles.priceBar,hei1Animation]}>
                                    <Text style={{fontSize: 20, marginRight:'auto'}} >Price: </Text>
                                    <TextInput onChangeText={(e)=>this.setState({PriceFrom: e})} keyboardType='numeric' style={styles.textprice} placeholder="From"/>
                                    <TextInput onChangeText={(e)=>this.setState({PriceTo: e})}  keyboardType='numeric' style={styles.textprice} placeholder="To"/>
                                </Animated.View>
                                <Animated.View style={[styles.guestsBar,hei2Animation]}>
                                    <Text style={{fontSize: 20, marginRight:'auto'}} >Max Guests: </Text>
                                    <TextInput onChangeText={(e)=>this.setState({GuestsFrom: e})} keyboardType='numeric' style={styles.textprice} placeholder="From"/>
                                    <TextInput onChangeText={(e)=>this.setState({GuestsTo: e})} keyboardType='numeric' style={styles.textprice} placeholder="To"/>
                                </Animated.View>
                            </View>
                        }
                        <Animated.View style={[styles.SearchButton, Opa2Animation]}>
                            <Button title="Search"  onPress={() => this.sumbitHandler()} color='#38373c'></Button>
                        </Animated.View>
                     </Animated.View>
                </Animated.View>: <View style={{backgroundColor: 'red'}}/>}
            </View>
        )
    }
}

const backgroundPopUpColor = '#FFFFFF'
const styles = StyleSheet.create({
    dropdown1:{
        zIndex: 50000,
    },
    guestsBar:{
        zIndex: -1,
        flexDirection:'row', 
        height:40, 
        width: width*0.7,
        marginBottom: 10,
    },
    priceBar:{
        zIndex: -1,
        flexDirection:'row', 
        height:40, 
        width: width*0.7,
        marginTop: 5,
    },
    SearchBar:{
        flexDirection:'row',
        marginBottom:6,
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 5,
        width: 300,
        marginBottom: 15,
        marginTop: 20,
    },
    SearchButton:{
        marginTop: 20,
    },
    textprice: {
        fontSize: 16,
        height: 30,
        width: 70,
        marginLeft: 10,
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 5,
    },
    textinput: {
        fontSize: 20,
        textAlign: 'center',
    },
    container: {
      flex: 1,
      width: width,
      height: height,
      alignItems: 'center',
    },
    PopUp: {
        alignItems: 'center',
      },
      triangle: {
        width: 0,
        height: 10,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 20,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: backgroundPopUpColor,
      },
      filterPanel: {
        width: width*0.9,
        backgroundColor: backgroundPopUpColor,
        alignItems: 'center',
        padding: 10,
      },
      shadow:{
        backgroundColor: '#38373c', 
        position: 'absolute', 
        width: width, 
        height: 2*height, 
        marginTop: -height, 
        opacity: 0.2,
      },
      DateInput:{
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 10,
          opacity: 0.5,
          margin: 2,
          padding: 5,
      }
});