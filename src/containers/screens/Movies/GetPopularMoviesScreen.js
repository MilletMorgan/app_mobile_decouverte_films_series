import React, { useEffect, useState } from 'react'
import { View, ScrollView, FlatList, ActivityIndicator, Text, RefreshControl } from "react-native";
import { GetPopularMovies } from "../../../api/TheMovieDBApi";
import { inject, observer } from "mobx-react";
import { Movie } from "../../components/MovieItem";
import { FirstMovie } from "../../components/FirstMovieItem";
import { useFocusEffect } from "@react-navigation/native";
import { AddFavoriteFromTmdb } from '../../../features/AddFavoriteFromTmdb';

const getPopularMovieScreen = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		GetPopularMovies().then(movies => {
			props.mediaStore.addMediaToAsyncStorage(movies, 'movie').then(() => {
			})
		})

		AddFavoriteFromTmdb(props, 'movie').then(r => setIsLoading(false))

	}, [])
	const wait = (timeout) => {
		return new Promise(resolve => {
			setTimeout(resolve, timeout);
		});
	}

	useFocusEffect(
		React.useCallback(() => {
			GetPopularMovies().then(movies => {
				props.mediaStore.addMediaToAsyncStorage(movies, 'movie').then(() => {
				})
			})
		}, [props.navigation])
	);

	const renderMovie = ({ item }) => <Movie props={ props } movie={ item }/>
	const renderFirstMovie = ({ item }) => <FirstMovie props={ props } movie={ item }/>
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
						data={props.mediaStore.media.movies.slice(0, 3)}
						renderItem={renderFirstMovie}
						keyExtractor={item => item.media.id.toString()}
					/>
					<View style={{ flex: 1 }}>
						<FlatList
							data={props.mediaStore.media.movies.slice(Math.max(props.mediaStore.media.movies.length - 7, 0))}
							renderItem={renderMovie}
							keyExtractor={item => item.media.id.toString()}
						/>
					</View>
				</View>}
		</ScrollView>
	)
}

const GetPopularMovieScreen = inject('loginStore', 'watchlistStore', 'mediaStore', 'favoritesStore')(observer(getPopularMovieScreen))
export default GetPopularMovieScreen
