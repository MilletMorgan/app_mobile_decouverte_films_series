import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { GetMediaImage, GetWatchlist, GetFavoriteList } from "../../api/TheMovieDBApi";
import { watchlistStyles } from "../../styles/watchlistStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AddToWatchList } from "../../features/AddToWatchlist";
import { RemoveFromWatchlist } from "../../features/RemoveFromWatchlist";
import { useFocusEffect } from "@react-navigation/native";
import { AddToFavorites } from "../../features/AddToFavorites";
import { RemoveFavoriteFromTmdb } from "../../features/RemoveFavoriteFromTmdb";

export const FirstMovie = ({ props, movie }) => {
	const [poster, setPoster] = useState('#')
	const [isFavorite, setIsFavorite] = useState(false)
	const [displayLoader, setDisplayLoader] = useState('none')
	const [movieInfo, setMovieInfo] = useState({
		media: {
			title: '',
			overview: '',
		}
	})

	useEffect(() => {
		GetMediaImage('w500', movie.media.poster_path)
			.then(r => setPoster(r))
			.catch(e => console.error(e))

		setMovieInfo(movie)

		props.favoritesStore.favorites.favoritesMovie.forEach(movieInFavorites => {
			if (movieInFavorites.id === movie.media.id) {
				AddToFavorites(props, movie.media.id, "movie"), setIsFavorite(true)
			}
		})

		GetWatchlist(props.loginStore.user.session_id, 'movie')
			.then(response => response.data.results.forEach(movieInWatchlist => {
					if (movieInWatchlist.id === movie.media.id)
						AddToWatchList(props, movie, "movie", movie.media.id, updateList)
				}
			)).catch(error => console.error("GetWatchlist ERROR : ", error))
	}, [])

	useFocusEffect(
		React.useCallback(() => {
			let movieFromStore = props.mediaStore.media.movies
				.filter(movieInStore => movieInStore.media.id === movie.media.id)

			if (!movieFromStore.inWatchlist)
				setMovieInfo({ ...movieInfo,
					['inWatchlist']: false,
					['media']: movie.media,
					['media_type']: movie.media_type
				})

			GetWatchlist(props.loginStore.user.session_id, 'movie')
				.then(response => response.data.results.forEach(movieInWatchlist => {
						if (movieInWatchlist.id === movie.media.id)
							AddToWatchList(props, movie, "movie", movie.media.id, updateList)
					}
				)).catch(error => console.error("GetWatchlist ERROR : ", error))
		}, [props.navigation])
	);

	const updateList = (mediaUpdated) => {
		mediaUpdated.inWatchlist
			? setMovieInfo({
				...movieInfo,
				['inWatchlist']: true,
				['media']: mediaUpdated.media,
				['media_type']: mediaUpdated.media_type
			})
			: setMovieInfo({
				...movieInfo,
				['inWatchlist']: false,
				['media']: mediaUpdated.media,
				['media_type']: mediaUpdated.media_type
			})
	}

	return (
		<View style={ styles.card }>
			<TouchableOpacity style={ { flex: 0.8 } }
							  onPress={ () => props.navigation.navigate('GetMovieByIdScreen', {
								  id: movieInfo.media.id,
								  props: props
							  }) }>
				<View style={ styles.mediaInfo }>
					<View style={ { flex: 1 } }>
						<Image
							resizeMode="cover"
							style={ styles.mediaPoster }
							source={ { uri: poster } }
						/>
					</View>

					<Text style={ styles.mediaVote }>
						<Ionicons name='ios-star'
								  size={ 12 }
								  color={ '#ffcb6b' }
						/>
						{ movieInfo.media.vote_average }/10
					</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={ { position: 'absolute', right: 0 } }
				onPress={ () => {
					if (!isFavorite) {
						AddToFavorites(props, movie.media.id, 'movie').then(() => setIsFavorite(true))
					} else {
						RemoveFavoriteFromTmdb(props, 'movie', movie.media.id).then(() => setIsFavorite(false))
					}
				} }>
				{ isFavorite ? <Ionicons name='ios-star' size={ 25 } color='yellow'/>
					: <Ionicons name='ios-star' size={ 25 } color='grey'/>
				}
			</TouchableOpacity>
			{
				!movieInfo.inWatchlist
					?
					(<TouchableOpacity style={ watchlistStyles.addToWatchlistBtn }
									   onPress={ () => {
										   setDisplayLoader('flex')
										   setTimeout(() => {
											   setDisplayLoader('none')
											   AddToWatchList(props, movie, "movie", movieInfo.media.id, updateList)
											   setMovieInfo({ ...movieInfo, ['inWatchlist']: true })
										   }, 2000)
									   } }>
						<Ionicons name='bookmark-outline' size={ 25 } color={ '#82aaff' }/>
						<Text style={ watchlistStyles.updateWatchlistBtnText }>Watchlist</Text>
						<ActivityIndicator style={ { flex: 0.2, display: displayLoader } } size="small"
										   color="#000"/>
					</TouchableOpacity>)
					:
					(<TouchableOpacity style={ watchlistStyles.removeToWatchlistBtn }
									   onPress={ () => {
										   setDisplayLoader('flex')
										   setTimeout(() => {
											   setDisplayLoader('none')
											   RemoveFromWatchlist(props, movie, 'movie', movieInfo.media.id, updateList)
											   setMovieInfo({ ...movieInfo, ['inWatchlist']: false })
										   }, 2000)
									   } }>
						<Ionicons name='bookmark' size={ 25 } color={ '#82aaff' }/>
						<Text style={ watchlistStyles.updateWatchlistBtnText }>Watchlist</Text>
						<ActivityIndicator style={ { flex: 0.2, display: displayLoader } } size="small"
										   color="#000"/>
					</TouchableOpacity>)
			}
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		margin: 5,
		backgroundColor: '#34324a',
		borderRadius: 5,
	},

	mediaInfo: {
		position: 'relative'
	},

	mediaVote: {
		position: 'absolute',
		backgroundColor: 'rgba(32, 35, 49, 0.8)',
		borderRadius: 20,
		margin: 5,
		padding: 5,
		color: '#676E95',
	},

	mediaPoster: {
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		minHeight: 300,
		minWidth: 225,
	},
})
