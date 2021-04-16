import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GetTvWatchlistScreen from "../containers/screens/Watchlist/GetTvWatchlistScreen";
import GetMovieWatchlistScreen from "../containers/screens/Watchlist/GetMovieWatchlistScreen";
import { inject, observer } from "mobx-react";
import { View, Text } from "react-native"

import Icon from 'react-native-vector-icons/Ionicons'

const Tab = createMaterialTopTabNavigator();

const watchlistNavigation = (props) => {
	let watchlistMovieSize = props.watchlistStore.watchlist.watchlistMovie.length
	let watchlistTvSize = props.watchlistStore.watchlist.watchlistTv.length

	return (
		<Tab.Navigator
			screenOptions={ ({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === 'watchlistMovie') {
						iconName = focused
							? 'ios-videocam'
							: 'ios-videocam-outline';
					} else if (route.name === 'watchlistTv') {
						iconName = focused
							? 'ios-tv'
							: 'ios-tv-outline';
					}

					return <Icon name={ iconName } size={ size } color={ color }/>;
				},
			}) }
			tabBarOptions={ {
				activeTintColor: '#82aaff',
				inactiveTintColor: '#A6ACCD',
			} }
		>
			<Tab.Screen name="watchlistMovie" component={ GetMovieWatchlistScreen }
						options={ {
							tabBarLabel: `FILMS (${watchlistMovieSize})`,
							media_type: 'movie'
						} }
			/>
			<Tab.Screen name="watchlistTv" component={ GetTvWatchlistScreen }
						options={ {
							tabBarLabel: `Séries (${watchlistTvSize})`,
							media_type: 'tv'
						} }/>
		</Tab.Navigator>
	)
}

export const WatchlistNavigation = inject('loginStore', 'watchlistStore')(observer(watchlistNavigation));

