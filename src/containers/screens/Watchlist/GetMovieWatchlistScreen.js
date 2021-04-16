import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, SafeAreaView, View } from "react-native";
import { inject, observer } from "mobx-react";
import { useFocusEffect } from '@react-navigation/native';
import { WatchlistItem } from "../../components/WatchlistItem";
import { AddWatchlistFromTmdb } from "../../../features/AddWatchlistFromTmdb";
import { mainStyles } from "../../../styles/mainStyles";

const getMovieWatchlistScreen = (props) => {
	const [displayLoader, setDisplayLoader] = useState('flex')

	useEffect(() => {
		AddWatchlistFromTmdb(props, 'movie').then(() => setDisplayLoader('none'))
	}, [])

	useFocusEffect(
		React.useCallback(() => {
			AddWatchlistFromTmdb(props, 'movie').then(() => setDisplayLoader('none'))
		}, [props.navigation])
	);

	const renderWatchlistItem = ({ item }) =>
		<WatchlistItem watchlist={ item }
					   props={ props }
					   media_type={ "movie" }
		/>

	return (
		<View>
			<SafeAreaView>
				<FlatList
					data={ props.watchlistStore.watchlist.watchlistMovie }
					extraData={ props.watchlistStore.watchlist.watchlistMovie }
					renderItem={ renderWatchlistItem }
					keyExtractor={ item => item.id.toString() }
				/>
			</SafeAreaView>
			<ActivityIndicator style={ { flex: 1, marginTop: 20, display: displayLoader } }
							   size="small"
							   color="#82aaff"
			/>
		</View>

	)
}

const GetMovieWatchlistScreen = inject('loginStore', 'watchlistStore', 'mediaStore')(observer(getMovieWatchlistScreen))
export default GetMovieWatchlistScreen
