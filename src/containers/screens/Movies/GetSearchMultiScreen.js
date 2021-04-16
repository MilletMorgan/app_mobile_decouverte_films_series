import React, { useEffect, useState } from "react";
import { GetMediaImage, SearchMedia, } from "../../../api/TheMovieDBApi";
import {
	FlatList,
	Image,
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from "react-native";
import { inject, observer } from "mobx-react";
import { mainStyles } from "../../../styles/mainStyles";
import Ionicons from "react-native-vector-icons/Ionicons";

const Media = ({ props, media }) => {
	const [poster, setPoster] = useState('#')

	useEffect(() => {
		if (media.poster_path)
			GetMediaImage('w500', media.poster_path)
				.then(r => setPoster(r))
				.catch(e => console.error(e))
		else if (media.profile_path)
			GetMediaImage('w500', media.profile_path)
				.then(r => setPoster(r))
				.catch(e => console.error(e))
	}, [])

	const renderKnowFor = ({ item }) => <Text style={ mainStyles.mediaDescription }> - { item.title }</Text>

	return (
		<View style={ mainStyles.card }>
			{
				media.media_type === 'movie' ?
					<TouchableOpacity
						onPress={ () => props.navigation.navigate('GetMovieByIdScreen', { id: media.id,
							props: props }) }>
						<View style={ mainStyles.mediaInfo }>
							<View style={ mainStyles.posterContainerCard }>
								<Image
									resizeMode="contain"
									style={ mainStyles.mediaPoster }
									source={ { uri: poster } }
								/>
							</View>
							<View style={ mainStyles.mediaInfoList }>
								<Text style={ mainStyles.mediaTitle }>{ media.title }</Text>
								<Text style={ mainStyles.mediaReleaseDate }>Type : { media.media_type }</Text>
								<Text style={ mainStyles.mediaReleaseDate }>Sortie le { media.release_date }</Text>
								<Text style={ mainStyles.mediaVote }>
									<Ionicons name='ios-star'
											  size={ 12 }
											  color={ '#ffcb6b' }
									/>
									{ media.vote_average }/10
								</Text>
								<Text style={ mainStyles.mediaOverview }>{
									media.overview.length > 175
										? (((media.overview).substring(0, 175)) + '...')
										: media.overview
								}</Text>
							</View>
						</View>
					</TouchableOpacity>
					: media.media_type === 'tv' ?
					<TouchableOpacity
						onPress={ () => props.navigation.navigate('GetTvByIdScreen', { id: media.id }) }>
						<View style={ mainStyles.mediaInfo }>
							<View style={ mainStyles.posterContainerCard }>
								<Image
									resizeMode="contain"
									style={ mainStyles.mediaPoster }
									source={ { uri: poster } }
								/>
							</View>
							<View style={ mainStyles.mediaInfoList }>
								<Text style={ mainStyles.mediaTitle }>{ media.name }</Text>
								<Text style={ mainStyles.mediaReleaseDate }>Type { media.media_type }</Text>
								<Text style={ mainStyles.mediaReleaseDate }>Sortie le { media.release_date }</Text>
								<Text style={ mainStyles.mediaVote }>{ media.vote_average }/10</Text>
								<Text style={ mainStyles.mediaOverview }>{
									media.overview.length > 175
										? (((media.overview).substring(0, 175)) + '...')
										: media.overview
								}</Text>
							</View>
						</View>
					</TouchableOpacity>

					: media.media_type === 'person' ?
						<TouchableOpacity
							onPress={ () => props.navigation.navigate('GetPersonByIdScreen', { id: media.id }) }>
							<View style={ mainStyles.mediaInfo }>
								<View style={ mainStyles.posterContainerCard }>
									<Image
										resizeMode="contain"
										style={ mainStyles.mediaPoster }
										source={ { uri: poster } }
									/>
								</View>
								<View style={ mainStyles.mediaInfoList }>
									<Text style={ mainStyles.mediaTitle }>{ media.name }</Text>
									<Text
										style={ mainStyles.mediaReleaseDate }>Type { media.media_type === 'person' ? 'Personne' : media.media_type === 'movie' ? 'Film' : 'Série' }</Text>
									<Text style={ mainStyles.mediaDescription }>
										Metier : { media.known_for_department }
									</Text>
									<Text style={ mainStyles.mediaDescription }>Popularité : { media.popularity }</Text>
									<Text style={ mainStyles.mediaDescription }>Connu pour : </Text>
									<SafeAreaView style={ [mainStyles.container, { flex: 0.9 }] }>
										<FlatList
											data={ media.known_for }
											extraData={ media.known_for }
											renderItem={ renderKnowFor }
											keyExtractor={ item => item.id.toString() }
										/>
									</SafeAreaView>
								</View>
							</View>
						</TouchableOpacity>

						:
						<View style={ mainStyles.mediaInfoList }>
							<Text style={ mainStyles.mediaTitle }>{ media.name }</Text>
							<Text
								style={ mainStyles.mediaReleaseDate }>Type { media.media_type }</Text>
							<Text style={ mainStyles.mediaDescription }>
								Metier : { media.known_for_department }
							</Text>
							<Text style={ mainStyles.mediaDescription }>Popularité : { media.popularity }</Text>
							<Text style={ mainStyles.mediaDescription }>Connu pour : </Text>
							<SafeAreaView style={ [mainStyles.container, { flex: 0.9 }] }>
								<FlatList
									data={ media.known_for }
									extraData={ media.known_for }
									renderItem={ renderKnowFor }
									keyExtractor={ item => item.id.toString() }
								/>
							</SafeAreaView>
						</View>
			}
		</View>
	)
}

const getSearchMultiScreen = (props) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [resultSearch, setResultSearch] = useState()

	const renderMedia = ({ item }) => <Media props={ props } media={ item }/>

	const searchMulti = (query) => {
		if (query.length > 0)
			SearchMedia(query).then(r => setResultSearch(r)).catch(e => console.error("test search error :", e))
	}

	return (
		<View style={ { flex: 1 } }>
			<View style={ mainStyles.searchBar }>
				<TextInput style={ { flex: 0.8, color: '#000000' } }
						   onChangeText={ text => {
							   setSearchQuery(text)
							   searchMulti(text)
						   } }
						   value={ searchQuery }
						   placeholder={ "Rechercher un film, un acteur, une série..." }
						   onSubmitEditing={ () => searchMulti(searchQuery) }
				/>
				<TouchableOpacity style={ { flex: 0.2 } } onPress={ () => {
					searchMulti(searchQuery)
				} }>
					<Ionicons name={ 'ios-search' } size={ 40 } color={ 'gray' }/>
				</TouchableOpacity>
			</View>


			<SafeAreaView style={ [mainStyles.container, { flex: 0.9 }] }>
				<FlatList
					data={ resultSearch }
					extraData={ resultSearch }
					renderItem={ renderMedia }
					keyExtractor={ item => item.id.toString() }
				/>
			</SafeAreaView>
		</View>

	)
}

const GetSearchMultiScreen = inject('loginStore', 'watchlistStore', 'mediaStore')(observer(getSearchMultiScreen))
export default GetSearchMultiScreen
