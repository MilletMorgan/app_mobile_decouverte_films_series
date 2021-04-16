import React, { useEffect, useState } from "react";
import { GetMediaImage } from "../../api/TheMovieDBApi";
import { RemoveMediaFromTmdbWatchlist } from "../../features/RemoveMediaFromTmdbWatchlist";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { watchlistStyles } from "../../styles/watchlistStyles";
import { mainStyles } from "../../styles/mainStyles";
import Ionicons from "react-native-vector-icons/Ionicons";

export const WatchlistItem = ({ watchlist, props, media_type }) => {
	const [ poster, setPoster ] = useState('#')
	const [ displayLoader, setDisplayLoader ] = useState('none')

	useEffect(() => {
		GetMediaImage('w500', watchlist.poster_path)
			.then(r => setPoster(r))
			.catch(e => console.error(e))
	}, [])

	return (
		<View style={ mainStyles.card }>
			<TouchableOpacity onPress={ () => {
				if (media_type === 'tv')
					props.navigation.navigate('GetTvByIdScreen', { id: watchlist.id,
						props: props })
				else
					props.navigation.navigate('GetMovieByIdScreen', { id: watchlist.id,
						props: props })
			} }>
				<View style={ mainStyles.mediaInfo }>
					<View style={  mainStyles.posterContainerCard }>
						<Image
							resizeMode="contain"
							style={ mainStyles.mediaPoster }
							source={ { uri: poster } }
						/>
					</View>

					<View style={ mainStyles.mediaInfoList }>
						<Text style={ mainStyles.mediaTitle }>{ watchlist.name || watchlist.title }</Text>
						<Text style={ mainStyles.mediaReleaseDate }>Sortie le { watchlist.release_date }</Text>
						<Text style={ mainStyles.mediaVote }>
							<Ionicons name='ios-star'
									  size={ 12 }
									  color={ '#ffcb6b' }
							/>
							{ watchlist.vote_average }/10
						</Text>
						<Text style={ mainStyles.mediaOverview }>{
							watchlist.overview.length > 200
								? (((watchlist.overview).substring(0, 200)) + '...')
								: watchlist.overview
						}</Text>
					</View>
				</View>
			</TouchableOpacity>
			<TouchableOpacity style={ watchlistStyles.removeToWatchlistBtn }
							  onPress={ () => {
								  setDisplayLoader('flex')
								  RemoveMediaFromTmdbWatchlist(props, media_type, watchlist.id)
							  } }>
				<Ionicons name='bookmark' size={ 25 } color={ '#82aaff' }/>
				<Text style={ watchlistStyles.updateWatchlistBtnText }>Watchlist</Text>
				<ActivityIndicator style={ { flex: 0.2, display: displayLoader } } size="small" color="#000"/>
			</TouchableOpacity>
		</View>
	)
}
