import React, { useEffect, useState } from 'react'
import { GetFavoriteList, GetMediaImage, GetWatchlist } from "../../api/TheMovieDBApi";
import { AddToWatchList } from "../../features/AddToWatchlist";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { mainStyles } from "../../styles/mainStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { watchlistStyles } from "../../styles/watchlistStyles";
import { RemoveFromWatchlist } from "../../features/RemoveFromWatchlist";
import { AddToFavorites } from "../../features/AddToFavorites";
import { RemoveFavoriteFromTmdb } from "../../features/RemoveFavoriteFromTmdb";
import { useFocusEffect } from "@react-navigation/native";

export const TV = ({ props, tv }) => {
	const [ poster, setPoster ] = useState('#')
	const [ isFavorite, setIsFavorite ] = useState(false)
	const [ displayLoader, setDisplayLoader ] = useState('none')
	const [ tvInfo, setTvInfo ] = useState({
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
		}, [ props.navigation ])
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
		<View style={ mainStyles.card }>
			<TouchableOpacity
				onPress={ () => props.navigation.navigate('GetTvByIdScreen', { id: tvInfo.media.id, props: props }) }>
				<View style={ mainStyles.mediaInfo }>
					<View style={ mainStyles.posterContainerCard }>
						<Image
							resizeMode="contain"
							style={ mainStyles.mediaPoster }
							source={ { uri: poster } }
						/>
					</View>

					<View style={ mainStyles.mediaInfoList }>
						<Text style={ mainStyles.mediaTitle }>{ tvInfo.media.name }</Text>
						<Text style={ mainStyles.mediaReleaseDate }>Sortie le { tvInfo.media.release_date }</Text>
						<Text style={ mainStyles.mediaVote }>
							<Ionicons name='ios-star'
									  size={ 12 }
									  color={ '#ffcb6b' }
							/>
							{ tvInfo.media.vote_average }/10
						</Text>
						<Text style={ mainStyles.mediaOverview }>{
							tv.media.overview.length > 200
								? (((tv.media.overview).substring(0, 200)) + '...')
								: tv.media.overview
						}</Text>
					</View>

					<TouchableOpacity
						style={ mainStyles.favorite }
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
				</View>
			</TouchableOpacity>

			{
				!tvInfo.inWatchlist
					?
					(<TouchableOpacity style={ [ watchlistStyles.addToWatchlistBtn, { flex: 0.2 } ] }
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
