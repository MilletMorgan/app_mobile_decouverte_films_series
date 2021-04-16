import React, { useEffect, useState } from 'react'
import {
	Text,
	View,
	Image,
	SafeAreaView,
	FlatList,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator
} from 'react-native'
import {
	GetMovieById,
	GetMediaImage,
	GetMovieCreditById,
	GetMediaVideo,
	GetWatchlist,
	GetRatingList,
	rateMedia
} from "../../../api/TheMovieDBApi";
import { mainStyles } from "../../../styles/mainStyles";
import { WebView } from 'react-native-webview';
import { AddToWatchList } from "../../../features/AddToWatchlist";
import { watchlistStyles } from "../../../styles/watchlistStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RemoveFromWatchlist } from "../../../features/RemoveFromWatchlist";

const Genre = ({ name }) => (
	<View style={ mainStyles.genres }>
		<Text style={ mainStyles.mediaGenre }>{ name }</Text>
	</View>
);

const Actor = ({ name, character }) => (
	<View style={ mainStyles.genres }>
		<Text style={ mainStyles.mediaGenre }>{ name } ({ character })</Text>
	</View>
);

export const GetMovieByIdScreen = ({ route }) => {
	const { id, props } = route.params;
	const [ movie, setMovie ] = useState({
		media: {
			title: '',
			overview: '',
		}
	})
	const [ poster, setPosterUri ] = useState('#')
	const [ displayLoader, setDisplayLoader ] = useState('none')
	const [ trailer, setTrailer ] = useState([])
	const [ credits, setCredits ] = useState({
		cast: [],
		director: []
	})
	const [ genres, setGenres ] = useState([])

	const noteArray = new Array(10)
	noteArray.fill("star")
	const [ score, setScore ] = useState(0)


	useEffect(() => {
		GetMediaVideo(id, 'movie')
			.then(response => setTrailer(response))
			.catch(error => console.error(error))

		GetMovieCreditById(id).then(r => {
			setCredits({
				...credits,
				['cast']: r[0],
				['director']: r[1]
			})
		})

		GetRatingList(props.loginStore.user.session_id, 'movie').then(response => response.data.results.forEach(movieInRatings => {
			if (movieInRatings.id === id) {
				setScore(movieInRatings.rating)
			}
		}))

		GetMovieById(id)
			.then(movieResult => {
				setMovie({
					...movie,
					['inWatchlist']: false,
					['media']: movieResult,
					['media_type']: 'movie'
				})

				setGenres(movieResult.genres)

				GetMediaImage('w500', movieResult.poster_path)
					.then(r => setPosterUri(r))
					.catch(e => console.error(e))

				GetWatchlist(props.loginStore.user.session_id, 'movie')
					.then(response => response.data.results.forEach(movieInWatchlist => {
						if (movieInWatchlist.id === id) {
							AddToWatchList(props, movieResult, 'movie', id, updateList)
						}
					}))
					.catch(e => console.error(e))
			}).catch(e => console.error(e))
	}, [])

	const updateRating = (newScore) => {
		rateMedia(props.loginStore.user.session_id, 'movie', id, newScore).then(r => {
			setScore(newScore)

			AddToWatchList(props, movie, 'movie', id, updateList)
			setMovie({ ...movie, ['inWatchlist']: true })
		})
	}

	const updateList = (mediaUpdated) => {
		mediaUpdated.inWatchlist
			? setMovie({
				...movie,
				['inWatchlist']: true,
				['media']: mediaUpdated.media,
				['media_type']: mediaUpdated.media_type
			})
			: setMovie({
				...movie,
				['inWatchlist']: false,
				['media']: mediaUpdated.media,
				['media_type']: mediaUpdated.media_type
			})
	}

	const renderGenre = ({ item }) => (
		<View>
			<Genre name={ item.name }/>
		</View>
	);

	const renderActor = ({ item }) => (
		<View>
			<Actor name={ item.name } character={ item.character }/>
		</View>
	);

	return (
		<View style={ { flex: 1 } }>
			<View style={ mainStyles.cardDetail }>
				{
					trailer.length > 0 ?
						<View style={ { flex: 0.3 } }>
							<WebView
								allowsFullscreenVideo
								allowsInlineMediaPlayback
								mediaPlaybackRequiresUserAction
								startInLoadingState={ true }
								source={ { uri: `https://www.youtube.com/embed/${ trailer[0].key }` } }
							/>
						</View>
						:
						<View style={ mainStyles.noTrailer }>
						</View>
				}
				<View style={ trailer.length === 0 ? { flex: 1 } : { flex: 0.7 } }>
					<ScrollView style={ { flex: 1 } }>
						<View style={ mainStyles.mediaInfoDetail }>
							<View style={ mainStyles.posterContainerDetail }>
								<Image
									resizeMode="contain"
									style={ [ mainStyles.mediaPoster, { borderRadius: 5 } ] }
									source={ { uri: poster } }
								/>
							</View>

							<View style={ mainStyles.mediaInfoList }>
								<Text style={ mainStyles.mediaTitle }>
									{ movie.media.title }
								</Text>
								<Text style={ mainStyles.mediaInfoText }>Réalisé
									par { credits.director.name }</Text>
								<Text style={ mainStyles.mediaInfoText }>Sortie
									le { movie.media.release_date }</Text>

								<Text style={ mainStyles.mediaInfoText }>Acteurs principaux : </Text>
								<SafeAreaView style={ mainStyles.container }>
									<FlatList
										data={ credits.cast }
										renderItem={ renderActor }
										keyExtractor={ item => item.id.toString() }
									/>
								</SafeAreaView>
								<Text style={ mainStyles.mediaInfoText }>Votre note : </Text>
								<View style={ { flexDirection: "row" } }>{ noteArray.map((v, i) => <TouchableOpacity
									key={ i } onPress={ () => updateRating(i + 1) }>
									<Ionicons name={ v } size={ 20 } color={ i < score ? '#82aaff' : '#202331' }/>
								</TouchableOpacity>) }
								</View>
							</View>
						</View>

						<SafeAreaView style={ { margin: 5 } }>
							<FlatList
								horizontal
								data={ genres }
								renderItem={ renderGenre }
								keyExtractor={ item => item.id.toString() }
							/>
						</SafeAreaView>

						<View style={ { marginLeft: 5, marginRight: 5 } }>
							<Text style={ mainStyles.mediaOverview }>
								{ movie.media.overview }
							</Text>
						</View>


					</ScrollView>
					{
						!movie.inWatchlist
							?
							(<TouchableOpacity
								style={ watchlistStyles.addToWatchlistBtn }
								onPress={ () => {
									setDisplayLoader('flex')
									setTimeout(() => {
										setDisplayLoader('none')
										AddToWatchList(props, movie, 'movie', id, updateList)
										setMovie({ ...movie, ['inWatchlist']: true })
									}, 2000)
								} }>
								<Ionicons name='bookmark-outline' size={ 25 } color={ '#82aaff' }/>
								<Text style={ watchlistStyles.updateWatchlistBtnText }>Watchlist</Text>
								<ActivityIndicator style={ { flex: 0.2, display: displayLoader } }
												   size="small"
												   color="#000"/>
							</TouchableOpacity>)
							:
							(<TouchableOpacity style={ watchlistStyles.removeToWatchlistBtn }
											   onPress={ () => {
												   setDisplayLoader('flex')
												   setTimeout(() => {
													   setDisplayLoader('none')
													   RemoveFromWatchlist(props, movie, 'movie', id, updateList)
													   setMovie({ ...movie, ['inWatchlist']: false })
												   }, 2000)
											   } }>
								<Ionicons name='bookmark' size={ 25 } color={ '#82aaff' }/>
								<Text style={ watchlistStyles.updateWatchlistBtnText }>Watchlist</Text>
								<ActivityIndicator style={ { flex: 0.2, display: displayLoader } }
												   size="small" color="#000"/>
							</TouchableOpacity>)
					}
				</View>
			</View>
		</View>
	)
}
