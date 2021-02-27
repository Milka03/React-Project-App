import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Dimensions, Animated, Text,Button,Keyboard} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import { Icon } from 'react-native-elements'
import { debug } from 'react-native-reanimated';
import { PixelRatio } from 'react-native';

const {width, height} = Dimensions.get("screen")
const speed=300
const deltaspeed=50
const initMaxH=5
let counter=0;
const NoOfAnim=3;
export default class FilterPopUp extends Component{

    state={
        dot1UpAnimation: new Animated.Value(-initMaxH),
        dot2UpAnimation: new Animated.Value(-initMaxH),
        dot3UpAnimation: new Animated.Value(-initMaxH),
        dot4UpAnimation: new Animated.Value(-initMaxH),

        opacityAnimation: new Animated.Value(1),

        maxH1: initMaxH,
        maxH2: initMaxH,
        maxH3: initMaxH,
        maxH4: initMaxH,
    }

    constructor(props){
        super(props);
    }

    hide=() =>{
        Animated.timing(this.state.opacityAnimation,{toValue: 0,duration: speed,useNativeDriver: true}).start()
    }

    show=()=>{
        Animated.timing(this.state.opacityAnimation,{toValue: 1,duration: speed,useNativeDriver: true}).start(
            ()=>{
            this.dot1Up()
            setTimeout(()=>this.dot2Up(),deltaspeed)
            setTimeout(()=>this.dot3Up(),2*deltaspeed)
            setTimeout(()=>this.dot4Up(),3*deltaspeed)

            setTimeout(()=>this.dot1Up(),1*deltaspeed+speed)
            setTimeout(()=>this.dot2Up(),2*deltaspeed+speed)
            setTimeout(()=>this.dot3Up(),3*deltaspeed+speed)
            setTimeout(()=>this.dot4Up(),4*deltaspeed+speed)}
        )

    }
    dot1Up =() =>{
        this.setState({ maxH1: - this.state.maxH1 })
        Animated.timing(this.state.dot1UpAnimation,{toValue:  this.state.maxH1,duration: speed,useNativeDriver: true}).start(
        ()=>Animated.timing(this.state.dot1UpAnimation,{toValue:  -this.state.maxH1,duration: speed,useNativeDriver: true}).start());
    }
    dot2Up =() =>{
        this.setState({ maxH2: - this.state.maxH2 })
        Animated.timing(this.state.dot2UpAnimation,{toValue:  this.state.maxH2,duration: speed,useNativeDriver: true}).start(
        ()=>Animated.timing(this.state.dot2UpAnimation,{toValue:  -this.state.maxH2,duration: speed,useNativeDriver: true}).start());
    }
    dot3Up =() =>{
        this.setState({ maxH3: - this.state.maxH3 })
        Animated.timing(this.state.dot3UpAnimation,{toValue:   this.state.maxH3,duration: speed,useNativeDriver: true}).start(
        ()=>Animated.timing(this.state.dot3UpAnimation,{toValue:  -this.state.maxH3,duration: speed,useNativeDriver: true}).start());
    }
    dot4Up =() =>{
        this.setState({ maxH4: - this.state.maxH4 })
        Animated.timing(this.state.dot4UpAnimation,{toValue:   this.state.maxH4,duration: speed,useNativeDriver: true}).start(
        ()=>Animated.timing(this.state.dot4UpAnimation,{toValue:  -this.state.maxH4,duration: speed,useNativeDriver: true}).start());
    }
    render(){
        const dot1Animation={transform: [{translateY: this.state.dot1UpAnimation,}],};
        const dot2Animation={transform: [{translateY: this.state.dot2UpAnimation,}],};
        const dot3Animation={transform: [{translateY: this.state.dot3UpAnimation,}],};
        const dot4Animation={transform: [{translateY: this.state.dot4UpAnimation,}],};

        const ViewAnimation={opacity: this.state.opacityAnimation,};        
        return(
            
            <View style={styles.container}>
                <Animated.View style={[{flexDirection:'row'},ViewAnimation]}>
                    <Animated.View style={[styles.dot, dot1Animation]}></Animated.View>
                    <Animated.View style={[styles.dot, dot2Animation]}></Animated.View>
                    <Animated.View style={[styles.dot, dot3Animation]}></Animated.View>
                    <Animated.View style={[styles.dot, dot4Animation]}></Animated.View>
                </Animated.View>
            </View>
        )
    }
}


const dotsize=10
const styles = StyleSheet.create({
    container:{
        height: 3*initMaxH,
        marginVertical: 3*initMaxH,
        marginLeft: width/2-50,
        marginTop: height*0.4,
        marginBottom: 'auto',
        position: 'absolute',
    },

    dot:{
        width: dotsize,
        height: dotsize,
        backgroundColor: 'orange',
        borderWidth: 0,
        borderRadius: dotsize/2,
        margin: dotsize/2,
    }

});