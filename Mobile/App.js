import * as React from 'react';
import { View, Text } from 'react-native';
//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
//import { StackNavigator } from 'react-navigation'
import FlatsScreen from './FlatsScreen'
import BookingScreen from './BookingScreen'
import FlatsDetailScreen from './FlatsDetailScreen'
import LoginScreen from './LoginScreen';
import BookingDetailScreen from './BookingDetailScreen';


const MainNavigator = createStackNavigator(
  {
    Home: { 
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
        animationEnabled: false,
        }
    },
    Bookings: {
      screen: BookingScreen,
      navigationOptions: {
        headerShown: false,
        animationEnabled: false,
        }
    },
    Flats: {
      screen: FlatsScreen,
      navigationOptions: {
        headerShown: false,
        animationEnabled: false,
        }
    },
    FlatDetails: {
      screen: FlatsDetailScreen,
      navigationOptions: {
        headerShown: false,
        animationEnabled: false,
        }
    },
    BookingDetails: {
      screen: BookingDetailScreen,
      navigationOptions: {
        headerShown: false,
        animationEnabled: false,
        }
    },
  },
  {
    initialRouteName: 'Home',
  }
);

const Navigation = createAppContainer(MainNavigator);

export default class App extends React.Component {
  render() {
    return (
        <Navigation/>
    );
  }
}
