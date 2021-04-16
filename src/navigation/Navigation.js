import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View } from "react-native"
import { createStackNavigator } from '@react-navigation/stack';
import { WatchlistNavigation } from "./WatchlistNavigation";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GetMovieByIdScreen } from "../containers/screens/Movies/GetMovieByIdScreen";
import { GetTvByIdScreen } from "../containers/screens/Movies/GetTvByIdScreen";
import { LoginScreen } from '../containers/screens/Authentication/LoginScreen';
import { inject, observer } from 'mobx-react';
import { ProfileScreen } from '../containers/screens/User/ProfileScreen';
import GetPopularMovieScreen from "../containers/screens/Movies/GetPopularMoviesScreen";
import GetPopularTVScreen from "../containers/screens/Movies/GetPopularTVScreen";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import GetSearchMultiScreen from "../containers/screens/Movies/GetSearchMultiScreen";
import { GetPersonByIdScreen } from "../containers/screens/Movies/GetPersonByIdScreen";

function getHeaderTitle(route) {
	const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

	switch (routeName) {
		case 'PopularMovies':
			return 'Films populaires';
		case 'PopularTv':
			return 'Séries populaires';
		case 'Watchlist':
			return 'Watchlist';
	}
}

const TabNavigator = () => {

	return (
		<Tab.Navigator
			screenOptions={ ({ route }) => (
				{
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;

						if (route.name === 'PopularMovies') {
							iconName = focused
								? 'ios-videocam'
								: 'ios-videocam-outline';
						} else if (route.name === 'PopularTv') {
							iconName = focused
								? 'ios-tv'
								: 'ios-tv-outline';
						} else if (route.name === 'Watchlist') {
							iconName = focused
								? 'ios-list'
								: 'ios-list-outline';
						} else if (route.name === 'Search') {
							iconName = focused
								? 'ios-search'
								: 'ios-search-outline';
						}

						return <Ionicons name={ iconName } size={ size } color={ color }/>;
					},

				}) }
			tabBarOptions={ {
				activeTintColor: '#82aaff',
				inactiveTintColor: '#A6ACCD',
			} }
		>
			<Tab.Screen name="PopularMovies" component={ GetPopularMovieScreen }
						options={ { title: "Films populaires" } }/>
			<Tab.Screen name="PopularTv" component={ GetPopularTVScreen } options={ { title: "Séries populaires" } }/>
			<Tab.Screen name="Watchlist" component={ WatchlistNavigation } options={ { title: "Watchlist" } }/>
		</Tab.Navigator>
	)
}

const NavigationHandler = (props) => {
	const { loginStore, watchlistStore } = props
	return (
		<Stack.Navigator initialRouteName="LoginScreen" screenOptions={ ({ route, navigation }) => ({
			headerRight: ({ color }) => {
				if (route.name !== 'LoginScreen' && route.name !== 'Profile') {
					return <View style={ { flexDirection: "row" } }>
						<Ionicons style={ { marginRight: 15 } } name='ios-search' size={ 25 } color={ color }
								  onPress={ () => navigation.navigate('Search') }/>
						<Ionicons style={ { marginRight: 15 } } name='ios-person' size={ 25 } color={ color }
								  onPress={ () => navigation.navigate('Profile') }/>
						<Ionicons style={ { marginRight: 15 } } name='ios-log-out-outline' size={ 25 } color={ color }
								  onPress={ () => {
									  loginStore.signUserInOut(false), navigation.navigate('TabNavigator')
								  } }/>
					</View>
				} else if (route.name === 'Profile') {
					return <View style={ { flexDirection: "row" } }>
						<Ionicons style={ { marginRight: 5 } } name='ios-log-out-outline' size={ 25 } color={ color }
								  onPress={ () => {
									  loginStore.signUserInOut(false), navigation.navigate('TabNavigator')
								  } }/>
					</View>
				}
			}
		}) }>
			{
				loginStore.user.isSignedIn
					? (
						<Stack.Screen name="Films populaires"
									  component={ TabNavigator }
									  options={ ({ route }) => ({
										  headerTitle: getHeaderTitle(route),
										  watchlistStore: watchlistStore
									  }) }
						/>
					)
					: <Stack.Screen name="LoginScreen"
									component={ LoginScreen }
									options={ { title: 'Inscription', headerShown: false } }
					/>
			}
			<Stack.Screen name="GetMovieByIdScreen"
						  component={ GetMovieByIdScreen }
						  options={ { title: 'Détail' } }
			/>
			<Stack.Screen name="GetTvByIdScreen"
						  component={ GetTvByIdScreen }
						  options={ { title: 'Détail' } }
			/>
			<Stack.Screen name="GetPersonByIdScreen"
						  component={ GetPersonByIdScreen }
						  options={ { title: 'Détail' } }
			/>
			<Stack.Screen name="Profile" component={ ProfileScreen }
						  options={ { title: 'Votre profil' } }/>
			<Stack.Screen name="Search" component={ GetSearchMultiScreen } options={ { title: 'Recherche' } }/>

		</Stack.Navigator>
	)
}

export const Navigation = inject('loginStore', 'watchlistStore')(observer(NavigationHandler));
