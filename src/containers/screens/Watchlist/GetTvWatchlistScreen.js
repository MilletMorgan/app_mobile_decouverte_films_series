import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, SafeAreaView, View } from "react-native";
import { inject, observer } from "mobx-react";
import { useFocusEffect } from '@react-navigation/native';
import { WatchlistItem } from "../../components/WatchlistItem";
import { AddWatchlistFromTmdb } from "../../../features/AddWatchlistFromTmdb";
import { mainStyles } from "../../../styles/mainStyles";

const getTvWatchlistScreen = (props) => {
	const [displayLoader, setDisplayLoader] = useState('flex')

	useEffect(() => {
		AddWatchlistFromTmdb(props, 'tv').then(() => setDisplayLoader('none'))
	}, [])

	useFocusEffect(
		React.useCallback(() => {
			AddWatchlistFromTmdb(props, 'tv').then(() => setDisplayLoader('none'))
		}, [props.navigation])
	);

	const renderWatchlistItem = ({ item }) =>
		<WatchlistItem watchlist={item}
			props={props}
			media_type={"tv"}
		/>

	return (
		<View>
			<SafeAreaView style={mainStyles.container}>
				<FlatList
					data={props.watchlistStore.watchlist.watchlistTv}
					extraData={props.watchlistStore.watchlist.watchlistTv}
					renderItem={renderWatchlistItem}
					keyExtractor={item => item.id.toString()}
				/>
			</SafeAreaView>
			<ActivityIndicator style={{ flex: 1, marginTop: 20, display: displayLoader }}
				size="small"
				color="#82aaff"
			/>
		</View>
	)
}

const GetWatchlistScreen = inject('loginStore', 'watchlistStore', 'mediaStore')(observer(getTvWatchlistScreen))
export default GetWatchlistScreen
