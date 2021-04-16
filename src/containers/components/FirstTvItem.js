import React, { useEffect, useState } from 'react'
import { GetMediaImage, GetWatchlist, GetFavoriteList } from "../../api/TheMovieDBApi";
import { AddToWatchList } from "../../features/AddToWatchlist";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { watchlistStyles } from "../../styles/watchlistStyles";
import { RemoveFromWatchlist } from "../../features/RemoveFromWatchlist";
import { AddToFavorites } from "../../features/AddToFavorites";
import { RemoveFavoriteFromTmdb } from "../../features/RemoveFavoriteFromTmdb";
import { useFocusEffect } from "@react-navigation/native";

export const FirstTv = ({ props, tv }) => {
	const [poster, setPoster] = useState('#')
	const [isFavorite, setIsFavorite] = useState(false)
	const [displayLoader, setDisplayLoader] = useState('none')
	const [tvInfo, setTvInfo] = useState({
		media: {
			name: '',
			overview: '',
		}
	})

	useEffect(() => {
		GetMediaImage('w500', tv.media.poster_path)
			.then(r => setPoster(r))
			.catch(e => console.error(e))

		setTvInfo(tv)

		props.favoritesStore.favorites.favoritesTv.forEach(tvInFavorites => {
			if (tvInFavorites.id === tv.media.id) {
				AddToFavorites(props, tv.media.id, "tv"), setIsFavorite(true)

			}
		})

		GetWatchlist(props.loginStore.user.session_id, 'tv')
			.then(response => response.data.results.forEach(tvInWatchlist => {
				if (tvInWatchlist.id === tv.media.id)
					AddToWatchList(props, tv, "tv", tv.media.id, updateList)
				}
			)).catch(error => console.error("GetWatchlist ERROR : ", error))
	}, [])

	useFocusEffect(
		React.useCallback(() => {
			let tvFromStore = props.mediaStore.media.movies
				.filter(tvInStore => tvInStore.media.id === tv.media.id)

			if (!tvFromStore.inWatchlist)
				setTvInfo({
					...tvInfo,
					['inWatchlist']: false,
					['media']: tv.media,
					['media_type']: tv.media_type
				})

			GetWatchlist(props.loginStore.user.session_id, 'tv')
				.then(response => response.data.results.forEach(tvInWatchlist => {
						if (tvInWatchlist.id === tv.media.id)
							AddToWatchList(props, tv, "tv", tv.media.id, updateList)
					}
				)).catch(error => console.error("GetWatchlist ERROR : ", error))
		}, [props.navigation])
	);

	const updateList = (mediaUpdated) => {
		mediaUpdated.inWatchlist
			? setTvInfo({
				...tvInfo,
				['inWatchlist']: true,
				['media']: mediaUpdated.media,
				['media_type']: mediaUpdated.media_type
			})
			: setTvInfo({
				...tvInfo,
				['inWatchlist']: false,
				['media']: mediaUpdated.media,
				['media_type']: mediaUpdated.media_type
			})
	}

	return (
		<View style={ styles.card }>
			<TouchableOpacity style={ { flex: 0.8 } }
							  onPress={ () => props.navigation.navigate('GetTvByIdScreen', {
								  id: tvInfo.media.id,
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
						{ tvInfo.media.vote_average }/10
					</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity
				style={ { position: 'absolute', right: 0 } }
				onPress={ () => {
					if (!isFavorite) {
						AddToFavorites(props, tv.media.id, 'tv').then(() => setIsFavorite(true))
					} else {
						RemoveFavoriteFromTmdb(props, 'tv', tv.media.id).then(() => setIsFavorite(false))
					}
				} }>
				{ isFavorite ? <Ionicons name='ios-star' size={ 25 } color='yellow'/>
					: <Ionicons name='ios-star' size={ 25 } color='grey'/>
				}
			</TouchableOpacity>
			{
				!tvInfo.inWatchlist
					?
					(<TouchableOpacity style={ watchlistStyles.addToWatchlistBtn }
									   onPress={ () => {
										   setDisplayLoader('flex')
										   setTimeout(() => {
											   setDisplayLoader('none')
											   AddToWatchList(props, tv, 'tv', tv.media.id, updateList)
											   setTvInfo({ ...tvInfo, ['inWatchlist']: true })
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
											   RemoveFromWatchlist(props, tv, 'tv', tv.media.id, updateList)
											   setTvInfo({ ...tvInfo, ['inWatchlist']: false })
										   }, 2000)
									   } }>
						<Ionicons name='bookmark' size={ 25 } color={ '#82aaff' }/>
						<Text style={ watchlistStyles.updateWatchlistBtnText }>Watchlist</Text>
						<ActivityIndicator style={ { flex: 0.2, display: displayLoader } } size="small" color="#000"/>
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
