import { GetPopularTv } from "../../../api/TheMovieDBApi";
import React, { useEffect, useState } from 'react'
import { View, FlatList, ScrollView, RefreshControl } from "react-native";
import { inject, observer } from "mobx-react";
import { TV } from "../../components/TvItem";
import { FirstTv } from "../../components/FirstTvItem";
import { useFocusEffect } from "@react-navigation/native";
import { AddFavoriteFromTmdb } from '../../../features/AddFavoriteFromTmdb';


const getPopularTVScreen = (props) => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		GetPopularTv().then(tv => {
			props.mediaStore.addMediaToAsyncStorage(tv, 'tv').then(() => {
			})
		})
		AddFavoriteFromTmdb(props, 'tv').then(r => setIsLoading(false))

	}, [])

	useFocusEffect(
		React.useCallback(() => {
			GetPopularTv().then(tv => {
				props.mediaStore.addMediaToAsyncStorage(tv, 'tv').then(() => {
				})
			})
		}, [props.navigation])
	);

	const renderTV = ({ item }) => <TV props={ props } tv={ item }/>
	const renderFirstTv = ({ item }) => <FirstTv props={ props } tv={ item }/>

	const wait = (timeout) => {
		return new Promise(resolve => {
			setTimeout(resolve, timeout);
		});
	}

	const onRefresh = React.useCallback(() => {
		setIsLoading(true);

		wait(2000).then(() => setIsLoading(false));
	}, []);

	return (
		<ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh}></RefreshControl>}>
			{!isLoading &&
				<View style={{ flex: 1 }}>
					<FlatList
						horizontal
						data={props.mediaStore.media.tvs.slice(0, 3)}
						extraData={props.mediaStore.media.tvs.slice(0, 3)}
						renderItem={renderFirstTv}
						keyExtractor={item => item.media.id.toString()}
					/>
					<View style={{ flex: 1 }}>
						<FlatList
							data={props.mediaStore.media.tvs.slice(Math.max(props.mediaStore.media.tvs.length - 7, 0))}
							extraData={props.mediaStore.media.tvs.slice(Math.max(props.mediaStore.media.tvs.length - 7, 0))}
							renderItem={renderTV}
							keyExtractor={item => item.media.id.toString()}
						/>
					</View>
				</View>}
		</ScrollView>
	)
}

const GetPopularTVScreen = inject('loginStore', 'watchlistStore', 'mediaStore', 'favoritesStore')(observer(getPopularTVScreen))
export default GetPopularTVScreen
